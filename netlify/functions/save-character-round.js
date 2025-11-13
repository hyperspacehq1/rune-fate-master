// netlify/functions/save-character-round.js

export async function handler(event) {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Method not allowed' })
      };
    }

    const body = JSON.parse(event.body || '{}');

    // Expect something like:
    // {
    //   character: {
    //     id: 1,               // optional – if existing
    //     name: "Draven Galanodel",
    //     image: "ranger-active-DWKj60Y8.jpg",
    //     companion_name: "Koda",
    //     companion_image_active: "wolf-active-C1YNs0sA.jpg",
    //     companion_image_inactive: "wolf-inactive-cARMk32g.jpg",
    //     abilities: ["First Round"],
    //     spells: ["Dreadful Strike", "Hunter's Mark", "Zephyr Strike"],
    //     weapons: ["Scimitar + Shortsword", "Scimitar", "Longbow (+2 Magic)"],
    //     attack_names: ["1st Attack", "2nd Attack", "Gloomstalker", "Shortsword"]
    //   },
    //   round_number: 1,
    //   attacks: [
    //     {
    //       attack_number: 1,
    //       hit_roll: 16,
    //       hit_roll_total: 23,
    //       bonuses: {
    //         str: 0,
    //         dex: 4,
    //         wis: 0,
    //         con: 0,
    //         cha: 0,
    //         int: 0,
    //         prof: 3
    //       },
    //       total_damage: 21,
    //       dice_breakdown: "Base d6: 5, Htmk d6: 4, Dstk d6: 3, Dstk d6: 5",
    //       active_abilities: ["First Round"],
    //       active_spells: ["Hunter's Mark", "Dreadful Strike"],
    //       active_weapons: ["Scimitar"]
    //     }
    //   ]
    // }

    const { character, round_number, attacks } = body;

    if (!character || !round_number || !Array.isArray(attacks)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing character, round_number, or attacks array' })
      };
    }

    // Start a transaction so everything is consistent
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      let characterId = character.id;

      // If no character.id provided, create one
      if (!characterId) {
        const insertChar = await client.query(
          `
          INSERT INTO character_profile (
            name, image, companion_name,
            companion_image_active, companion_image_inactive,
            abilities, spells, weapons, attack_names
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          RETURNING id
          `,
          [
            character.name,
            character.image,
            character.companion_name,
            character.companion_image_active,
            character.companion_image_inactive,
            character.abilities || [],
            character.spells || [],
            character.weapons || [],
            character.attack_names || []
          ]
        );
        characterId = insertChar.rows[0].id;
      }

      // Create round
      const insertRound = await client.query(
        `
        INSERT INTO round (character_id, round_number)
        VALUES ($1, $2)
        RETURNING id
        `,
        [characterId, round_number]
      );

      const roundId = insertRound.rows[0].id;

      // Insert each attack
      for (const atk of attacks) {
        const bonuses = atk.bonuses || {};

        const insertAttack = await client.query(
          `
          INSERT INTO attack (
            round_id, attack_number,
            hit_roll, hit_roll_total,
            strength_bonus, dexterity_bonus, wisdom_bonus,
            constitution_bonus, charisma_bonus, intelligence_bonus,
            proficiency_bonus, total_damage, dice_breakdown
          )
          VALUES (
            $1, $2,
            $3, $4,
            $5, $6, $7,
            $8, $9, $10,
            $11, $12, $13
          )
          RETURNING id
          `,
          [
            roundId,
            atk.attack_number,
            atk.hit_roll,
            atk.hit_roll_total,
            bonuses.str ?? 0,
            bonuses.dex ?? 0,
            bonuses.wis ?? 0,
            bonuses.con ?? 0,
            bonuses.cha ?? 0,
            bonuses.int ?? 0,
            bonuses.prof ?? 0,
            atk.total_damage,
            atk.dice_breakdown || ''
          ]
        );

        const attackId = insertAttack.rows[0].id;

        // Insert active abilities
        if (Array.isArray(atk.active_abilities)) {
          for (const ability of atk.active_abilities) {
            await client.query(
              `
              INSERT INTO attack_active_ability (attack_id, ability_name)
              VALUES ($1, $2)
              `,
              [attackId, ability]
            );
          }
        }

        // Insert active spells
        if (Array.isArray(atk.active_spells)) {
          for (const spell of atk.active_spells) {
            await client.query(
              `
              INSERT INTO attack_active_spell (attack_id, spell_name)
              VALUES ($1, $2)
              `,
              [attackId, spell]
            );
          }
        }

        // Insert active weapons
        if (Array.isArray(atk.active_weapons)) {
          for (const weapon of atk.active_weapons) {
            await client.query(
              `
              INSERT INTO attack_active_weapon (attack_id, weapon_name)
              VALUES ($1, $2)
              `,
              [attackId, weapon]
            );
          }
        }
      }

      await client.query('COMMIT');

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          character_id: characterId,
          round_id: roundId
        })
      };
    } catch (err) {
      await client.query('ROLLBACK');
      console.error('save-character-round transaction error:', err);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: err.message })
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('save-character-round top-level error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}


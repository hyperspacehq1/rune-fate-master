// netlify/functions/get-character.js

export async function handler(event, context) {
  const { Pool } = await import('pg');
  const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL
  });

  try {
    if (event.httpMethod !== "GET") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" })
      };
    }

    // characterId is set in Netlify Environment Variables on each subdomain
    const characterId = process.env.CHARACTER_ID;

    if (!characterId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "CHARACTER_ID missing in environment" })
      };
    }

    // Query parameters:
    // round=<number>
    // mode=latest
    const url = new URL(event.rawUrl);
    const roundQuery = url.searchParams.get("round");
    const mode = url.searchParams.get("mode");

    const client = await pool.connect();

    try {
      //
      // 1) LOAD CHARACTER PROFILE
      //
      const characterResult = await client.query(
        `SELECT * FROM character_profile WHERE id = $1`,
        [characterId]
      );

      if (characterResult.rows.length === 0) {
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Character not found" })
        };
      }

      const character = characterResult.rows[0];

      //
      // 2) LOAD ROUNDS (one, all, or latest)
      //
      let roundsResult;

      // A) Load specific round by query param: ?round=1
      if (roundQuery) {
        roundsResult = await client.query(
          `
            SELECT * FROM round
            WHERE character_id = $1 AND round_number = $2
            ORDER BY round_number ASC
          `,
          [characterId, Number(roundQuery)]
        );
      }
      // B) Load latest round: ?mode=latest
      else if (mode === "latest") {
        roundsResult = await client.query(
          `
            SELECT *
            FROM round
            WHERE character_id = $1
            ORDER BY round_number DESC
            LIMIT 1
          `,
          [characterId]
        );
      }
      // C) Default: Load ALL rounds
      else {
        roundsResult = await client.query(
          `
            SELECT *
            FROM round
            WHERE character_id = $1
            ORDER BY round_number ASC
          `,
          [characterId]
        );
      }

      const rounds = roundsResult.rows;

      //
      // 3) For each round, load attacks + active abilities/spells/weapons
      //
      for (const round of rounds) {
        const attacks = await client.query(
          `
            SELECT *
            FROM attack
            WHERE round_id = $1
            ORDER BY attack_number ASC
          `,
          [round.id]
        );

        round.attacks = [];

        for (const attack of attacks.rows) {
          //
          // Load active abilities
          //
          const abilities = await client.query(
            `
              SELECT ability_name
              FROM attack_active_ability
              WHERE attack_id = $1
            `,
            [attack.id]
          );

          //
          // Load active spells
          //
          const spells = await client.query(
            `
              SELECT spell_name
              FROM attack_active_spell
              WHERE attack_id = $1
            `,
            [attack.id]
          );

          //
          // Load active weapons
          //
          const weapons = await client.query(
            `
              SELECT weapon_name
              FROM attack_active_weapon
              WHERE attack_id = $1
            `,
            [attack.id]
          );

          //
          // Attach all nested data
          //
          attack.active_abilities = abilities.rows.map(a => a.ability_name);
          attack.active_spells = spells.rows.map(s => s.spell_name);
          attack.active_weapons = weapons.rows.map(w => w.weapon_name);

          round.attacks.push(attack);
        }
      }

      // Final response
      return {
        statusCode: 200,
        body: JSON.stringify({
          character,
          rounds,
          mode: mode || "all",
          round_requested: roundQuery || null
        })
      };

    } finally {
      client.release();
    }

  } catch (err) {
    console.error("get-character ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

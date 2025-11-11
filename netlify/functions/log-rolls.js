export async function handler(event) {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    const body = JSON.parse(event.body || '{}');
    const { session_id, roll_type, characters } = body;

    if (!characters || !Array.isArray(characters)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing or invalid "characters" array' })
      };
    }

    const player = characters.length > 1 ? 'Party' : (characters[0]?.name || 'Unknown');
    const rolls = JSON.stringify(characters);
    const message = session_id || 'Session log';

    // ✅ Updated insert query
    const insert = await pool.query(
      `INSERT INTO roll_logs (player, timestamp, rolls, message, session_id, roll_type)
       VALUES ($1, NOW(), $2, $3, $4, $5)
       RETURNING *`,
      [player, rolls, message, session_id || null, roll_type || null]
    );

    const record = insert.rows[0];

    // Optional: Send to your rune-fate-log webhook
    const webhookUrl = process.env.RUNE_FATE_LOG_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, record })
    };
  } catch (err) {
    console.error('Log-rolls error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

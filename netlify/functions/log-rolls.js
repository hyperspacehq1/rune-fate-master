export async function handler(event) {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    const body = JSON.parse(event.body || '{}');
    const rolls = body.characters || [];
    const player = 'Party';
    const message = body.session_id || 'Session log';

    // 1️⃣ Insert into Neon
    const insert = await pool.query(
      `INSERT INTO roll_logs (player, timestamp, rolls, message)
       VALUES ($1, NOW(), $2, $3)
       RETURNING *`,
      [player, JSON.stringify(rolls), message]
    );

    const record = insert.rows[0];

    // 2️⃣ Send webhook to rune-fate-log app
    const webhookUrl = process.env.RUNE_FATE_LOG_WEBHOOK_URL; // set this in Netlify env vars
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

export async function handler(event) {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    // Parse any provided input (optional)
    const body = JSON.parse(event.body || '{}');
    const player = body.player || 'Test_Player';
    const rolls = body.rolls || [{ die: 'd20', result: 12 }];
    const message = body.message || 'Test insert from Netlify function';

    const insert = await pool.query(
      `INSERT INTO roll_logs (player, timestamp, rolls, message)
       VALUES ($1, NOW(), $2, $3)
       RETURNING *`,
      [player, JSON.stringify(rolls), message]
    );

    return {
      statusCode: 200,
      body: JSON.stringify(insert.rows[0])
    };
  } catch (err) {
    console.error('DB Insert Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

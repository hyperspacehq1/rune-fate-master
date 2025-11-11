export async function handler() {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });

  try {
    // try writing a test row
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roll_logs (
        id SERIAL PRIMARY KEY,
        message TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    const insert = await pool.query(
      'INSERT INTO roll_logs (message) VALUES ($1) RETURNING *',
      ['test entry from Netlify']
    );

    return {
      statusCode: 200,
      body: JSON.stringify(insert.rows)
    };
  } catch (err) {
    console.error('DB Error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}

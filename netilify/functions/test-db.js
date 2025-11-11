export async function handler() {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString: process.env.NETLIFY_DATABASE_URL });
  
  const result = await pool.query('SELECT NOW() AS now');
  return {
    statusCode: 200,
    body: JSON.stringify(result.rows)
  };
}
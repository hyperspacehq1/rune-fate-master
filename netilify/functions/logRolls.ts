import { Handler } from "@netlify/functions";
import { Pool } from "pg";

const pool = new Pool({
  connectionString:
    process.env.NETLIFY_DATABASE_URL ||
    process.env.NETLIFY_DATABASE_URL_UNPOOLED ||
    process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { player, rolls } = body;

    if (!player || !rolls) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing player or rolls data" }),
      };
    }

    const result = await pool.query(
      `INSERT INTO roll_logs (player, rolls)
       VALUES ($1, $2)
       RETURNING id, player, timestamp, rolls, created_at`,
      [player, JSON.stringify(rolls)]
    );

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result.rows[0]),
    };
  } catch (err) {
    console.error("DB Insert Error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Database insert error",
        details: String(err),
      }),
    };
  }
};

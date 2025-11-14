export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { Pool } = await import("pg");
  const pool = new Pool({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const CHARACTER_ID = process.env.CHARACTER_ID;
    if (!CHARACTER_ID) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "CHARACTER_ID missing" })
      };
    }

    const data = JSON.parse(event.body);

    const allowed = {
      name: "name",
      companion_name: "companion_name",
      image: "image",
      companion_image_active: "companion_image_active",
      companion_image_inactive: "companion_image_inactive"
    };

    const fields = [];
    const values = [];
    let idx = 1;

    for (const [key, col] of Object.entries(allowed)) {
      if (data[key] !== undefined) {
        fields.push(`${col} = $${idx}`);
        values.push(data[key]);
        idx++;
      }
    }

    if (fields.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No valid fields" })
      };
    }

    values.push(CHARACTER_ID);

    const sql = `
      UPDATE character_profile
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const result = await pool.query(sql, values);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        character: result.rows[0]
      })
    };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};

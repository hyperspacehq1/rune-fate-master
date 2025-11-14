import { getStore } from "@netlify/blobs";

export const handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const contentType = event.headers["content-type"] || "";
    const boundary = contentType.split("boundary=")[1];

    if (!boundary) {
      return { statusCode: 400, body: "Invalid multipart form data" };
    }

    const body = Buffer.from(event.body, "base64");
    const parts = body.toString().split(`--${boundary}`);

    let fileBuffer = null;
    let filename = "upload-" + Date.now() + ".jpg";

    for (const part of parts) {
      if (part.includes("filename=")) {
        const match = part.match(/filename="(.+?)"/);
        if (match) filename = match[1];

        const start = part.indexOf("\r\n\r\n") + 4;
        const end = part.lastIndexOf("\r\n");
        fileBuffer = Buffer.from(part.slice(start, end));
      }
    }

    if (!fileBuffer) {
      return { statusCode: 400, body: "No file received" };
    }

    const store = getStore("character-images");
    const path = `characters/${filename}`;

    await store.set(path, fileBuffer, {
      contentType: "image/jpeg"
    });

    const publicUrl = store.getPublicUrl(path);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        url: publicUrl
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

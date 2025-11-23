import fetch from "node-fetch";

// Your Google Apps Script URL
const GSHEET_URL = "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Helper to parse request body in Vercel serverless
async function getJSON(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        resolve({});
      }
    });
    req.on("error", err => reject(err));
  });
}

export default async function handler(req, res) {
  try {
    const data = req.method === "POST" ? await getJSON(req) : req.query;

    if (!data.device || !data.raw || !data.voltage) {
      res.status(400).send("Missing parameters");
      return;
    }

    // Forward to Google Apps Script
    const qs = new URLSearchParams({
      device: data.device,
      raw: data.raw,
      voltage: data.voltage
    });

    const gsResponse = await fetch(`${GSHEET_URL}?${qs.toString()}`);
    const text = await gsResponse.text();

    res.status(200).send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send("Proxy error: " + err.message);
  }
}

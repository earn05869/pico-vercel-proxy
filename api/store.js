// api/store.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Only POST allowed");
  }

  try {
    // Replace with your GAS URL (Deploy -> Web app)
    const GAS_URL = "https://script.google.com/macros/s/AKfycbzt3_B5MFUNl_WFwWWPHWuYxtNLudg3O8GbrSTq76kSd7E3YIRwI5hQpzsFgEZvIP8/exec";

    // Forward payload to GAS as JSON body
    const r = await fetch(GAS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    return res.status(200).send(text);

  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).send("Proxy Error");
  }
}

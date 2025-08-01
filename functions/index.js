const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = (...args) => import("node-fetch").then(({default: fetch}) => fetch(...args));

admin.initializeApp();

exports.analyzeImageWithGemini = functions.database
  .ref("/images/latest/url")
  .onWrite(async (change, context) => {
    const imageUrl = change.after.val();
    if (!imageUrl) return null;

    const geminiApiKey = functions.config().gemini.key;
    const prompt = "what objects are in the image?";

    try {
      const imageBuffer = await fetch(imageUrl).then(res => res.arrayBuffer());
      const base64 = Buffer.from(imageBuffer).toString("base64");

      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: base64
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key=${geminiApiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const text = result?.candidates?.[0]?.content?.parts?.[0]?.text || "⚠️ Gemini returned no answer.";
      
      console.log("🧠 Gemini says:", text);
      await admin.database().ref("/images/latest/result").set(text);
      return null;
    } catch (error) {
      console.error("❌ Error during Gemini request:", error);
      return null;
    }
  });

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI API
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


app.post("/extract-claims", async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) return res.status(400).json({ error: "No text provided" });

        const prompt = `prompt here:\n\n${text}\n\nClaims:`;
        const response = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [{ role: "system", content: "You are a claim extraction assistant." }, { role: "user", content: prompt }]
        });

        const claims = response.data.choices[0].message.content.split("\n").filter(c => c.trim());
        res.json({ claims });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to extract claims" });
    }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

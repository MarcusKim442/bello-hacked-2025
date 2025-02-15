import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env from the correct location
dotenv.config({ path: `${__dirname}/.env` });

console.log("API Key Loaded:", process.env.OPENAI_API_KEY ? "Found" : "Not Found");


const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/extract-claims", async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) return res.status(400).json({ error: "No text provided" });

        console.log("Received text from extension:", text); // Debugging

        const prompt = `Extract fact-like claims from the text below. 
        Fact-like claims include:
        - Statistics (e.g., "60% of people prefer coffee over tea.")
        - Scientific statements (e.g., "Water boils at 100°C.")
        - Historical facts (e.g., "The Eiffel Tower was built in 1889.")
        - Political or economic claims (e.g., "The unemployment rate is 5%.")
        - Any statement that sounds verifiable through research.
        
        Ignore:
        - Opinions (e.g., "I think coffee is the best drink.")
        - Hypothetical statements (e.g., "If everyone exercised, we would be healthier.")
        - General discussions without factual claims.

        Text:
        ${text}
        
        Extracted Claims (one per line):`;

        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [{ role: "system", content: "You are a claim extraction assistant." }, { role: "user", content: prompt }]
            });
        
            console.log("Raw OpenAI Response:", response); // Debugging
        
            if (!response || !response.choices || response.choices.length === 0) {
                console.error("Error: Invalid response from OpenAI");
                return res.status(500).json({ error: "OpenAI API did not return any claims" });
            }
        
            console.log("Extracted Claims:", response.choices[0].message.content);
        
            const claims = response.choices[0].message.content.split("\n").filter(c => c.trim());
            res.status(200).json({ claims });
        
        } catch (error) {
            console.error("OpenAI API Error:", error);
            res.status(500).json({ error: "Failed to extract claims", details: error.message });
        }
        
        
        
        

        console.log("OpenAI Response:", response.choices[0].message.content); // Debugging

        const claims = response.choices[0].message.content.split("\n").filter(c => c.trim());

        if (claims.length === 0) {
            return res.status(200).json({ message: "No verifiable claims found.", claims: [] });
        }

        res.status(200).json({ claims });

    } catch (error) {
        console.error("Error in API:", error);
        res.status(500).json({ error: "Failed to extract claims" });
    }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

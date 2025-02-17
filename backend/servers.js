import ws from "../webscraping/webscrapingFuncs.js";

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
app.use(cors({
    origin: ["http://localhost:3000", "chrome-extension://*"], // Allows requests from frontend & Chrome Extension
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Initialize OpenAI API
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/extract-claims", async (req, res) => {
    try {
        const text = req.body.text;
        if (!text) return res.status(400).json({ error: "No text provided" });

        console.log("Received text from extension:", text); // Debugging

        const prompt = `Extract fact-like claims from the text below without changing the original meaning of the selected text.
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

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "system", content: "You are a claim extraction assistant. Extract fact-like claims from the text below without changing the original meaning of the selected text." }, { role: "user", content: prompt }]
        });

        if (!response || !response.choices || response.choices.length === 0) {
            console.error("Error: Invalid response from OpenAI");
            return res.status(500).json({ error: "OpenAI API did not return any claims" });
        }

        const claims_ = response.choices[0].message.content.split("\n").filter(c => c.trim());

        if (claims_.length === 0) {
            return res.status(200).json({ claims: ["No valid claims found."] });
        }

        const promiseList = [];
        for (var i = 0; i < claims_.length; i++) {
            if (i > 2) {
                break;
            }
            promiseList.push(ws.labelClaim(claims_[i]));           
        }
        const results = await Promise.all(promiseList);
        const claims = [];
        var j = 0;
        results.forEach((res) => {
            claims.push({
                claim: claims_[j],
                summary: res.summary,
                link: res.link,
                title: res.title,
                truth: res.truth
            })
            j++;
        })
        
        res.status(200).json({ claims });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        res.status(500).json({ error: "Failed to extract claims", details: error.message });
    }
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));

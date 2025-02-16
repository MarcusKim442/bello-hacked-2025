module.exports = { getResults };

require("dotenv").config();
const cheerio = require("cheerio");

async function getResults(claim) {
  const API_KEY = process.env.WEB_SCRAPING_API_KEY;
  const CX = process.env.WEB_SCRAPING_CX;

  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    claim
  )}&key=${API_KEY}&cx=${CX}`;

  try {
    const response = await fetch(url); // Wait for the fetch to complete
    const data = await response.json(); // Wait for the JSON parsing to complete
    const ret = [];

    console.log(`get search results: ${data.items}`)

    for (const item of data.items.slice(0, 3)) {
      // const pageContent = await fetchPage(item.link); // Fetch full page content
      // const text = extractRelevantText(pageContent);
      const text = "";
      const res = {
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        text: text,
      };
      ret.push(res);
    }
    return ret; // Return the final result
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    return html;
  } catch (error) {
    console.error(`Error fetching page content from ${url}:`, error);
    return null;
  }
}

function extractRelevantText(html) {
  if (!html) return null;
  const $ = cheerio.load(html);
  $("script, style, noscript, iframe, header, footer").remove();
  const text = $("html *")
    .contents()
    .map(function () {
      return this.type === "text" ? $(this).text() : "";
    })
    .get()
    .join(" ");

  const cleanedText = text.replace(/\s+/g, " ").trim();
  return cleanedText.slice(0, 1000);
}

// async function main() {
// const sampleClaim = "the university of alberta is a top 10 university";
//   try {
//     const data = await getResults(sampleClaim);
//     console.log(data);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
// main();

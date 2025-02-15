require("dotenv").config();

const API_KEY = process.env.WEB_SCRAPING_API_KEY;
const CX = process.env.WEB_SCRAPING_CX;
const QUERY = "bananas are healthy"; // Change this to your search term

const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
  QUERY
)}&key=${API_KEY}&cx=${CX}`;

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log("Search Results:", data.items);
    data.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.title} - ${item.link}`);
    });
  })
  .catch((error) => console.error("Error fetching search results:", error));

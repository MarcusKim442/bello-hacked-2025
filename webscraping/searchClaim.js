const API_KEY = "AIzaSyC8rtOmZM-4-9nFqQStnyNNgl2Bg8BoSE8";
const CX = "11e9e8e5098254a19";
const QUERY = "is pneumonia contagious?"; // Change this to your search term

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

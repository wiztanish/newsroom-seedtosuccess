const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 4000;
const API_KEY = "pub_afad95a11fb14b318f8391239459c26f";

async function fetchNewsPage(nextPage = null) {
  let url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en,hi`;
  if (nextPage) url += `&page=${nextPage}`;
  const response = await fetch(url);
  const data = await response.json();
  return {
    results: data.results || [],
    nextPage: data.nextPage || null,
  };
}

// ✅ API routes FIRST
app.get("/api/news", async (req, res) => {
  try {
    let allResults = [];
    let nextPage = null;
    let pagesFetched = 0;
    const MAX_PAGES = 3;
    do {
      const { results, nextPage: newNextPage } = await fetchNewsPage(nextPage);
      if (results.length === 0) break;
      allResults = allResults.concat(results);
      nextPage = newNextPage;
      pagesFetched++;
    } while (nextPage && pagesFetched < MAX_PAGES);
    res.json(allResults);
  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({ error: "Server crashed" });
  }
});

app.get("/api/debug", async (req, res) => {
  const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en,hi`;
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});

// ✅ Static files AFTER API routes
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () =>
  console.log(`Prototype running at http://localhost:${PORT}`)
);



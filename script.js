let allNews = [];
let expandAll = false;

const expandBtn = document.getElementById("expandBtn");

function truncateText(text, maxLength) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

async function loadNews() {
  try {
    const res = await fetch("/api/news");
    const data = await res.json();

    allNews = data;
    renderNews(allNews);

  } catch (err) {
    console.error(err);
    document.getElementById("newsContainer").innerHTML =
      "<p>Failed to load news.</p>";
  }
}

function renderNews(newsList) {
  const container = document.getElementById("newsContainer");
  container.innerHTML = "";

  if (newsList.length === 0) {
    container.innerHTML = "<p>No news found.</p>";
    return;
  }

  newsList.forEach(item => {
    const div = document.createElement("div");
    div.className = "news-item";

    div.innerHTML = `
      <div class="news-date">
        📰 ${item.pubDate ? new Date(item.pubDate).toLocaleDateString() : ""}
      </div>
      <a href="${item.link}" target="_blank" class="news-title">
        ${item.title.toUpperCase()}
      </a>
      <div class="news-description" style="display: none;">
        ${truncateText(item.description || "", 300)} 
        <a href="${item.link}" target="_blank" class="read-more">Read More</a>
      </div>
      <hr>
    `;

    container.appendChild(div);
  });
}

expandBtn.addEventListener("click", () => {
  expandAll = !expandAll;

  document.querySelectorAll(".news-description").forEach(desc => {
    desc.style.display = expandAll ? "block" : "none";
  });

  expandBtn.textContent = expandAll ? "Collapse All" : "Expand All";
});

loadNews();

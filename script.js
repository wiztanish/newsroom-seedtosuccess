document.addEventListener("DOMContentLoaded", () => {


  const slides = document.querySelectorAll('.slide');
  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
  }

  document.querySelector('.prev').addEventListener('click', () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  });
  document.querySelector('.next').addEventListener('click', () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  });

  showSlide(currentSlide);

  let allNews = [];
  let expandAll = false;

  const expandBtn = document.getElementById("expandBtn");
  const newsContainer = document.getElementById("newsContainer");
  const searchInput = document.getElementById("newsSearch");
  const searchBtn = document.querySelector(".search-btn");

  async function loadNews() {
    try {
      const res = await fetch("/api/news");
      const data = await res.json();
      allNews = data || [];
      renderNews(allNews);
    } catch (err) {
      console.error("Error loading news:", err);
      newsContainer.innerHTML = "<p style='text-align:center;'>Failed to load news. Please try again later.</p>";
    }
  }

  function truncateText(text, maxLength) {
    if (!text) return "";
    return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
  }

  function renderNews(newsList) {
    newsContainer.innerHTML = "";
    if (!newsList.length) {
      newsContainer.innerHTML = "<p>No news found.</p>";
      return;
    }

    newsList.forEach(item => {
      const div = document.createElement("div");
      div.className = "news-item";

      const displayClass = expandAll ? "expanded" : "collapsed";

      div.innerHTML = `
        <div class="news-date">📅 ${item.pubDate ? new Date(item.pubDate).toLocaleDateString('en-IN', { dateStyle: 'long' }) : ""}</div>
        <a href="${item.link}" target="_blank" class="news-title">${item.title.toUpperCase()}</a>
        <div class="news-description ${displayClass}">
          ${truncateText(item.description || "", 300)}
          <a href="${item.link}" target="_blank" class="read-more">Read Full Story</a>
        </div>
      `;

      // Toggle individual news description
      div.addEventListener('click', (e) => {
        if (e.target.tagName !== 'A') {
          const desc = div.querySelector('.news-description');
          desc.classList.toggle('expanded');
          desc.classList.toggle('collapsed');
        }
      });

      newsContainer.appendChild(div);
    });
  }

  expandBtn.addEventListener("click", () => {
    expandAll = !expandAll;
    const descriptions = document.querySelectorAll(".news-description");
    descriptions.forEach(desc => {
      desc.classList.toggle("expanded", expandAll);
      desc.classList.toggle("collapsed", !expandAll);
    });
    expandBtn.textContent = expandAll ? "Collapse All" : "Expand All";
    expandBtn.classList.toggle("active", expandAll);
  });

  function searchNews() {
    const query = searchInput.value.toLowerCase();
    const filtered = allNews.filter(item => {
      const text = (item.title + " " + item.description).toLowerCase();
      return text.includes(query);
    });
    renderNews(filtered);
  }

  searchBtn.addEventListener("click", searchNews);
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") searchNews();
  });

  loadNews();
});
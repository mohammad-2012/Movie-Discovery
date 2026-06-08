const loadingBox = document.querySelector(".loading-box");
const moviesList = document.querySelector(".movies-list");
const errorText = document.querySelector(".error-text");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const warningText = document.querySelector(".warning-text");
const paginationBox = document.querySelector(".pagination-box");
const nextPageButton = document.querySelector("#next-page-btn");
const prevPageButton = document.querySelector("#prev-page-btn");
const currentPageText = document.querySelector(".current-page");
const headerTitle = document.querySelector(".header-title");

let currentPage = 1;
let nextPage = null;
let prevPage = null;
let totalPages = null;
let lastUrl = "";

const API_KEY = "8c1145be7f33aea14eadacf1e448f486";
const API_URL = `https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${API_KEY}&page=${currentPage}`;
const IMAGE_PATH = "https://image.tmdb.org/t/p/w500";
const SEARCH_API = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=`;

const getMovies = async (url) => {
  lastUrl = url;
  try {
    const response = await fetch(url);
    const data = await response.json();
    errorText.innerHTML = "";
    warningText.innerHTML = "";
    loadingBox.style.display = "none";
    paginationBox.style.display = "flex";

    currentPage = data.page;
    totalPages = data.total_pages;
    currentPageText.innerHTML = currentPage;

    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });

    if (currentPage <= 1) {
      prevPageButton.classList.add("disable-btn");
      nextPageButton.classList.remove("disable-btn");
    } else if (currentPage >= totalPages) {
      prevPageButton.classList.remove("disable-btn");
      nextPageButton.classList.add("disable-btn");
    } else {
      prevPageButton.classList.remove("disable-btn");
      nextPageButton.classList.remove("disable-btn");
    }

    showMovies(data.results);
  } catch (err) {
    errorText.innerText = `⚠ Connection Error: ${err.message}\n⚠ Check your VPN or internet connection.`;
    loadingBox.style.display = "none";
    paginationBox.style.display = "none";
  }
};

const showMovies = (movies) => {
  moviesList.innerHTML = "";
  const filteredMovies = movies.filter((movie) => movie.poster_path !== null);

  if (filteredMovies.length !== 0) {
    filteredMovies.forEach((movie) => {
      const { poster_path, title, vote_average, overview } = movie;
      const movieItem = `
                <div class='movie-item'>
                    <div class='poster-wrapper'>
                        <img src="${IMAGE_PATH + poster_path}" alt="${title}" class='poster-img' />
                        <div class='overview-box'>
                            <h4 class='overview-title'><i class="fas fa-info-circle"></i> Overview:</h4>
                            ${overview || "No overview available"}
                        </div>
                    </div>
                    <div class='info-box'>
                        <h4 class='movie-name'>${title}</h4>
                        <span class='movie-vote ${getClassByVote(vote_average)}'>
                            ${vote_average.toFixed(1)} <i class='fas fa-star'></i>
                        </span>
                    </div>
                </div>
            `;
      moviesList.innerHTML += movieItem;
    });
  } else {
    warningText.innerHTML = "🎬 No movies found. Try another search! 🎬";
    paginationBox.style.display = "none";
  }
};

const getClassByVote = (vote) => {
  if (vote >= 8) return "green-vote";
  if (vote <= 5) return "red-vote";
  return "orange-vote";
};

headerTitle.addEventListener("click", () => getMovies(API_URL));

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchedValue = searchInput.value.trim();
  if (searchedValue) {
    loadingBox.style.display = "grid";
    moviesList.innerHTML = "";
    getMovies(SEARCH_API + encodeURIComponent(searchedValue));
    searchInput.value = "";
  }
});

nextPageButton.addEventListener("click", () => {
  nextPage = currentPage + 1;
  if (nextPage <= totalPages) callPage(nextPage);
});

prevPageButton.addEventListener("click", () => {
  prevPage = currentPage - 1;
  if (prevPage >= 1) callPage(prevPage);
});

const callPage = (page) => {
  loadingBox.style.display = "grid";
  moviesList.innerHTML = "";
  const urlSplit = lastUrl.split("?");
  const searchParams = new URLSearchParams(urlSplit[1]);
  searchParams.set("page", page);
  const url = urlSplit[0] + "?" + searchParams.toString();
  getMovies(url);
};

getMovies(API_URL);

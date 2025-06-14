import "./style.scss";
import batmanImg from "./Assets/Images/Batman.jpg";
import spiderman from "./Assets/Images/Spiderman.jpg";
import wildWest from "./Assets/Images/WildWest.jpg";

// Sidebar
const hamburger = document.getElementById("hamburger");
const sidebarMobile = document.getElementById("sidebar-mobile");
const sidebarDesktop = document.getElementById("sidebar-desktop");
const closeBtnMobile = document.getElementById("closeBtn-mobile");
const closeBtnDesktop = document.getElementById("closeBtn-desktop");
const overlay = document.getElementById("overlay");

function openSidebar() {
  sidebarMobile.classList.add("active");
  sidebarDesktop.classList.add("active");
  overlay?.classList.add("active");
}

function closeSidebar() {
  sidebarMobile.classList.remove("active");
  sidebarDesktop.classList.remove("active");
  overlay?.classList.remove("active");
}

hamburger?.addEventListener("click", openSidebar);
closeBtnMobile?.addEventListener("click", closeSidebar);
closeBtnDesktop?.addEventListener("click", closeSidebar);
overlay?.addEventListener("click", closeSidebar);

// Movie Grid
const starterMovies = [
  {
    title: "Batman Returns",
    desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut.",
    img: batmanImg,
  },
  {
    title: "Wild Wild West",
    desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut.",
    img: wildWest,
  },
  {
    title: "The Amazing Spiderman",
    desc: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut.",
    img: spiderman,
  },
];

function renderMovie(movie) {
  const container = document.getElementById("movies-container");
  if (!container) return;

  const div = document.createElement("div");
  div.className = "movie";
  div.innerHTML = `
    <div class="movie__content">
      <img src="${movie.img}" />
    </div>
    <div class="movie__details">
      <h3>${movie.title}</h3>
      <p>${movie.desc}</p>
    </div>
    <button class="close-btn" title="Remove movie">
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="2 1 12 12">
        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 
                 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707 
                 5.354 11.354a.5.5 0 1 1-.708-.708L7.293 8 4.646 5.354a.5.5 
                 0 0 1 0-.708z"/>
      </svg>
    </button>
  `;
  container.appendChild(div);
}

starterMovies.forEach(renderMovie);

// Movie Removal
document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("close-btn") ||
    e.target.closest(".close-btn")
  ) {
    const movie = e.target.closest(".movie");
    if (movie) movie.remove();
  }
});

// Search from TVMaze API
document
  .getElementById("searchInput")
  ?.addEventListener("keydown", async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const query = e.target.value.trim();
      if (query.length < 3) return;

      try {
        const res = await fetch(
          `https://api.tvmaze.com/search/shows?q=${query}`
        );
        const data = await res.json();
        if (data.length) {
          const show = data[0].show;
          renderMovie({
            title: show.name,
            desc: show.summary
              ? show.summary.replace(/<[^>]+>/g, "")
              : "No description",
            img: show.image
              ? show.image.medium
              : "https://via.placeholder.com/300x200",
          });
          e.target.value = "";
        }
      } catch (err) {
        console.error("Search failed:", err);
      }
    }
  });

// Contact Form Validation
function validateContactForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const fields = [
      { id: "firstName", name: "First Name" },
      { id: "lastName", name: "Last Name" },
      { id: "email", name: "Email" },
      { id: "phone", name: "Phone" },
      { id: "message", name: "Message" },
    ];

    let isValid = true;

    // Clear previous errors
    form.querySelectorAll(".error-message").forEach((el) => el.remove());
    form
      .querySelectorAll("input, textarea")
      .forEach((el) => el.classList.remove("error"));

    // Validate fields
    fields.forEach((field) => {
      const input = document.getElementById(field.id);
      if (!input || !input.value.trim()) {
        isValid = false;
        input?.classList.add("error");

        const errorMsg = document.createElement("div");
        errorMsg.className = "error-message";
        errorMsg.style.color = "red";
        errorMsg.style.fontSize = "13px";
        errorMsg.textContent = `${field.name} is required.`;

        input?.insertAdjacentElement("afterend", errorMsg);
      }
    });

    // If valid, show alert with values
    if (isValid) {
      const formData = new FormData(form);
      const output = [...formData.entries()]
        .map(([key, value]) => `${key}: ${value}`)
        .join("\n");

      alert("Form submitted successfully:\n\n" + output);
      form.reset();
    }
  });
}

// Init
document.getElementById("year").textContent = new Date().getFullYear();

validateContactForm("contactForm");

if (window.AOS) {
  AOS.init();
}

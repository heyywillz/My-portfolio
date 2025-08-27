const navToggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("nav");

navToggle.addEventListener("click", () => {
  nav.classList.toggle("active");

  navToggle.innerHTML = nav.classList.contains("active")
    ? '<i class="fa fa-times"></i>'
    : '<i class="fa fa-bars"></i>';
});

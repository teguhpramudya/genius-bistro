const menuToggle = document.querySelector(".menu-header .menu-toggle");
const menuNav = document.querySelector("#menu-nav");

function closeMenuNav() {
  menuToggle?.setAttribute("aria-expanded", "false");
  menuNav?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  menuNav?.classList.toggle("is-open", open);
});

menuNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenuNav));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenuNav();
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const lightbox = document.querySelector("#menu-lightbox");
const lightboxImage = document.querySelector("#lightbox-image");
const lightboxCaption = document.querySelector("#lightbox-caption");

document.querySelectorAll(".menu-sheet").forEach((sheet) => {
  sheet.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = sheet.dataset.fullSrc || sheet.querySelector("img")?.src || "";
    lightboxImage.alt = sheet.dataset.description || "Genius Bistro menu";
    if (lightboxCaption) lightboxCaption.textContent = sheet.dataset.description || "Genius Bistro menu";
    if (typeof lightbox.showModal === "function") lightbox.showModal();
  });
});

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

lightbox?.addEventListener("close", () => {
  if (lightboxImage) lightboxImage.removeAttribute("src");
});

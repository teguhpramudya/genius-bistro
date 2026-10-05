const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");

function closeNavigation() {
  menuToggle?.setAttribute("aria-expanded", "false");
  siteNav?.classList.remove("is-open");
}

menuToggle?.addEventListener("click", () => {
  const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(willOpen));
  siteNav?.classList.toggle("is-open", willOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeNavigation();
});

const revealTargets = [...document.querySelectorAll(".reveal")];
const floatingBooking = document.querySelector(".floating-booking");

if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.documentElement.classList.add("js-ready");


  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -35px 0px" });

  revealTargets.forEach((target) => revealObserver.observe(target));
}

function updateFloatingBooking() {
  if (!floatingBooking) return;
  const visible = window.scrollY > 540;
  floatingBooking.classList.toggle("is-visible", visible);
  floatingBooking.setAttribute("aria-hidden", String(!visible));
  floatingBooking.tabIndex = visible ? 0 : -1;
}

window.addEventListener("scroll", updateFloatingBooking, { passive: true });
updateFloatingBooking();

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const dateInput = document.querySelector("#guest-date");
if (dateInput) {
  const now = new Date();
  const localToday = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
  dateInput.min = localToday;
}

const reservationForm = document.querySelector("#reservation-form");
reservationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!reservationForm.reportValidity()) return;

  const formData = new FormData(reservationForm);
  const date = new Date(`${formData.get("date")}T12:00:00`);
  const prettyDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const message = [
    "Bonjour, I’d love to reserve a table at Genius Bistro.",
    "",
    `Name: ${formData.get("name")}`,
    `Date: ${prettyDate}`,
    `Time: ${formData.get("time")}`,
    `Guests: ${formData.get("guests")}`,
    "",
    "Please let me know if you have a table available. Merci!",
  ].join("\n");

  const whatsappUrl = `https://wa.me/6282145052727?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

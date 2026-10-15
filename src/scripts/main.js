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
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

function initializeMotion() {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return false;

  let mediaContext;
  try {
    gsap.registerPlugin(ScrollTrigger);
    document.documentElement.classList.add("gsap-ready");
    mediaContext = gsap.matchMedia();
    mediaContext.add({
      mobile: "(max-width: 700px)",
      desktop: "(min-width: 701px)",
      reduce: "(prefers-reduced-motion: reduce)",
    }, ({ conditions }) => {
      if (conditions.reduce) return;

      const isMobile = conditions.mobile;
      const intro = gsap.timeline({ defaults: { ease: "power2.out", overwrite: "auto" } });
      intro.fromTo(".hero-image",
        { scale: isMobile ? 1.025 : 1.04, transformOrigin: "center 48%" },
        { scale: 1.012, duration: isMobile ? 1.25 : 1.65 }, 0);
      intro.fromTo(".hero-copy .eyebrow", { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.48 }, 0.05);
      intro.fromTo(".hero-copy h1", { autoAlpha: 0, y: 9 }, { autoAlpha: 1, y: 0, duration: 0.68, ease: "power3.out" }, 0.12);
      intro.fromTo(".hero-description", { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.54 }, 0.27);
      intro.fromTo(".hero-actions", { autoAlpha: 0, y: 5 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.34);
      intro.fromTo(".hero-note", { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: 0.46 }, 0.43);
      intro.fromTo(".reservation-form", { autoAlpha: 0, y: isMobile ? 7 : 11 }, { autoAlpha: 1, y: 0, duration: 0.7 }, 0.2);

      if (revealTargets.length) {
        gsap.set(revealTargets, { autoAlpha: 0, y: isMobile ? 9 : 13 });
        ScrollTrigger.batch(revealTargets, {
          start: isMobile ? "top 94%" : "top 88%",
          once: true,
          onEnter: (batch) => gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            duration: isMobile ? 0.56 : 0.68,
            ease: "power2.out",
            stagger: 0.07,
            overwrite: "auto",
          }),
        });
      }

      if (!isMobile) {
        gsap.utils.toArray(".story-photo img, .visit-photo img, .interlude > img").forEach((image) => {
          gsap.fromTo(image, { scale: 1.025 }, {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest(".reveal") || image,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.45,
            },
          });
        });
      }
    });
    return true;
  } catch (error) {
    mediaContext?.revert();
    document.documentElement.classList.remove("gsap-ready");
    return false;
  }
}

function initializeRevealFallback() {
  if (!("IntersectionObserver" in window) || prefersReducedMotion.matches) return;
  document.documentElement.classList.add("js-ready");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -24px 0px" });
  revealTargets.forEach((target) => revealObserver.observe(target));
}

if (!initializeMotion()) initializeRevealFallback();

let floatingBookingIsVisible = null;
function updateFloatingBooking() {
  if (!floatingBooking) return;
  const visible = window.scrollY > 540;
  if (visible === floatingBookingIsVisible) return;
  floatingBookingIsVisible = visible;
  floatingBooking.classList.toggle("is-visible", visible);
  floatingBooking.setAttribute("aria-hidden", String(!visible));
  floatingBooking.tabIndex = visible ? 0 : -1;
}

window.addEventListener("scroll", updateFloatingBooking, { passive: true });
updateFloatingBooking();

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const dateInput = document.querySelector("#guest-date");
const timeInput = document.querySelector("#guest-time");
const reservationTimeZone = "Asia/Makassar";

function getReservationClock() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: reservationTimeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date()).reduce((values, part) => {
    if (part.type !== "literal") values[part.type] = part.value;
    return values;
  }, {});

  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

function timeValueToMinutes(value) {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

function minutesToTimeValue(minutes) {
  const hour = String(Math.floor(minutes / 60)).padStart(2, "0");
  const minute = String(minutes % 60).padStart(2, "0");
  return `${hour}:${minute}`;
}

function formatReservationTimeLabel(value) {
  const [hour, minute] = value.split(":").map(Number);
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function updateReservationTimeBounds() {
  if (!dateInput || !timeInput) return;

  const clock = getReservationClock();
  dateInput.min = clock.date;

  const openingMinute = timeValueToMinutes(timeInput.dataset.openingTime);
  const closingMinute = timeValueToMinutes(timeInput.dataset.closingTime);
  const isToday = dateInput.value === clock.date;
  const nextQuarter = (Math.floor(clock.minutes / 15) + 1) * 15;
  const firstAvailable = isToday ? Math.max(openingMinute, nextQuarter) : openingMinute;
  const noTimesRemain = firstAvailable > closingMinute;
  const effectiveMinimum = noTimesRemain ? closingMinute : firstAvailable;

  timeInput.min = minutesToTimeValue(effectiveMinimum);
  timeInput.max = minutesToTimeValue(closingMinute);
  timeInput.setCustomValidity(noTimesRemain ? "No reservation times remain today. Please choose another date." : "");

  if (timeInput.value) {
    const selectedMinute = timeValueToMinutes(timeInput.value);
    if (noTimesRemain || selectedMinute < firstAvailable || selectedMinute > closingMinute || selectedMinute % 15 !== 0) {
      timeInput.value = "";
    }
  }
}

if (dateInput && timeInput) {
  updateReservationTimeBounds();
  dateInput.addEventListener("change", updateReservationTimeBounds);
}
const reservationForm = document.querySelector("#reservation-form");
reservationForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  updateReservationTimeBounds();
  if (!reservationForm.reportValidity()) return;

  const formData = new FormData(reservationForm);
  const date = new Date(`${formData.get("date")}T12:00:00`);
  const prettyDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
  const message = [
    "Bonjour, I’d love to reserve a table at Genius Bistro.",
    "",
    `Name: ${formData.get("name")}`,
    `Date: ${prettyDate}`,
    `Time: ${formatReservationTimeLabel(formData.get("time"))}`,
    `Guests: ${formData.get("guests")}`,
    "",
    "Please let me know if you have a table available. Merci!",
  ].join("\n");

  const whatsappUrl = `https://wa.me/6282145052727?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
});

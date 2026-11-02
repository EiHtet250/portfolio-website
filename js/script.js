// Light and dark theme: use the saved choice, otherwise the device setting
const root = document.documentElement;
const prefersDark = matchMedia("(prefers-color-scheme: dark)").matches;
root.dataset.theme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");

document.getElementById("theme").addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", root.dataset.theme);
});

// Skip the moving effects for people who ask for less motion
const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!calm) {
  // Fade items in when they scroll into view
  const items = document.querySelectorAll(".section-head, .card, .skill, .exp, .about-copy, .contact-head, .contact-card");
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        reveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  items.forEach((item) => {
    item.classList.add("reveal");
    reveal.observe(item);
  });

  // Count the hero numbers up from zero
  document.querySelectorAll(".stats b").forEach((stat) => {
    const end = parseFloat(stat.textContent);
    const decimals = stat.textContent.includes(".") ? 1 : 0;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / 1200, 1);
      stat.textContent = (end * progress).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });

  // Load the 3D Spline robot, then swap it in for the flat one
  const robotBox = document.querySelector(".robot-box");
  if (robotBox) {
    const spline = document.createElement("script");
    spline.type = "module";
    spline.src = "https://cdn.spline.design/@splinetool/viewer@2.0.127/build/spline-viewer.js";
    document.head.append(spline);
    robotBox.querySelector("spline-viewer").addEventListener("load-complete", () => robotBox.classList.add("ready"));
  }
}

// Underline the menu link for the section on screen
const links = document.querySelectorAll(".nav a");
const spy = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      links.forEach((link) => link.classList.toggle("current", link.hash === "#" + entry.target.id));
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
links.forEach((link) => {
  const section = link.hash && document.querySelector(link.hash);
  if (section) spy.observe(section);
});

// Phone menu: open with the button, close after picking a link
const menu = document.getElementById("menu");
const nav = document.getElementById("nav");
menu.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menu.setAttribute("aria-expanded", open);
});
links.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menu.setAttribute("aria-expanded", "false");
  });
});

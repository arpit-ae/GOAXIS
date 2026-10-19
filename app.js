(() => {
  "use strict";
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }));
  }
  document.querySelectorAll("[data-service]").forEach(link => link.addEventListener("click", () => {
    const service = document.querySelector("#service");
    if (service) service.value = link.dataset.service || "";
  }));
  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
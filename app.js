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
    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
    }));
  }
  document.querySelectorAll("[data-service]").forEach((link) => link.addEventListener("click", () => {
    const service = document.querySelector("#service");
    if (service) service.value = link.dataset.service;
  }));
  const form = document.querySelector("#enquiry-form");
  const feedback = document.querySelector("#form-feedback");
  if (form && feedback) form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    feedback.textContent = "Form preview validated. Your details were not sent or saved. Online enquiry will be connected in a later part.";
    feedback.classList.add("is-visible");
  });
  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
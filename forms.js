(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);

  function setFeedback(node, message, isError = false) {
    if (!node) return;
    node.textContent = message;
    node.classList.add("is-visible");
    node.classList.toggle("is-error", isError);
    node.setAttribute("role", "status");
    node.setAttribute("aria-live", "polite");
  }

  function value(form, name) {
    return String(new FormData(form).get(name) || "").trim();
  }

  async function submitEnquiry(payload) {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", "accept": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "We could not submit your enquiry. Please try again.");
    }
    return data;
  }

  function bind(formId, feedbackId, buildPayload, successText) {
    const form = document.getElementById(formId);
    const feedback = document.getElementById(feedbackId);
    if (!form || !feedback || form.dataset.apiBound === "true") return;

    form.dataset.apiBound = "true";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const button = form.querySelector('button[type="submit"]');
      const originalText = button ? button.textContent : "";
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }
      feedback.classList.remove("is-visible", "is-error");
      feedback.textContent = "";

      try {
        const result = await submitEnquiry(buildPayload(form));
        form.reset();
        setFeedback(feedback, successText(result.reference), false);
      } catch (error) {
        setFeedback(feedback, error.message || "Something went wrong. Please try again.", true);
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  }

  bind("enquiry-form", "form-feedback", form => ({
    name: value(form, "name"),
    email: value(form, "email"),
    phone: value(form, "phone"),
    service: value(form, "service"),
    message: value(form, "message"),
    website: value(form, "website")
  }), reference => "Thank you. Your enquiry has been saved. Reference: " + (reference || "received") + ".");

  bind("contact-enquiry-form", "contact-form-feedback", form => ({
    name: value(form, "name"),
    email: value(form, "email"),
    phone: value(form, "phone"),
    service: value(form, "service"),
    message: value(form, "message"),
    website: value(form, "website")
  }), reference => "Thank you. Your enquiry has been saved. Reference: " + (reference || "received") + ".");

  bind("service-enquiry-form", "service-feedback", form => ({
    name: value(form, "name"),
    email: value(form, "email"),
    phone: value(form, "phone"),
    service: value(form, "service") || document.getElementById("service-title")?.textContent || "Service enquiry",
    message: [
      value(form, "businessName") ? "Business name: " + value(form, "businessName") : "",
      value(form, "businessType") ? "Business type: " + value(form, "businessType") : "",
      "Requirement: " + value(form, "details")
    ].filter(Boolean).join("\n"),
    website: value(form, "website")
  }), reference => "Thank you. Your service enquiry has been saved. Reference: " + (reference || "received") + ".");

  bind("website-quote-form", "website-feedback", form => ({
    name: value(form, "contactName"),
    email: value(form, "email"),
    phone: value(form, "phone"),
    service: "Website Development — " + value(form, "package"),
    message: [
      "Business/project name: " + value(form, "company"),
      "Package: " + value(form, "package"),
      "Approximate pages: " + (value(form, "pages") || "Not specified"),
      "Design preferences: " + (value(form, "design") || "Not specified"),
      "Required features: " + value(form, "features"),
      "Target timeline: " + (value(form, "timeline") || "Flexible")
    ].join("\n"),
    website: value(form, "website")
  }), reference => "Your website quotation request has been saved. Reference: " + (reference || "received") + ".");

  const year = document.getElementById("current-year");
  if (year) year.textContent = String(new Date().getFullYear());
})();

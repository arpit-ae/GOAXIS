(() => {
"use strict";
const $ = (selector) => document.querySelector(selector);
const year = $("#current-year");
if (year) year.textContent = String(new Date().getFullYear());
const toggle = $(".menu-toggle"), nav = $("#primary-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
    nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false");
  }));
}
const services = {
  gst: {category:"TAX & BUSINESS", title:"GST Registration Assistance", description:"Guidance on understanding GST registration requirements and preparing an application checklist for your business.", scope:[["Requirement review","Discuss your business activity and whether registration may apply; confirm final requirements with an appropriate professional or the GST portal."],["Document checklist","Understand commonly requested business and identity documents. Do not send sensitive documents through this initial form."],["Application assistance","Support with preparation and process navigation; approval and registration decisions are made by the tax authority."]]},
  udyam: {category:"MSME", title:"Udyam Registration Assistance", description:"Understand the official MSME/Udyam registration process and the information needed for your business.", scope:[["Eligibility and process","Review the official process and basic information needed for the registration."],["Information checklist","Identify business details that may be required. Use only the official portal for sensitive authentication."],["Process guidance","Get assistance understanding steps; registration eligibility and official outcomes are governed by the relevant authority."]]},
  fssai: {category:"FOOD BUSINESS", title:"FSSAI Registration & Licence Assistance", description:"Guidance on identifying the applicable food-business registration or licence route and organising supporting information.", scope:[["Business activity review","Describe your food business, activities and operating scale so the applicable route can be checked."],["Document checklist","Review typical supporting documents and details that may be required for your case."],["Application support","Get help understanding the process. Licence type, fees and approval are determined by the applicable rules and authority."]]},
  iec: {category:"IMPORT & EXPORT", title:"Importer Exporter Code (IEC) Assistance", description:"Practical guidance on the IEC application process and preparation of business information for import/export activity.", scope:[["Business readiness","Discuss the proposed import/export activity and business structure."],["Application information","Prepare a checklist for details and documents that may be needed through the official DGFT process."],["Next steps","Understand submission and follow-up steps; issuance is subject to official requirements and processing."]]},
  apeda: {category:"EXPORT READINESS", title:"APEDA & Export Documentation Assistance", description:"Guidance on APEDA-related registration and export documentation, depending on the product, destination and applicable rules.", scope:[["Product and destination","Share the product category and destination country; requirements vary by product and market."],["Documentation mapping","Identify which registrations, certificates or checks may need confirmation with the competent authority."],["Application support","Get help organising the process. No approval, clearance or export eligibility is guaranteed."]]},
  documents: {category:"BUSINESS DOCUMENTATION", title:"Business Documents & Application Support", description:"Support in understanding document requirements and organising paperwork for common business processes.", scope:[["Requirement mapping","Explain which department or process your document relates to."],["Checklist and preparation","Get a checklist and assistance organising application information."],["Review and follow-up","Clarify next steps. Official documents, licences and approvals can only be issued by the authorised body."]]},
  other: {category:"CUSTOM BUSINESS SUPPORT", title:"Other Business Requirements", description:"Tell us about your business requirement so we can review the possible process, scope and next steps.", scope:[["Understand your goal","Describe the outcome you are trying to achieve."],["Identify next steps","We can review likely authorities, information and dependencies to confirm."],["Written scope","Any paid work should begin only after scope, price, timeline and exclusions are agreed in writing."]]}
};
const params = new URLSearchParams(location.search);
const key = params.get("service") || "other";
const service = services[key] || services.other;
const title = $("#service-title"), category = $("#service-category"), description = $("#service-description"), scope = $("#service-scope"), serviceField = $("#service-field");
if (title && category && description && scope) {
  document.title = service.title + " | GOAXIS CONSULTANCY";
  title.textContent = service.title; category.textContent = service.category; description.textContent = service.description;
  scope.replaceChildren(...service.scope.map(([heading, text]) => {
    const item = document.createElement("div"); item.className = "scope-item";
    const strong = document.createElement("strong"); strong.textContent = heading;
    const p = document.createElement("p"); p.textContent = text; item.append(strong, p); return item;
  }));
  if (serviceField) serviceField.value = service.title;
}
document.querySelectorAll(".package-select").forEach(button => button.addEventListener("click", () => {
  const packageField = $("#package");
  if (packageField) { packageField.value = button.dataset.package; $("#quote-form-section")?.scrollIntoView({behavior:"smooth"}); packageField.focus({preventScroll:true}); }
}));
function setupLocalPreview(formId, feedbackId, message) {
  const form = $(formId), feedback = $(feedbackId);
  if (!form || !feedback || window.GOAXIS_USE_API) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    feedback.textContent = message + " No data was transmitted or saved. Backend submission will be implemented in a later project part.";
    feedback.classList.add("is-visible");
  });
}
setupLocalPreview("#service-enquiry-form", "#service-feedback", "Your enquiry passed browser-side validation.");
setupLocalPreview("#website-quote-form", "#website-feedback", "Your website project brief passed browser-side validation.");
})();
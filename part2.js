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
  gst: {
    category:"TAX & BUSINESS", title:"GST Registration Assistance",
    description:"Step-by-step guidance to understand GST registration requirements and prepare an application checklist. Whether registration is required depends on your business activity, turnover, location and applicable rules.",
    scope:[["1. Understand your case","Review business activity, state, sales channels and likely registration category. Final applicability should be confirmed against current GST rules."],["2. Prepare the checklist","Organise business details, PAN, authorised signatory details and proof of principal place of business as applicable."],["3. Application readiness","Help review the information before you complete the application on the official GST portal. Tax authority decisions and verification are outside GOAXIS control."]],
    documents:["PAN of the proprietor/entity, as applicable","Aadhaar and contact details for relevant persons for portal authentication","Business constitution proof, where applicable","Principal place of business proof: ownership document, rent/lease agreement, electricity bill or consent letter as applicable","Authorised signatory proof/authorisation, where applicable"],
    process:["Discuss business activity and registration need","Confirm entity type and address-proof route","Prepare and review the checklist","Applicant completes portal authentication and submits through the official portal","Track any clarification request and respond through the official portal"],
    fee:"Government portal filing does not itself establish a GOAXIS professional fee. Any consultancy fee, tax-professional fee or third-party charge must be quoted separately before work begins.",
    official:[["GST Portal","https://www.gst.gov.in/"],["GST registration user guide","https://tutorial.gst.gov.in/userguide/registration/Apply_for_Registration_Normal_Taxpayer.htm"]]
  },
  udyam: {
    category:"MSME", title:"Udyam Registration Assistance",
    description:"Help understanding the official MSME/Udyam registration steps and preparing the information needed for a self-declaration-based online application.",
    scope:[["1. Check the business details","Confirm the enterprise type, activity and information available for the applicant."],["2. Prepare information","The official process uses Aadhaar verification and PAN/GST-linked details where applicable. Do not send Aadhaar numbers or OTPs to GOAXIS."],["3. Complete official registration","The applicant should enter authentication details directly on the official government portal. A certificate is issued by the authority after successful completion."]],
    documents:["Aadhaar number of the appropriate person for the entity type, used only on the official portal","PAN and GSTIN details where applicable","Enterprise name, address and activity details","Bank and investment/turnover information if requested by the official form"],
    process:["Review the enterprise type and details","Prepare a non-sensitive checklist","Applicant completes verification on the official Udyam portal","Review the entered business information before final submission","Download the official certificate after successful registration"],
    fee:"The Government of India states that Udyam registration is free. If GOAXIS offers optional assistance, any professional fee must be clearly disclosed separately; it is not a government registration fee.",
    official:[["Official Udyam Portal","https://udyamregistration.gov.in/"],["Official process and fee information","https://www.udyamregistration.gov.in/Important.aspx"]]
  },
  fssai: {
    category:"FOOD BUSINESS", title:"FSSAI Registration & Licence Assistance",
    description:"Guidance for food businesses to identify the relevant registration/licence route and prepare information for the FoSCoS application. The correct category depends on activity, scale, premises and current rules.",
    scope:[["1. Map the food activity","Identify whether the business manufactures, stores, transports, distributes, sells, imports or handles food."],["2. Check the applicable route","Review the activity and business scale against current official eligibility criteria. The final licence category is determined under applicable rules."],["3. Prepare the application","Organise applicable business, premises and food-activity details for the official FoSCoS process."]],
    documents:["Applicant/entity identity and contact details","Proof of business premises, where applicable","Business constitution and authorised-person details, where applicable","Food product/category and activity details","Technical or product-specific documents where required for the activity"],
    process:["Describe every food-related activity and premises","Check current eligibility on FoSCoS","Prepare the case-specific document checklist","Applicant submits and authenticates through the official portal","Track queries, inspection or other requirements if issued by the authority"],
    fee:"Official application/licence fees depend on the applicable category and current rules. GOAXIS professional charges, if any, are separate and must be quoted in writing. Approval and processing time are not guaranteed.",
    official:[["Official FoSCoS Portal","https://foscos.fssai.gov.in/"],["FSSAI official website","https://www.fssai.gov.in/"]]
  },
  iec: {
    category:"IMPORT & EXPORT", title:"Importer Exporter Code (IEC) Assistance",
    description:"Support preparing business information and understanding the DGFT online process for an Importer Exporter Code used for import/export activities where required.",
    scope:[["1. Review the business","Confirm the legal entity, PAN, proposed goods/services and intended import/export activity."],["2. Prepare information","Organise applicant, address and bank-related information requested by the current DGFT application."],["3. Complete the official process","The applicant completes portal access, declarations and any required verification. Issuance and any post-issue compliance remain subject to DGFT rules."]],
    documents:["PAN of the applicant/entity","Applicant and authorised-person details","Business address and contact information","Bank account proof/details as requested by the current DGFT portal","Entity constitution or authorisation documents where applicable"],
    process:["Discuss the planned trade activity and entity type","Check current DGFT requirements and portal instructions","Prepare a tailored information checklist","Applicant submits the application on the official DGFT portal","Check application status and complete any official query or post-issue requirement"],
    fee:"DGFT government fees, if applicable, and GOAXIS professional fees are separate. The amount and current requirements should be confirmed from the official portal and a written quotation before proceeding.",
    official:[["DGFT Official Portal","https://www.dgft.gov.in/CP/"]]
  },
  apeda: {
    category:"EXPORT READINESS", title:"APEDA & Export Documentation Assistance",
    description:"Guidance on APEDA e-RCMC and export-readiness documentation for eligible scheduled products. Requirements depend on product, destination country, buyer, shipment and competent authorities.",
    scope:[["1. Identify product and market","Record product description, HS code if known, origin, destination and intended buyer/use."],["2. Map requirements","Check whether the product falls under APEDA's scheduled products and identify likely registrations, certificates, lab tests or destination-specific checks to verify."],["3. Prepare export documents","Help organise an application/document checklist. Regulatory permission, certification and clearance must be confirmed with the responsible authority."]],
    documents:["IEC details, where required before e-RCMC","Business/entity and authorised-person details","Product descriptions and relevant HS codes","Destination, buyer and shipment information","Any product-specific certificate, lab report, phytosanitary or other document required by the competent authority"],
    process:["Describe the product, origin and destination","Check product coverage and current official requirements","Confirm IEC and e-RCMC eligibility where relevant","Prepare a case-specific export documentation checklist","Verify destination-country import conditions and shipment documents before dispatch"],
    fee:"APEDA e-RCMC, official certificates, laboratory tests, inspection, freight and other charges can differ. Confirm current official charges and any GOAXIS professional fee separately. Export clearance or market access is not guaranteed.",
    official:[["APEDA RCMC information","https://apeda.gov.in/RCMC"],["DGFT e-RCMC portal","https://www.dgft.gov.in/CP/index.jsp?opt=e-rcmc"]]
  },
  documents: {
    category:"BUSINESS DOCUMENTATION", title:"Business Documents & Application Support",
    description:"Practical help preparing common business paperwork such as quotations, proforma invoices, company profiles, checklists and application document sets.",
    scope:[["1. Define the document","Confirm the document's purpose, recipient, country, transaction and required format."],["2. Collect non-sensitive inputs","Use the relevant facts and commercial details. Sensitive IDs or bank details should be shared only through an agreed secure channel when genuinely required."],["3. Draft and review","Prepare a draft for your review. Legal, tax, customs or regulatory declarations must be checked by the responsible professional or authority before use."]],
    documents:["Business/trade name and verified contact details","Document purpose and recipient details","Product/service descriptions, quantities and values if relevant","Currency, delivery terms and payment terms for commercial documents","Any recipient/authority template or written instructions"],
    process:["Choose document type and intended use","Share the necessary non-sensitive information","Receive a scope and quotation if the work is chargeable","Review the draft and request agreed corrections","Approve the final document before using it"],
    fee:"Fees depend on document type, complexity, language, supporting research and urgency. A written quote will identify included revisions and any third-party or official charges.",
    official:[]
  },
  other: {
    category:"CUSTOM BUSINESS SUPPORT", title:"Other Business Requirements",
    description:"If your requirement is not listed, GOAXIS can review the goal and help identify possible next steps, documents and the right authority or service provider to consult.",
    scope:[["1. Explain your goal","Describe the business outcome you want, your location and any relevant deadline."],["2. Map the likely path","We will identify the questions, dependencies and authorities that need confirmation."],["3. Agree the scope","Work begins only after the deliverables, exclusions, timeline and fees are agreed in writing."]],
    documents:["A short description of the requirement","Business type and operating location","Relevant product/service and destination information if applicable","Any official notice or checklist, with personal/sensitive data removed"],
    process:["Submit a brief, non-sensitive description","Review whether the request is within our service scope","Confirm requirements and any specialist/authority involvement","Receive a written scope and quotation before paid work"],
    fee:"Quotation required after the scope is understood. Government, professional and third-party fees are separate and must be explained before proceeding.",
    official:[]
  }
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
  const renderList = (targetId, items) => {
    const target = document.querySelector(targetId);
    if (!target) return;
    target.replaceChildren(...(items || []).map(text => {
      const li = document.createElement("li"); li.textContent = text; return li;
    }));
  };
  renderList("#service-documents", service.documents);
  renderList("#service-process", service.process);
  const feeNote = document.querySelector("#service-fee-note");
  if (feeNote) feeNote.textContent = service.fee || "Quotation required after scope review. Official and third-party fees are separate.";
  const officialLinks = document.querySelector("#service-official-links");
  if (officialLinks) {
    officialLinks.replaceChildren();
    (service.official || []).forEach(([label, href]) => {
      const a = document.createElement("a"); a.href = href; a.target = "_blank"; a.rel = "noopener noreferrer"; a.textContent = label + " ↗";
      officialLinks.append(a);
    });
    if (!(service.official || []).length) officialLinks.hidden = true;
  }
  if (serviceField) serviceField.value = service.title;
}
document.querySelectorAll(".package-select").forEach(button => button.addEventListener("click", () => {
  const packageField = $("#package");
  if (packageField) { packageField.value = button.dataset.package; $("#quote-form-section")?.scrollIntoView({behavior:"smooth"}); packageField.focus({preventScroll:true}); }
}));
function setupLocalPreview(formId, feedbackId, message) {
  const form = $(formId), feedback = $(feedbackId);
  if (!form || !feedback) return;
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
(() => {
"use strict";
const toggle=document.querySelector(".menu-toggle"),nav=document.querySelector("#primary-nav");
if(toggle&&nav){toggle.addEventListener("click",()=>{const open=nav.classList.toggle("is-open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Close navigation":"Open navigation")});nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("is-open");toggle.setAttribute("aria-expanded","false")}))}
document.querySelectorAll("[data-service]").forEach(a=>a.addEventListener("click",()=>{const service=document.querySelector("#service");if(service)service.value=a.dataset.service}));
const form=document.querySelector("#enquiry-form"),feedback=document.querySelector("#form-feedback");
if(form&&feedback)form.addEventListener("submit",async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const values=Object.fromEntries(new FormData(form).entries()),button=form.querySelector('button[type="submit"]');
 if(button)button.disabled=true;
 feedback.textContent="Sending your enquiry securely…";feedback.classList.add("is-visible");feedback.classList.remove("is-error");
 try{
  const response=await fetch("/api/enquiry",{method:"POST",credentials:"same-origin",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({name:values.name,email:values.email,phone:values.phone,service:values.service,message:values.message,consent:values.consent==="on",source:"homepage"})});
  const result=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result?.error?.message||"Your enquiry could not be saved. Please retry.");
  feedback.textContent="Enquiry saved. Reference: "+result.lead.leadId+". Keep this reference for follow-up.";form.reset();
 }catch(e){feedback.textContent=e.message||"Your enquiry could not be saved. Please retry.";feedback.classList.add("is-error");}
 finally{if(button)button.disabled=false;}
});
const year=document.querySelector("#current-year");if(year)year.textContent=String(new Date().getFullYear());
})();
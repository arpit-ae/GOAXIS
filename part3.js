(() => {
"use strict";
const byId = id => document.getElementById(id);
const enc = value => String(value == null ? "" : value).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const feedback = (node, message, isError=false) => { if (!node) return; node.textContent=message; node.classList.toggle("is-error",isError); node.classList.add("is-visible"); };
async function api(path, options={}) {
  const isForm = typeof FormData !== "undefined" && options.body instanceof FormData;
  const headers = {...(isForm ? {} : {"Content-Type":"application/json"}), ...(options.headers||{})};
  const response = await fetch(path,{credentials:"same-origin",...options,headers});
  const type=response.headers.get("content-type")||"";
  const data=type.includes("application/json")?await response.json():null;
  if(!response.ok) throw new Error(data?.error?.message || "Request failed. Please try again.");
  return data;
}
function money(paise) { return paise == null ? "Quote pending" : new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:2}).format(Number(paise)/100); }
function date(value) { if(!value)return "";const d=new Date(value);return Number.isNaN(d.getTime())?"":d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}); }
const statusNames={REQUESTED:"Request received",PENDING_PAYMENT:"Quote ready · payment pending",PAID:"Paid",PROCESSING:"Processing",DOCUMENTS_REQUIRED:"Documents required",IN_PROGRESS:"In progress",COMPLETED:"Completed",CANCELLED:"Cancelled"};
const year=byId("current-year"); if(year)year.textContent=String(new Date().getFullYear());

const signup=byId("signup-form");
if(signup) signup.addEventListener("submit",async event=>{
  event.preventDefault();if(!signup.reportValidity())return;
  const f=new FormData(signup),password=String(f.get("password")||""),confirm=String(f.get("confirmPassword")||"");
  if(password!==confirm){feedback(byId("signup-feedback"),"Passwords do not match.",true);return;}
  const button=signup.querySelector("button[type=submit]");if(button)button.disabled=true;
  try{
    const data=await api("/api/signup",{method:"POST",body:JSON.stringify({name:f.get("name"),email:f.get("email"),password,company:f.get("company"),phone:f.get("phone")})});
    feedback(byId("signup-feedback"),"Account created. Opening your dashboard…");
    location.href="dashboard.html";
  }catch(e){feedback(byId("signup-feedback"),e.message,true);if(button)button.disabled=false;}
});

const login=byId("login-form");
if(login) login.addEventListener("submit",async event=>{
  event.preventDefault();if(!login.reportValidity())return;
  const f=new FormData(login),button=login.querySelector("button[type=submit]");if(button)button.disabled=true;
  try{await api("/api/login",{method:"POST",body:JSON.stringify({email:f.get("email"),password:f.get("password")})});feedback(byId("login-feedback"),"Signed in. Opening your dashboard…");location.href="dashboard.html";}
  catch(e){feedback(byId("login-feedback"),e.message,true);if(button)button.disabled=false;}
});

const ordersNode=byId("orders-list");
async function renderOrderDocuments(order) {
  try {
    const result=await api("/api/orders/"+encodeURIComponent(order.id)+"/documents");
    const node=byId("documents-"+order.id);if(!node)return;
    const docs=result.documents||[];
    node.innerHTML=docs.length?docs.map(d=>'<li><a href="'+enc(d.downloadUrl)+'">'+enc(d.file_name)+'</a><span>'+(d.verified?"Verified":"Awaiting review")+'</span></li>').join(""):"<li>No documents uploaded yet.</li>";
  } catch(e) { const node=byId("documents-"+order.id);if(node)node.textContent=e.message; }
}
async function loadOrders() {
  if(!ordersNode)return;
  const data=await api("/api/orders"),orders=data.orders||[];
  const count=byId("request-count"),progress=byId("in-progress-count"),docsCount=byId("documents-count");
  if(count)count.textContent=String(orders.length);
  if(progress)progress.textContent=String(orders.filter(o=>["PAID","PROCESSING","DOCUMENTS_REQUIRED","IN_PROGRESS"].includes(o.status)).length);
  if(docsCount)docsCount.textContent=String(orders.filter(o=>["REQUESTED","DOCUMENTS_REQUIRED"].includes(o.status)).length);
  if(!orders.length){ordersNode.innerHTML='<div class="empty-state">You do not have any requests yet. Use the form below to tell us what you need.</div>';return;}
  ordersNode.innerHTML=orders.map(o=>{
    const status=statusNames[o.status]||o.status;
    const pay=o.status==="PENDING_PAYMENT"&&o.amount_paise?'<button class="button button-small" type="button" data-pay="'+enc(o.id)+'">Pay '+enc(money(o.amount_paise))+'</button>':"";
    return '<article class="order-card"><div class="order-top"><div><span class="status '+(o.status==="COMPLETED"?"status-progress":"status-pending")+'">'+enc(status)+'</span><h3>'+enc(o.service_name)+'</h3><p class="order-id">Order ID: <strong>'+enc(o.id)+'</strong></p></div><span class="order-date">'+enc(date(o.created_at))+'</span></div><div class="order-meta"><span>Agreed fee: <strong>'+enc(money(o.amount_paise))+'</strong></span><span>'+enc(o.package||"")+'</span></div><details class="order-details"><summary>Request details</summary><p>'+enc(o.details).replace(/\n/g,"<br>")+'</p></details><div class="order-actions">'+pay+'<label class="file-button">Upload document<input type="file" hidden data-upload-order="'+enc(o.id)+'" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"></label></div><p class="form-feedback" id="order-feedback-'+enc(o.id)+'" aria-live="polite"></p><div class="order-documents"><strong>Documents</strong><ul id="documents-'+enc(o.id)+'"><li>Loading…</li></ul></div></article>';
  }).join("");
  await Promise.all(orders.map(renderOrderDocuments));
}
const dashboard=byId("customer-name");
if(dashboard){
  (async()=>{
    try{
      const data=await api("/api/user/me"),u=data.user;
      dashboard.textContent=(u.name||"Customer").split(/\s+/)[0];
      for(const [id,key] of [["profile-name","name"],["profile-email","email"],["profile-company","company"],["profile-phone","phone"]]){const el=byId(id);if(el)el.value=u[key]||"";}
      if(u.role==="admin"){const nav=document.querySelector(".account-nav");if(nav&&!byId("admin-nav-link")){const a=document.createElement("a");a.id="admin-nav-link";a.href="admin.html";a.textContent="Admin";nav.insertBefore(a,nav.firstChild);}}
      await loadOrders();
    }catch(e){location.replace("login.html?next=dashboard");}
  })();
}

const requestForm=byId("request-service-form");
if(requestForm)requestForm.addEventListener("submit",async event=>{
  event.preventDefault();if(!requestForm.reportValidity())return;
  const f=new FormData(requestForm),button=requestForm.querySelector("button[type=submit]");if(button)button.disabled=true;
  try{const r=await api("/api/orders",{method:"POST",body:JSON.stringify({serviceSlug:f.get("serviceSlug"),package:f.get("package"),details:f.get("details")})});feedback(byId("request-service-feedback"),"Request created: "+r.order.id+". We will review the requirements and add a quote after scope is confirmed.");requestForm.reset();await loadOrders();}
  catch(e){feedback(byId("request-service-feedback"),e.message,true);}
  finally{if(button)button.disabled=false;}
});

const profileForm=byId("profile-form");
if(profileForm)profileForm.addEventListener("submit",async event=>{
  event.preventDefault();if(!profileForm.reportValidity())return;
  const button=profileForm.querySelector("button[type=submit]");if(button)button.disabled=true;
  try{const r=await api("/api/user/me",{method:"PUT",body:JSON.stringify({name:byId("profile-name").value,company:byId("profile-company").value,phone:byId("profile-phone").value})});if(dashboard)dashboard.textContent=(r.user.name||"Customer").split(/\s+/)[0];feedback(byId("profile-feedback"),"Profile saved to your account.");}
  catch(e){feedback(byId("profile-feedback"),e.message,true);}
  finally{if(button)button.disabled=false;}
});

if(ordersNode){
  ordersNode.addEventListener("click",async event=>{
    const button=event.target.closest("[data-pay]");if(!button)return;
    const orderId=button.getAttribute("data-pay");button.disabled=true;
    const out=byId("order-feedback-"+orderId);
    try{
      if(typeof window.Cashfree!=="function")throw new Error("Payment checkout could not load. Refresh the page and retry.");
      const p=await api("/api/payments/create",{method:"POST",body:JSON.stringify({orderId})});
      const cashfree=window.Cashfree({mode:p.mode==="production"?"production":"sandbox"});
      await cashfree.checkout({paymentSessionId:p.paymentSessionId,redirectTarget:"_self"});
    }catch(e){feedback(out,e.message,true);button.disabled=false;}
  });
  ordersNode.addEventListener("change",async event=>{
    const input=event.target.closest("[data-upload-order]");if(!input||!input.files||!input.files[0])return;
    const id=input.getAttribute("data-upload-order"),out=byId("order-feedback-"+id),f=new FormData();f.append("file",input.files[0]);
    input.disabled=true;
    try{const r=await api("/api/orders/"+encodeURIComponent(id)+"/upload",{method:"POST",body:f});feedback(out,"Uploaded "+r.document.fileName+". It is stored privately and awaits review.");input.value="";await renderOrderDocuments({id});}
    catch(e){feedback(out,e.message,true);}
    finally{input.disabled=false;}
  });
}

const logout=byId("logout-button");
if(logout)logout.addEventListener("click",async()=>{logout.disabled=true;try{await api("/api/logout",{method:"POST"});}catch{}location.href="login.html";});
})();

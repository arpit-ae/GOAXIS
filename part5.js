(() => {
  "use strict";
  window.GOAXIS_USE_API = true;
  const $ = (s, root = document) => root.querySelector(s);
  const byId = s => document.getElementById(s);
  const text = (tag, value, cls) => { const n = document.createElement(tag); n.textContent = value == null ? "" : String(value); if (cls) n.className = cls; return n; };
  const tell = (node, message, bad = false) => { if (!node) return; node.textContent = message || ""; node.classList.toggle("is-error", !!bad); };
  const val = (form, name) => String(form?.elements.namedItem(name)?.value || "").trim();
  const dateLabel = value => { const date = new Date(value); return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleDateString(undefined, {day:"numeric",month:"short",year:"numeric"}); };
  async function api(path, options = {}) {
    const headers = new Headers(options.headers || {});
    if (options.body != null && !(options.body instanceof FormData) && !headers.has("content-type")) headers.set("content-type","application/json");
    const response = await fetch("/api" + path, {credentials:"same-origin", ...options, headers});
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error(data.error || "Request failed (" + response.status + ")"); error.status = response.status; throw error; }
    return data;
  }
  function bindForm(form, feedback, action, busyText) {
    if (!form || form.dataset.goaxisApiBound) return;
    form.dataset.goaxisApiBound = "true";
    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const button = form.querySelector('button[type="submit"]'), original = button?.textContent || "Submit";
      if (button) { button.disabled = true; button.textContent = busyText || "Submitting…"; }
      tell(feedback, "");
      try { const message = await action(new FormData(form)); if (message) tell(feedback, message); }
      catch (error) { tell(feedback, error.message || "Request failed. Please try again.", true); }
      finally { if (button) { button.disabled = false; button.textContent = original; } }
    });
  }
  const year = byId("current-year"); if (year) year.textContent = String(new Date().getFullYear());
  const toggle = $(".menu-toggle"), nav = $("#primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => { const open = nav.classList.toggle("is-open"); toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation"); });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => { nav.classList.remove("is-open"); toggle.setAttribute("aria-expanded","false"); }));
  }
  document.querySelectorAll("[data-service]").forEach(link => link.addEventListener("click", () => { const field = byId("service"); if (field) field.value = link.dataset.service || ""; }));

  const home = byId("enquiry-form");
  bindForm(home, byId("form-feedback"), async formData => {
    const result = await api("/enquiry",{method:"POST",body:JSON.stringify({name:String(formData.get("name")||"").trim(),email:String(formData.get("email")||"").trim(),phone:String(formData.get("phone")||"").trim(),service:String(formData.get("service")||"").trim(),message:String(formData.get("message")||"").trim()})});
    home.reset(); return "Enquiry submitted successfully. Reference: " + result.lead_id + ".";
  }, "Sending enquiry…");
  const serviceForm = byId("service-enquiry-form");
  bindForm(serviceForm, byId("service-feedback"), async () => {
    const details = ["Business name: " + (val(serviceForm,"businessName") || "Not supplied"),"Business type: " + (val(serviceForm,"businessType") || "Not supplied"),"Requirement: " + val(serviceForm,"details")].join("\n");
    const result = await api("/enquiry",{method:"POST",body:JSON.stringify({name:val(serviceForm,"name"),email:val(serviceForm,"email").toLowerCase(),phone:val(serviceForm,"phone"),service:val(serviceForm,"service") || byId("service-title")?.textContent || "Service enquiry",message:details})});
    serviceForm.reset(); const hidden = byId("service-field"); if (hidden) hidden.value = byId("service-title")?.textContent || "";
    return "Enquiry submitted successfully. Reference: " + result.lead_id + ".";
  }, "Sending enquiry…");
  const quote = byId("website-quote-form");
  bindForm(quote, byId("website-feedback"), async () => {
    const pack = val(quote,"package");
    const details = ["Project/business name: " + val(quote,"company"),"Package: " + pack,"Contact person: " + val(quote,"contactName"),"Approximate pages: " + (val(quote,"pages") || "Not specified"),"Design preferences: " + (val(quote,"design") || "Not specified"),"Features/integrations: " + val(quote,"features"),"Target timeline: " + (val(quote,"timeline") || "Flexible")].join("\n");
    const result = await api("/enquiry",{method:"POST",body:JSON.stringify({name:val(quote,"contactName"),email:val(quote,"email").toLowerCase(),phone:val(quote,"phone"),service:"Website Development — " + pack,message:details})});
    quote.reset(); return "Website quotation request sent. Reference: " + result.lead_id + ".";
  }, "Sending request…");

  const signup = byId("signup-form");
  bindForm(signup,byId("signup-feedback"),async () => {
    const password = String(signup.elements.namedItem("password")?.value || ""), confirmation = String(signup.elements.namedItem("confirmPassword")?.value || "");
    if (password !== confirmation) throw new Error("Passwords do not match.");
    if (password.length < 12 || password.length > 200) throw new Error("Use a password between 12 and 200 characters.");
    await api("/signup",{method:"POST",body:JSON.stringify({name:val(signup,"name"),email:val(signup,"email").toLowerCase(),password,company:val(signup,"company"),phone:val(signup,"phone")})});
    location.href = "dashboard.html"; return "Account created. Opening dashboard…";
  },"Creating account…");
  const login = byId("login-form");
  bindForm(login,byId("login-feedback"),async () => {
    await api("/login",{method:"POST",body:JSON.stringify({email:val(login,"email").toLowerCase(),password:String(login.elements.namedItem("password")?.value || "")})});
    location.href = "dashboard.html"; return "Signed in. Opening dashboard…";
  },"Signing in…");
  const logout = byId("logout-button");
  if (logout) logout.addEventListener("click",async () => { logout.disabled=true; try { await api("/logout",{method:"POST",body:"{}"}); } catch (error) { console.error("Logout request failed",error); } finally { location.href="login.html"; } });

  if (byId("customer-name")) initializeDashboard();
  async function initializeDashboard() {
    const feedback=byId("dashboard-feedback"), serviceSelect=byId("demo-service"), orderForm=byId("demo-order-form"), orderList=byId("orders-list"), detail=byId("selected-order-detail"), fileInput=byId("document-file"), uploadButton=byId("add-document-button");
    let services=[],orders=[],selectedId=null,documents=[];
    try {
      const current=await api("/user/me"), user=current.user;
      byId("customer-name").textContent=(user.name||"Customer").trim().split(/\s+/)[0]||"Customer";
      [["profile-name","name"],["profile-email","email"],["profile-company","company"],["profile-phone","phone"]].forEach(pair=>{const field=byId(pair[0]);if(field)field.value=user[pair[1]]||"";});
    } catch(error) { if(error.status===401){location.replace("login.html");return;} tell(feedback,error.message,true); return; }
    try {
      const result=await api("/services"); services=Array.isArray(result.services)?result.services:[];
      if(serviceSelect){serviceSelect.replaceChildren(new Option("Choose a service",""));services.forEach(service=>serviceSelect.add(new Option(service.name,String(service.id))));}
    } catch(error){tell(feedback,"Could not load services: "+error.message,true);}
    function updateCounts(){
      if(byId("request-count"))byId("request-count").textContent=String(orders.length);
      if(byId("progress-count"))byId("progress-count").textContent=String(orders.filter(order=>!["Completed","Approved","Cancelled","Rejected"].includes(order.status)).length);
      if(byId("documents-count"))byId("documents-count").textContent=String(documents.length);
    }
    function drawOrders(){
      if(!orderList)return; orderList.replaceChildren(); updateCounts();
      if(!orders.length){orderList.append(text("p","You have no orders yet. Use the form above to create your first request."));if(detail)detail.replaceChildren(text("p","Choose an order to view its status.","small-print"));selectedId=null;documents=[];updateCounts();return;}
      orders.forEach(order=>{
        const card=text("article","","order-card"+(order.id===selectedId?" is-selected":"")),top=text("div","","order-top"),copy=text("div",""),settled=["Paid","Approved","Completed"].includes(order.status);
        copy.append(text("span",order.status||"Status unavailable","status "+(settled?"status-progress":"status-pending")),text("h3",order.service_name||"Business service"),text("p","Order ID: "+order.id,"order-id"),text("small",dateLabel(order.created_at),"order-date"));top.append(copy);card.append(top);
        const amount=Number(order.amount||0);card.append(text("p",amount>0?"Approved amount: ₹"+amount.toLocaleString("en-IN"):"Quotation required — no payment is due yet.","small-print"));
        const button=text("button","View order details →","button button-small view-order-button");button.type="button";button.addEventListener("click",()=>{selectedId=order.id;drawOrders();});card.append(button);orderList.append(card);
      });
      if(!selectedId||!orders.some(order=>order.id===selectedId))selectedId=orders[0].id;
      loadOrder(selectedId);
    }
    async function loadOrder(orderId){
      if(!detail)return;detail.replaceChildren(text("p","Loading order details…","small-print"));
      try{
        const data=await api("/orders/"+encodeURIComponent(orderId)),order=data.order;documents=Array.isArray(data.documents)?data.documents:[];updateCounts();
        const header=text("div","","order-detail-head"),copy=text("div",""),done=["Paid","Approved","Completed"].includes(order.status);
        copy.append(text("p","ORDER DETAILS","eyebrow"),text("h3",order.id),text("p",(order.service_name||"Business service")+" · "+dateLabel(order.created_at),"muted"));header.append(copy,text("span",order.status||"Unknown status","status "+(done?"status-progress":"status-pending")));
        const body=document.createDocumentFragment();body.append(header,text("p",order.details||"No requirement details supplied.","detail-requirement"));
        const amount=Number(order.amount||0);body.append(text("p",amount>0?"Approved amount: ₹"+amount.toLocaleString("en-IN")+" "+(order.currency||"INR"):"A quotation is required before payment.","small-print"));
        if(amount>0&&!["Paid","Completed","Cancelled","Rejected"].includes(order.status)){
          const pay=text("button","Proceed to secure payment →","button button-small");pay.type="button";pay.addEventListener("click",()=>startPayment(order,pay));body.append(pay);
        }
        body.append(text("h4","Uploaded documents"));
        if(!documents.length)body.append(text("p","No documents uploaded for this order.","small-print"));
        documents.forEach(doc=>{const row=text("div","","document-row"),copy=text("div","","document-copy");row.append(text("span","▤","document-icon"));copy.append(text("strong",doc.file_name||"Uploaded document"),text("small",(doc.verified?"Verified by GOAXIS":"Awaiting review")+" · "+dateLabel(doc.uploaded_at)+" · Private storage"));row.append(copy);body.append(row);});
        body.append(text("p","Documents are stored privately; no public download link is exposed. Malware scanning is not configured yet. Upload only non-sensitive test documents until the launch checklist is completed.","small-print"));
        detail.replaceChildren(body);const selectedHeading=byId("selected-document-heading");if(selectedHeading)selectedHeading.textContent="Selected order: "+order.id;
      }catch(error){tell(feedback,error.message||"Could not load order details.",true);detail.replaceChildren(text("p",error.message||"Could not load order details.","small-print"));}
    }
    async function startPayment(order,button){
      button.disabled=true;tell(feedback,"Creating a Cashfree checkout session…");
      try{const data=await api("/payments/create",{method:"POST",body:JSON.stringify({order_id:order.id})});if(typeof window.Cashfree!=="function")throw new Error("Cashfree checkout did not load. Check the network connection and content security policy.");const cashfree=window.Cashfree({mode:data.mode==="production"?"production":"sandbox"});await cashfree.checkout({paymentSessionId:data.payment_session_id,redirectTarget:"_self"});}
      catch(error){tell(feedback,error.message||"Could not start payment.",true);button.disabled=false;}
    }
    bindForm(orderForm,byId("demo-order-feedback"),async()=>{
      const serviceId=Number(serviceSelect?.value);if(!Number.isInteger(serviceId)||!services.some(service=>Number(service.id)===serviceId))throw new Error("Choose a valid service.");
      const data=await api("/orders",{method:"POST",body:JSON.stringify({service_id:serviceId,package:val(orderForm,"package"),details:val(orderForm,"details")})});orderForm.reset();tell(feedback,"Order "+data.order_id+" created. "+(Number(data.amount)>0?"An approved amount is available.":"A quotation is required before payment."));
      const result=await api("/orders");orders=Array.isArray(result.orders)?result.orders:[];selectedId=data.order_id;drawOrders();return "Order created successfully: "+data.order_id+".";
    },"Creating order…");
    const profile=byId("profile-form");
    bindForm(profile,byId("profile-feedback"),async()=>{
      await api("/user/me",{method:"PUT",body:JSON.stringify({name:val(profile,"name"),company:val(profile,"company"),phone:val(profile,"phone")})});
      const current=await api("/user/me");byId("customer-name").textContent=(current.user.name||"Customer").trim().split(/\s+/)[0]||"Customer";return "Profile updated successfully.";
    },"Saving profile…");
    async function uploadDocument(){
      const fb=byId("upload-feedback"),file=fileInput?.files?.[0];if(!selectedId)return tell(fb,"Select an order before uploading a document.",true);if(!file)return tell(fb,"Choose a PDF, JPG or PNG file first.",true);
      if(file.size<1||file.size>10*1024*1024)return tell(fb,"Choose a file up to 10 MB.",true);
      if(!["application/pdf","image/jpeg","image/png"].includes(file.type))return tell(fb,"Only PDF, JPG and PNG files are accepted.",true);
      uploadButton.disabled=true;tell(fb,"Uploading to private storage…");
      try{const formData=new FormData();formData.append("file",file);const data=await api("/orders/"+encodeURIComponent(selectedId)+"/upload",{method:"POST",body:formData});tell(fb,(data.file_name||"Document")+" uploaded privately. It is awaiting review.");fileInput.value="";await loadOrder(selectedId);}
      catch(error){tell(fb,error.message||"Upload failed.",true);}finally{uploadButton.disabled=false;}
    }
    if(uploadButton)uploadButton.addEventListener("click",uploadDocument);
    if(fileInput)fileInput.addEventListener("change",()=>{const file=fileInput.files?.[0];if(!file)return;if(file.size>10*1024*1024||!["application/pdf","image/jpeg","image/png"].includes(file.type)){fileInput.value="";tell(byId("upload-feedback"),"Choose a PDF, JPG or PNG file no larger than 10 MB.",true);}else tell(byId("upload-feedback"),"Ready to upload "+file.name+". Use non-sensitive test documents until malware scanning is enabled.");});
    try{const data=await api("/orders");orders=Array.isArray(data.orders)?data.orders:[];tell(feedback,"Signed in. Orders are loaded from the GOAXIS server.");drawOrders();}
    catch(error){tell(feedback,error.message||"Could not load orders.",true);}
  }

  const paymentStatus=byId("payment-return-status"),refreshStatus=byId("refresh-payment-status");
  if(paymentStatus){
    const checkStatus=async()=>{
      const orderId=(new URLSearchParams(location.search).get("goax_order_id") || new URLSearchParams(location.search).get("order_id"));
      if(!orderId)return tell(paymentStatus,"No order ID supplied. Open your dashboard to view orders.",true);
      tell(paymentStatus,"Checking server-confirmed payment status…");
      try{const data=await api("/orders/"+encodeURIComponent(orderId)),order=data.order;tell(paymentStatus,order.status==="Paid"||order.status==="Completed"?"Payment confirmed by the server for order "+order.id+". Current status: "+order.status+".":"Order "+order.id+" is currently "+order.status+". The verified gateway notification may still be processing. Refresh to check again.");}
      catch(error){tell(paymentStatus,error.status===401?"Sign in to check the latest order status.":error.message||"Could not check payment status.",true);}
    };
    if(refreshStatus)refreshStatus.addEventListener("click",checkStatus);checkStatus();
  }
})();
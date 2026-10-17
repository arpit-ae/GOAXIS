(() => {
"use strict";
const out=document.getElementById("payment-result-message"),orderOut=document.getElementById("payment-result-order");
const id=new URLSearchParams(location.search).get("order_id");
async function check(){
 if(!id){out.textContent="Order reference is missing. Open your dashboard to check the latest status.";return;}
 orderOut.textContent="Order ID: "+id;
 try{
  const r=await fetch("/api/payments/status?order_id="+encodeURIComponent(id),{credentials:"same-origin",headers:{"Accept":"application/json"}});
  const d=await r.json();
  if(!r.ok)throw new Error(d?.error?.message||"Could not verify payment.");
  if(d.paymentStatus==="SUCCESS")out.textContent="Payment confirmed by the server. Your order is marked paid.";
  else if(d.paymentStatus==="PENDING")out.textContent="Cashfree is still processing the payment. Your order has not been marked paid yet; check the dashboard again shortly.";
  else if(d.paymentStatus==="NOT_STARTED")out.textContent="No payment attempt was found for this order. Open the dashboard to continue.";
  else out.textContent="The payment was not confirmed as successful. Your order remains unpaid; use the dashboard to retry or contact support.";
 }catch(e){out.textContent=e.message+" Your dashboard remains the source of truth for order status.";}
}
check();
})();
import assert from "node:assert/strict";

const base = (process.env.GOAXIS_BASE_URL || "http://127.0.0.1:8788").replace(/\/$/, "");
const routes = [
  "/", "/services.html", "/website-builder.html", "/signup.html",
  "/login.html", "/dashboard.html", "/admin.html", "/privacy.html", "/terms.html"
];

for (const route of routes) {
  const response = await fetch(new URL(route, base), { redirect: "manual" });
  assert.equal(response.status, 200, `${route} returned HTTP ${response.status}`);
  const type = response.headers.get("content-type") || "";
  assert.match(type, /text\/html/i, `${route} did not return HTML`);
  console.log(`PASS ${route} (${response.status})`);
}

const health = await fetch(new URL("/api/health", base), { redirect: "manual" });
assert.equal(health.status, 200, `/api/health returned HTTP ${health.status}`);
const payload = await health.json();
assert.equal(payload.ok, true, "API health payload did not contain ok=true");
console.log("PASS /api/health");

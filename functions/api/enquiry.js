const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
  "x-content-type-options": "nosniff"
};

function respond(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

function clean(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function validEmail(value) {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequest({ request, env }) {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { ...JSON_HEADERS, allow: "POST" }
    });
  }

  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  if (!origin) return respond({ error: "Request origin could not be verified. Please reload and try again." }, 403);
  try {
    if (new URL(origin).host !== url.host) {
      return respond({ error: "Request origin is not allowed." }, 403);
    }
  } catch {
    return respond({ error: "Request origin is not valid." }, 403);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return respond({ error: "Please submit the form using the website." }, 415);
  }

  const length = Number(request.headers.get("content-length") || "0");
  if (length > 12000) return respond({ error: "Your enquiry is too long. Please shorten it and try again." }, 413);

  let rawBody;
  try {
    rawBody = await request.text();
  } catch {
    return respond({ error: "The submitted form could not be read. Please check it and try again." }, 400);
  }
  if (rawBody.length > 12000) return respond({ error: "Your enquiry is too long. Please shorten it and try again." }, 413);
  let input;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return respond({ error: "The submitted form could not be read. Please check it and try again." }, 400);
  }
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return respond({ error: "Invalid enquiry details." }, 400);
  }

  // A filled honeypot means this is likely an automated submission. Return a generic
  // success response without storing it so bots do not learn the filter.
  if (clean(input.website, 200)) return respond({ success: true, reference: null }, 201);

  const name = clean(input.name, 100);
  const email = clean(input.email, 254).toLowerCase();
  const phone = clean(input.phone, 20);
  const service = clean(input.service, 160);
  const message = clean(input.message, 3000);

  if (name.length < 2) return respond({ error: "Please enter your full name." }, 400);
  if (!validEmail(email)) return respond({ error: "Please enter a valid email address." }, 400);
  if (!service) return respond({ error: "Please choose a service." }, 400);
  if (message.length < 5) return respond({ error: "Please add a little more detail about your requirement." }, 400);
  if (phone && !/^[+0-9() .-]{7,20}$/.test(phone)) {
    return respond({ error: "Please check your phone number." }, 400);
  }
  if (!env.DB) return respond({ error: "The enquiry service is not configured yet. Please try again later." }, 503);

  try {
    const now = new Date().toISOString();
    const result = await env.DB.prepare(
      "INSERT INTO Leads (name, email, phone, service, message, status, created_at) VALUES (?, ?, ?, ?, ?, 'new', ?)"
    ).bind(name, email, phone, service, message, now).run();

    return respond({
      success: true,
      reference: "ENQ-" + new Date().getUTCFullYear() + "-" + String(result.meta.last_row_id).padStart(5, "0")
    }, 201);
  } catch (error) {
    // Avoid exposing database details or personal information to the browser.
    console.error("GOAXIS enquiry save failed", error instanceof Error ? error.message : "unknown error");
    return respond({ error: "We could not save your enquiry right now. Your details have not been confirmed as received. Please try again shortly." }, 503);
  }
}

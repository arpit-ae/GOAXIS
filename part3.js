(() => {
  "use strict";

  const PROFILE_KEY = "goaxis_demo_profile_v1";
  const SESSION_KEY = "goaxis_demo_session_v1";
  const ORDERS_KEY = "goaxis_demo_orders_v1";
  const COUNTER_PREFIX = "goaxis_demo_counter_";
  const PBKDF2_ITERATIONS = 120000;
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const ALLOWED_FILE_NAME = /\.(pdf|docx?|jpe?g|png)$/i;
  const ORDER_STATUSES = [
    "Request received",
    "Requirement review",
    "Quotation preparation",
    "Awaiting customer approval",
    "Awaiting payment",
    "Payment confirmation",
    "Documents required",
    "Documents submitted",
    "Work in progress",
    "Authority / third-party processing",
    "Completed"
  ];

  const byId = id => document.getElementById(id);
  const escapeHTML = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[char]));
  const readJSON = (key, fallback) => {
    try {
      const value = JSON.parse(sessionStorage.getItem(key) || "null");
      return value == null ? fallback : value;
    } catch {
      return fallback;
    }
  };
  const writeJSON = (key, value) => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  };
  const readProfile = () => readJSON(PROFILE_KEY, null);
  const writeProfile = profile => writeJSON(PROFILE_KEY, profile);
  const readOrders = () => {
    const orders = readJSON(ORDERS_KEY, []);
    return Array.isArray(orders) ? orders : [];
  };
  const writeOrders = orders => writeJSON(ORDERS_KEY, orders);
  const setFeedback = (node, message, isError = false) => {
    if (!node) return;
    node.textContent = message;
    node.classList.toggle("is-error", Boolean(isError));
    node.classList.add("is-visible");
  };
  const supportsCrypto = () => Boolean(window.crypto && crypto.subtle && crypto.getRandomValues);
  const toBase64 = bytes => {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  };
  const fromBase64 = value => Uint8Array.from(atob(value), char => char.charCodeAt(0));
  const randomHex = byteLength => {
    const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
    return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
  };
  async function deriveVerifier(password, salt) {
    const key = await crypto.subtle.importKey(
      "raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]
    );
    const bits = await crypto.subtle.deriveBits({
      name: "PBKDF2",
      salt: salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256"
    }, key, 256);
    return toBase64(new Uint8Array(bits));
  }
  async function makePasswordRecord(password) {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    return {
      passwordSalt: toBase64(salt),
      passwordVerifier: await deriveVerifier(password, salt),
      passwordAlgorithm: "PBKDF2-SHA-256",
      passwordIterations: PBKDF2_ITERATIONS
    };
  }
  async function passwordMatches(password, profile) {
    if (!profile || !profile.passwordSalt || !profile.passwordVerifier) return false;
    const candidate = await deriveVerifier(password, fromBase64(profile.passwordSalt));
    if (candidate.length !== profile.passwordVerifier.length) return false;
    let difference = 0;
    for (let i = 0; i < candidate.length; i++) {
      difference |= candidate.charCodeAt(i) ^ profile.passwordVerifier.charCodeAt(i);
    }
    return difference === 0;
  }
  const setSession = () => {
    try {
      sessionStorage.setItem(SESSION_KEY, "preview");
      return true;
    } catch {
      return false;
    }
  };
  const isSignedIn = () => {
    const profile = readProfile();
    try {
      return sessionStorage.getItem(SESSION_KEY) === "preview" &&
        Boolean(profile && profile.id && profile.email);
    } catch {
      return false;
    }
  };
  const formatDate = value => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" :
      date.toLocaleDateString(undefined, {day:"numeric", month:"short", year:"numeric"});
  };
  const orderStatus = order => ORDER_STATUSES[Math.max(0, Math.min(
    ORDER_STATUSES.length - 1, Number(order.statusIndex) || 0
  ))];
  const showProfile = profile => {
    if (byId("customer-name")) {
      byId("customer-name").textContent = String(profile.name || "Customer").trim().split(/\s+/)[0] || "Customer";
    }
    for (const pair of [["profile-name","name"],["profile-email","email"],["profile-company","company"],["profile-phone","phone"]]) {
      const field = byId(pair[0]);
      if (field) field.value = profile[pair[1]] || "";
    }
  };

  function nextOrderId(orders) {
    const year = new Date().getFullYear();
    const counterKey = COUNTER_PREFIX + year;
    const used = new Set(orders.map(order => order.id));
    let count = Math.max(1, Number(sessionStorage.getItem(counterKey)) || 1);
    let id;
    do {
      id = "GOAX-" + year + "-" + String(count).padStart(5, "0");
      count++;
    } while (used.has(id));
    sessionStorage.setItem(counterKey, String(count));
    return id;
  }
  function seedDemoOrders() {
    let orders = readOrders();
    if (orders.length) return orders;
    try {
      const today = new Date().toISOString();
      const firstId = nextOrderId(orders);
      orders.push({
        id:firstId, service:"GST Registration Assistance", package:"Standard consultancy request",
        details:"Illustrative sample request. Replace this with your own demo request to test the workflow.",
        statusIndex:2, createdAt:today, documents:[]
      });
      const secondId = nextOrderId(orders);
      orders.push({
        id:secondId, service:"Website Development", package:"Basic Business Website",
        details:"Illustrative sample website brief. No actual work has been requested.",
        statusIndex:0, createdAt:today, documents:[]
      });
      if (!writeOrders(orders)) throw new Error("Browser session storage is unavailable.");
    } catch {
      const note = byId("dashboard-feedback");
      setFeedback(note, "The demo records could not be initialised. Please check browser storage settings.", true);
    }
    return orders;
  }

  const year = byId("current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  const signup = byId("signup-form");
  if (signup) signup.addEventListener("submit", async event => {
    event.preventDefault();
    if (!signup.reportValidity()) return;
    const message = byId("signup-feedback");
    if (!supportsCrypto()) {
      setFeedback(message, "Secure browser cryptography is unavailable. Open this site over HTTPS or use localhost for the preview.", true);
      return;
    }
    const data = new FormData(signup);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim().toLowerCase();
    const company = String(data.get("company") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");
    if (name.length < 2) return setFeedback(message, "Please enter your full name.", true);
    if (password !== confirmPassword) return setFeedback(message, "Passwords do not match.", true);

    const existing = readProfile();
    if (existing && String(existing.email || "").toLowerCase() === email) {
      return setFeedback(message, "A demo account for this email already exists in this browser tab. Log in instead.", true);
    }
    if (existing) {
      return setFeedback(message, "This browser tab already has a demo account. Log out and use that account, or open a separate tab for another preview.", true);
    }

    const submit = signup.querySelector('button[type="submit"]');
    if (submit) { submit.disabled = true; submit.textContent = "Creating preview account…"; }
    try {
      const passwordRecord = await makePasswordRecord(password);
      const profile = {
        id:randomHex(16), name:name, email:email, company:company, phone:phone,
        createdAt:new Date().toISOString(), ...passwordRecord
      };
      if (!writeProfile(profile)) throw new Error("Could not save the preview account to browser session storage.");
      if (!setSession()) throw new Error("Could not create a browser preview session.");
      setFeedback(message, "Demo account created for this browser session. Opening dashboard…");
      location.href = "dashboard.html";
    } catch (error) {
      setFeedback(message, error.message || "Could not create the preview account.", true);
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = "Create preview account →"; }
    }
  });

  const login = byId("login-form");
  if (login) login.addEventListener("submit", async event => {
    event.preventDefault();
    if (!login.reportValidity()) return;
    const message = byId("login-feedback");
    if (!supportsCrypto()) {
      setFeedback(message, "Secure browser cryptography is unavailable. Open this site over HTTPS or use localhost for the preview.", true);
      return;
    }
    const data = new FormData(login);
    const profile = readProfile();
    const email = String(data.get("email") || "").trim().toLowerCase();
    const password = String(data.get("password") || "");
    if (!profile || String(profile.email || "").toLowerCase() !== email) {
      return setFeedback(message, "No matching preview account exists in this browser tab. Create an account first.", true);
    }
    const submit = login.querySelector('button[type="submit"]');
    if (submit) { submit.disabled = true; submit.textContent = "Checking preview account…"; }
    try {
      if (!(await passwordMatches(password, profile))) {
        return setFeedback(message, "Email or password is incorrect.", true);
      }
      if (!setSession()) return setFeedback(message, "Could not create a browser preview session.", true);
      location.href = "dashboard.html";
    } catch {
      setFeedback(message, "Preview sign-in failed. Please try again.", true);
    } finally {
      if (submit) { submit.disabled = false; submit.textContent = "Open dashboard →"; }
    }
  });

  const logout = byId("logout-button");
  if (logout) logout.addEventListener("click", () => {
    try { sessionStorage.removeItem(SESSION_KEY); } catch {}
    location.href = "login.html";
  });

  const dashboard = byId("customer-name");
  if (dashboard) {
    if (!isSignedIn()) {
      location.replace("login.html");
      return;
    }
    const profile = readProfile();
    showProfile(profile);
  }

  const profileForm = byId("profile-form");
  if (profileForm) profileForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!profileForm.reportValidity()) return;
    const oldProfile = readProfile();
    if (!oldProfile) return setFeedback(byId("profile-feedback"), "Preview profile not found. Please log in again.", true);
    const updated = {
      ...oldProfile,
      name:byId("profile-name").value.trim(),
      company:byId("profile-company").value.trim(),
      phone:byId("profile-phone").value.trim()
    };
    if (!writeProfile(updated)) return setFeedback(byId("profile-feedback"), "Could not update browser session storage.", true);
    showProfile(updated);
    setFeedback(byId("profile-feedback"), "Preview profile updated in this browser tab only.");
  });

  if (dashboard) {
    const ordersList = byId("orders-list");
    const orderForm = byId("demo-order-form");
    const selectedDetail = byId("selected-order-detail");
    const selectedDocs = byId("selected-order-docs");
    const fileInput = byId("document-file");
    let selectedOrderId = null;

    const renderDocumentList = order => {
      if (!selectedDocs) return;
      const docs = Array.isArray(order.documents) ? order.documents : [];
      selectedDocs.innerHTML = docs.length ? docs.map(doc =>
        '<div class="document-row"><div class="document-icon">▤</div><div class="document-copy"><strong>' +
        escapeHTML(doc.name) + '</strong><small>' + escapeHTML(doc.type || "File") + " · " +
        escapeHTML((Number(doc.size || 0) / 1024).toFixed(1)) + ' KB · demo metadata only</small></div></div>'
      ).join("") : '<p class="small-print">No file metadata attached to this demo request.</p>';
    };

    const renderOrderDetails = order => {
      if (!selectedDetail) return;
      const currentIndex = Math.max(0, Math.min(ORDER_STATUSES.length - 1, Number(order.statusIndex) || 0));
      selectedDetail.innerHTML =
        '<div class="order-detail-head"><div><p class="eyebrow">REQUEST DETAILS</p><h3>' + escapeHTML(order.id) +
        '</h3><p class="muted">' + escapeHTML(order.service) + ' · ' + escapeHTML(formatDate(order.createdAt)) +
        '</p></div><span class="status status-progress">' + escapeHTML(orderStatus(order)) + '</span></div>' +
        '<p class="detail-requirement">' + escapeHTML(order.details) + '</p>' +
        '<p class="small-print">This is a local demo record. It was not sent to GOAXIS and no payment or application was made.</p>' +
        '<ol class="status-timeline">' + ORDER_STATUSES.map((status, index) => {
          const stateClass = index < currentIndex ? "is-done" : index === currentIndex ? "is-current" : "";
          const marker = index < currentIndex ? "✓" : String(index + 1);
          return '<li class="' + stateClass + '"' + (index === currentIndex ? ' aria-current="step"' : '') +
            '><span class="timeline-dot">' + marker + '</span><span><strong>' + escapeHTML(status) +
            '</strong>' + (index === currentIndex ? '<small>Current illustrative stage</small>' : '') +
            '</span></li>';
        }).join("") + '</ol>';
      renderDocumentList(order);
    };

    const renderOrders = () => {
      const orders = seedDemoOrders();
      const count = byId("request-count");
      const progressCount = byId("progress-count");
      const docsCount = byId("documents-count");
      if (count) count.textContent = String(orders.length);
      if (progressCount) progressCount.textContent = String(orders.filter(order => Number(order.statusIndex) < ORDER_STATUSES.length - 1).length);
      if (docsCount) docsCount.textContent = String(orders.filter(order => !(order.documents || []).length).length);
      if (!ordersList) return;
      ordersList.innerHTML = orders.map(order => {
        const index = Math.max(0, Math.min(ORDER_STATUSES.length - 1, Number(order.statusIndex) || 0));
        const percent = Math.round(index / (ORDER_STATUSES.length - 1) * 100);
        const active = order.id === selectedOrderId;
        return '<article class="order-card' + (active ? ' is-selected' : '') + '">' +
          '<div class="order-top"><div><span class="status ' + (index === ORDER_STATUSES.length - 1 ? 'status-progress' : 'status-pending') +
          '">' + escapeHTML(orderStatus(order)) + ' · demo</span><h3>' + escapeHTML(order.service) +
          '</h3><p class="order-id">Request ID: <strong>' + escapeHTML(order.id) + '</strong></p>' +
          '<span class="order-date">' + escapeHTML(formatDate(order.createdAt)) + '</span></div></div>' +
          '<div class="progress-track" aria-label="Illustrative progress ' + percent + ' percent"><span style="width:' + percent + '%"></span></div>' +
          '<p class="small-print">Illustrative workflow progress: ' + percent + '%</p>' +
          '<button type="button" class="button button-small view-order-button" data-order-id="' + escapeHTML(order.id) + '">View 11-stage tracker →</button></article>';
      }).join("");
      ordersList.querySelectorAll("[data-order-id]").forEach(button => {
        button.addEventListener("click", () => {
          const selected = readOrders().find(order => order.id === button.dataset.orderId);
          if (!selected) return;
          selectedOrderId = selected.id;
          renderOrders();
          renderOrderDetails(selected);
          if (selectedDetail) selectedDetail.scrollIntoView({behavior:"smooth", block:"start"});
          if (byId("selected-document-heading")) byId("selected-document-heading").textContent = "Selected request: " + selected.id;
        });
      });
      if (!selectedOrderId || !orders.some(order => order.id === selectedOrderId)) selectedOrderId = orders[0] ? orders[0].id : null;
      const selected = orders.find(order => order.id === selectedOrderId);
      if (selected) {
        renderOrderDetails(selected);
        if (byId("selected-document-heading")) byId("selected-document-heading").textContent = "Selected request: " + selected.id;
      }
    };

    if (orderForm) orderForm.addEventListener("submit", event => {
      event.preventDefault();
      if (!orderForm.reportValidity()) return;
      const orders = readOrders();
      const order = {
        id:nextOrderId(orders),
        service:byId("demo-service").value,
        package:byId("demo-package").value,
        details:byId("demo-details").value.trim(),
        statusIndex:0,
        createdAt:new Date().toISOString(),
        documents:[]
      };
      orders.unshift(order);
      if (!writeOrders(orders)) return setFeedback(byId("demo-order-feedback"), "Could not save the demo request to this browser tab.", true);
      selectedOrderId = order.id;
      orderForm.reset();
      setFeedback(byId("demo-order-feedback"), "Demo request created as " + order.id + ". It was not submitted to GOAXIS.");
      renderOrders();
      if (selectedDetail) selectedDetail.scrollIntoView({behavior:"smooth", block:"start"});
    });

    const addDocument = byId("add-document-button");
    const fileFeedback = byId("upload-feedback");
    if (fileInput) fileInput.addEventListener("change", () => {
      const file = fileInput.files && fileInput.files[0];
      if (!file) return setFeedback(fileFeedback, "No file selected. Files are never uploaded in this preview.");
      if (!ALLOWED_FILE_NAME.test(file.name) || file.size > MAX_FILE_BYTES) {
        fileInput.value = "";
        return setFeedback(fileFeedback, "Choose a PDF, DOC, DOCX, JPG or PNG file no larger than 5 MB.", true);
      }
      setFeedback(fileFeedback, "Selected " + file.name + " (" + (file.size / 1024).toFixed(1) + " KB). File contents have not been uploaded.");
    });
    if (addDocument) addDocument.addEventListener("click", () => {
      const file = fileInput && fileInput.files && fileInput.files[0];
      if (!file) return setFeedback(fileFeedback, "Choose a file first.", true);
      if (!ALLOWED_FILE_NAME.test(file.name) || file.size > MAX_FILE_BYTES) {
        return setFeedback(fileFeedback, "Choose a PDF, DOC, DOCX, JPG or PNG file no larger than 5 MB.", true);
      }
      const orders = readOrders();
      const index = orders.findIndex(order => order.id === selectedOrderId);
      if (index < 0) return setFeedback(fileFeedback, "Choose a demo request first.", true);
      orders[index].documents = Array.isArray(orders[index].documents) ? orders[index].documents : [];
      orders[index].documents.push({
        name:file.name, type:file.type || "Unknown file type", size:file.size,
        selectedAt:new Date().toISOString()
      });
      if (!writeOrders(orders)) return setFeedback(fileFeedback, "Could not save file metadata to browser session storage.", true);
      setFeedback(fileFeedback, "File name and metadata added to this demo request only. The actual file was not uploaded or stored.");
      renderOrders();
    });

    renderOrders();
  }
})();
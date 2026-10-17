-- Part 4 application tables, namespaced so the first prototype schema remains intact.
-- Safe to apply after migrations/0001_initial.sql.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_salt TEXT NOT NULL, password_hash TEXT NOT NULL,
  password_iterations INTEGER NOT NULL DEFAULT 310000,
  company TEXT NOT NULL DEFAULT '', phone TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','admin')),
  created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS app_sessions (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL, expires_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_app_sessions_expiry ON app_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_app_sessions_user ON app_sessions(user_id);

CREATE TABLE IF NOT EXISTS app_services (
  slug TEXT PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL,
  price_paise INTEGER, is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0,1)),
  sort_order INTEGER NOT NULL DEFAULT 100, created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS app_leads (
  id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '',
  business_name TEXT NOT NULL DEFAULT '', business_type TEXT NOT NULL DEFAULT '', service TEXT NOT NULL,
  message TEXT NOT NULL, source TEXT NOT NULL DEFAULT 'website', extra_json TEXT,
  status TEXT NOT NULL DEFAULT 'NEW', user_id TEXT REFERENCES app_users(id) ON DELETE SET NULL,
  order_id TEXT, consent_at TEXT NOT NULL, created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_app_leads_created ON app_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_leads_email ON app_leads(email);
CREATE INDEX IF NOT EXISTS idx_app_leads_status ON app_leads(status);

CREATE TABLE IF NOT EXISTS app_orders (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  service_slug TEXT NOT NULL REFERENCES app_services(slug), service_name TEXT NOT NULL,
  package TEXT NOT NULL DEFAULT '', details TEXT NOT NULL,
  amount_paise INTEGER CHECK(amount_paise IS NULL OR amount_paise > 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK(status IN ('REQUESTED','PENDING_PAYMENT','PAID','PROCESSING','DOCUMENTS_REQUIRED','IN_PROGRESS','COMPLETED','CANCELLED')),
  gateway_order_id TEXT, paid_at TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_app_orders_user_created ON app_orders(user_id,created_at DESC);
CREATE INDEX IF NOT EXISTS idx_app_orders_status ON app_orders(status);
CREATE INDEX IF NOT EXISTS idx_app_orders_created ON app_orders(created_at DESC);

CREATE TABLE IF NOT EXISTS app_payments (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES app_orders(id) ON DELETE RESTRICT,
  gateway TEXT NOT NULL DEFAULT 'CASHFREE', gateway_order_id TEXT NOT NULL UNIQUE,
  gateway_payment_id TEXT UNIQUE, payment_session_id TEXT,
  amount_paise INTEGER NOT NULL CHECK(amount_paise > 0), currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'PENDING', created_at TEXT NOT NULL, paid_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_app_payments_order ON app_payments(order_id,created_at DESC);

CREATE TABLE IF NOT EXISTS app_documents (
  id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES app_orders(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES app_users(id) ON DELETE RESTRICT,
  file_name TEXT NOT NULL, file_key TEXT NOT NULL UNIQUE, content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK(size_bytes > 0 AND size_bytes <= 5242880),
  verified INTEGER NOT NULL DEFAULT 0 CHECK(verified IN (0,1)),
  uploaded_at TEXT NOT NULL, verified_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_app_documents_order ON app_documents(order_id,uploaded_at DESC);
CREATE TABLE IF NOT EXISTS app_auth_attempts (
  attempt_key TEXT PRIMARY KEY, attempts INTEGER NOT NULL,
  window_started_at TEXT NOT NULL, blocked_until TEXT
);

INSERT OR IGNORE INTO app_services(slug,category,name,description,price_paise,is_active,sort_order,created_at) VALUES
('website-builder','DIGITAL','Website Development','Business websites, e-commerce storefronts and custom web applications. Quote required.',NULL,1,1,CURRENT_TIMESTAMP),
('gst','TAX & BUSINESS','GST Registration Assistance','Guidance on registration requirements and application documentation. Quote required.',NULL,1,2,CURRENT_TIMESTAMP),
('udyam','MSME','Udyam Registration Assistance','Guidance on official MSME registration information and process. Quote required.',NULL,1,3,CURRENT_TIMESTAMP),
('fssai','FOOD BUSINESS','FSSAI Registration & Licence Assistance','Guidance on applicable food business registration and supporting details. Quote required.',NULL,1,4,CURRENT_TIMESTAMP),
('iec','IMPORT & EXPORT','IEC Assistance','Guidance on IEC process and business information for import/export. Quote required.',NULL,1,5,CURRENT_TIMESTAMP),
('apeda','EXPORT READINESS','APEDA & Export Documentation','Guidance on APEDA-related registration and export documentation. Quote required.',NULL,1,6,CURRENT_TIMESTAMP),
('documents','BUSINESS DOCUMENTATION','Business Documents & Application Support','Guidance on business documents, checklists and application preparation. Quote required.',NULL,1,7,CURRENT_TIMESTAMP),
('other','CUSTOM SUPPORT','Other Business Requirements','Tell us about your requirement so we can review the scope and next steps. Quote required.',NULL,1,8,CURRENT_TIMESTAMP);

PRAGMA foreign_keys=ON;

CREATE TABLE IF NOT EXISTS Leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  service TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON Leads(created_at);
CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON Leads(status, created_at);

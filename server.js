const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "analytics.json");
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const sessions = new Map();

app.set("trust proxy", true);
app.use(express.json());
app.use(express.static(__dirname));

function emptyData() {
  return { visits: [], clicks: [] };
}

function loadData() {
  if (!fs.existsSync(DATA_FILE)) {
    return emptyData();
  }

  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return emptyData();
  }
}

function saveData(data) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length > 0) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || req.socket.remoteAddress || "unknown";
}

function createSession() {
  const token = crypto.randomBytes(32).toString("hex");
  sessions.set(token, Date.now() + SESSION_TTL_MS);
  return token;
}

function isValidSession(token) {
  if (!token || !sessions.has(token)) {
    return false;
  }

  if (sessions.get(token) < Date.now()) {
    sessions.delete(token);
    return false;
  }

  return true;
}

function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : req.headers["x-admin-token"];

  if (!isValidSession(token)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  next();
}

function buildStats(data) {
  const bannerClicks = {};
  const ipVisitCounts = {};
  const ipClickCounts = {};

  for (const visit of data.visits) {
    ipVisitCounts[visit.ip] = (ipVisitCounts[visit.ip] || 0) + 1;
  }

  for (const click of data.clicks) {
    const key = String(click.bannerId);
    bannerClicks[key] = (bannerClicks[key] || 0) + 1;
    ipClickCounts[click.ip] = (ipClickCounts[click.ip] || 0) + 1;
  }

  return {
    totalVisits: data.visits.length,
    totalClicks: data.clicks.length,
    uniqueVisitIps: Object.keys(ipVisitCounts).length,
    uniqueClickIps: Object.keys(ipClickCounts).length,
    bannerClicks,
    ipVisitCounts,
    ipClickCounts,
    visits: [...data.visits].reverse(),
    clicks: [...data.clicks].reverse(),
  };
}

app.post("/api/track/visit", (req, res) => {
  const data = loadData();
  data.visits.push({
    ip: getClientIp(req),
    userAgent: req.headers["user-agent"] || "",
    at: new Date().toISOString(),
  });
  saveData(data);
  res.json({ ok: true });
});

app.post("/api/track/click", (req, res) => {
  const bannerId = String(req.body?.bannerId || "").trim();
  if (!bannerId) {
    return res.status(400).json({ error: "bannerId required" });
  }

  const data = loadData();
  data.clicks.push({
    bannerId,
    bannerLabel: String(req.body?.bannerLabel || `배너 ${bannerId}`),
    ip: getClientIp(req),
    userAgent: req.headers["user-agent"] || "",
    at: new Date().toISOString(),
  });
  saveData(data);
  res.json({ ok: true });
});

app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body || {};

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ token: createSession() });
});

app.get("/api/admin/stats", requireAdmin, (_req, res) => {
  res.json(buildStats(loadData()));
});

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running at http://${HOST}:${PORT}`);
  console.log(`Admin panel: http://${HOST}:${PORT}/admin`);
});

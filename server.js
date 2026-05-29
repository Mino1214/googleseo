const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "analytics.json");
const ROOT_INDEX_FILE = path.join(__dirname, "index.html");
const LANDING_OUT_DIR = path.join(__dirname, "landing", "out");
const LANDING_INDEX_FILE = path.join(LANDING_OUT_DIR, "index.html");
const GOOGLESEO_QUERY_TOKEN =
  process.env.GOOGLESEO_QUERY_TOKEN?.trim() || crypto.randomUUID();
const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

const sessions = new Map();

app.set("trust proxy", true);
app.use(express.json());
app.get("/index.html", (req, res) => {
  if (isGoogleseoPage(req)) {
    return sendGoogleseoHtml(res);
  }

  res.redirect(302, "/");
});
app.use(
  "/_next",
  express.static(path.join(LANDING_OUT_DIR, "_next"), {
    index: false,
    redirect: false,
  }),
);
app.use(
  "/copied",
  express.static(path.join(LANDING_OUT_DIR, "copied"), {
    index: false,
    redirect: false,
  }),
);
app.use(
  "/media",
  express.static(path.join(LANDING_OUT_DIR, "media"), {
    index: false,
    redirect: false,
  }),
);
app.use(express.static(__dirname, { index: false, redirect: false }));

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
  const cfIp = req.headers["cf-connecting-ip"];
  if (typeof cfIp === "string" && cfIp.length > 0) {
    return cfIp.trim();
  }

  const trueClientIp = req.headers["true-client-ip"];
  if (typeof trueClientIp === "string" && trueClientIp.length > 0) {
    return trueClientIp.trim();
  }

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

function isGoogleseoPage(req) {
  const queryIndex = req.originalUrl.indexOf("?");
  if (queryIndex === -1) {
    return false;
  }

  const rawQuery = req.originalUrl.slice(queryIndex + 1);
  try {
    return decodeURIComponent(rawQuery) === GOOGLESEO_QUERY_TOKEN;
  } catch {
    return rawQuery === GOOGLESEO_QUERY_TOKEN;
  }
}

function googleseoQueryUrl() {
  return `/?${encodeURIComponent(GOOGLESEO_QUERY_TOKEN)}`;
}

function sendGoogleseoHtml(res) {
  const html = fs
    .readFileSync(ROOT_INDEX_FILE, "utf8")
    .replace(
      /<link rel="canonical" href="[^"]*" \/>/,
      `<link rel="canonical" href="${googleseoQueryUrl()}" />`,
    );

  res.type("html").send(html);
}

function sendLandingFile(filename, noindex = true) {
  return (_req, res, next) => {
    const file = path.join(LANDING_OUT_DIR, filename);
    if (!fs.existsSync(file)) {
      return next();
    }

    if (noindex) {
      res.set("X-Robots-Tag", "noindex, follow");
    }

    res.sendFile(file);
  };
}

app.get("/", (req, res) => {
  if (isGoogleseoPage(req)) {
    return sendGoogleseoHtml(res);
  }

  if (!fs.existsSync(LANDING_INDEX_FILE)) {
    return res.status(404).send("Landing page build not found.");
  }

  res.sendFile(LANDING_INDEX_FILE);
});

app.get("/robots.txt", sendLandingFile("robots.txt", false));
app.get("/sitemap.xml", sendLandingFile("sitemap.xml", false));
app.get(["/browse", "/browse.html"], sendLandingFile("browse.html"));
app.get(["/sites", "/sites.html"], sendLandingFile("sites.html"));
app.get(["/media", "/media.html"], sendLandingFile("media.html"));

app.get("/admin", (_req, res) => {
  res.sendFile(path.join(__dirname, "admin", "index.html"));
});

app.listen(PORT, HOST, () => {
  const displayHost = HOST === "0.0.0.0" ? "127.0.0.1" : HOST;
  const baseUrl = `http://${displayHost}:${PORT}`;
  console.log(`Server running at ${baseUrl}`);
  console.log(`Googleseo page: ${baseUrl}${googleseoQueryUrl()}`);
  console.log(`Admin panel: ${baseUrl}/admin`);
});

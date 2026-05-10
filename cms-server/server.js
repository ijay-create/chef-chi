import express from "express";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

dotenv.config();

/* =========================
   SETUP
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

/* =========================
   FILE PATHS
========================= */
const FILE = path.join(__dirname, "content.json");
const USERS_FILE = path.join(__dirname, "users.json");
const LOGS_FILE = path.join(__dirname, "logs.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

/* =========================
   SAFE INIT
========================= */
const ensureFile = (file, data) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
};

/* CONTENT */
ensureFile(FILE, {
  hero: { title: "", subtitle: "" },
  about: { headline: "", text: "" },
  menu: [],
  gallery: [],
  services: [],
});

/* USERS (ROLE SYSTEM ) */
ensureFile(USERS_FILE, [
  {
    id: 1,
    email: "admin@cms.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "super_admin",
  },
]);

/* LOGS (NEW ) */
ensureFile(LOGS_FILE, []);

/* UPLOAD DIR */
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

app.use("/uploads", express.static(UPLOAD_DIR));

/* =========================
   HELPERS
========================= */
const logAction = (user, action) => {
  const logs = JSON.parse(fs.readFileSync(LOGS_FILE));
  logs.push({
    user: user?.email,
    role: user?.role,
    action,
    time: new Date().toISOString(),
  });

  fs.writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
};

/* =========================
   AUTH MIDDLEWARE 
========================= */
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

/* =========================
   HEALTH
========================= */
app.get("/", (req, res) => {
  res.send("CMS v4 Running (PRO MODE)");
});

/* =========================
   GET CONTENT
========================= */
app.get("/api/content", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

/* =========================
   UPDATE CONTENT + LOGGING 
========================= */
app.post("/api/content", auth, (req, res) => {
  try {
    const existing = JSON.parse(fs.readFileSync(FILE));
    const updated = { ...existing, ...req.body };

    fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));

    logAction(req.user, "UPDATED CONTENT");

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ error: "Save failed" });
  }
});

/* =========================
   USERS LOGIN
========================= */
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const users = JSON.parse(fs.readFileSync(USERS_FILE));
    const user = users.find((u) => u.email === email);

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const match = bcrypt.compareSync(password, user.password);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    logAction(user, "LOGIN");

    res.json({ token, user });
  } catch {
    res.status(500).json({ error: "Login error" });
  }
});

/* =========================
   UPLOAD (SAFE)
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });

app.post("/api/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file" });

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  logAction(req.user, "UPLOAD IMAGE");

  res.json({ success: true, url });
});

/* =========================
   ANALYTICS DASHBOARD 
========================= */
app.get("/api/analytics", auth, (req, res) => {
  const logs = JSON.parse(fs.readFileSync(LOGS_FILE));

  const totalUploads = logs.filter((l) =>
    l.action.includes("UPLOAD")
  ).length;

  const logins = logs.filter((l) =>
    l.action === "LOGIN"
  ).length;

  const updates = logs.filter((l) =>
    l.action.includes("UPDATED")
  ).length;

  res.json({
    users: logins,
    uploads: totalUploads,
    updates,
    logs: logs.slice(-20),
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`CMS v4 running on port ${PORT}`);
});
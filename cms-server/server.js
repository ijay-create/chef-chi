import express from "express";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

/* =========================
   SETUP
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

/* =========================
   FILE PATHS
========================= */
const FILE = path.join(__dirname, "content.json");
const USERS_FILE = path.join(__dirname, "users.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

const JWT_SECRET = "cms_secret_key";

/* =========================
   INIT FILES SAFELY
========================= */
const ensureFile = (file, data) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
};

ensureFile(FILE, {
  hero: { title: "", subtitle: "" },
  about: { headline: "", text: "" },
  menu: [],
  gallery: [],
});

ensureFile(USERS_FILE, [
  {
    id: 1,
    email: "admin@cms.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
  },
]);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

/* =========================
   SERVE UPLOADS (IMPORTANT)
========================= */
app.use("/uploads", express.static(UPLOAD_DIR));

/* =========================
   MULTER UPLOAD
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),

  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${file.originalname}`;
    cb(null, unique);
  },
});

const upload = multer({ storage });

/* =========================
   TEST ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 CMS v3 Running");
});

/* =========================
   GET CONTENT
========================= */
app.get("/api/content", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to read content" });
  }
});

/* =========================
   SAVE CONTENT (SAFE MERGE)
========================= */
app.post("/api/content", (req, res) => {
  try {
    const existing = fs.existsSync(FILE)
      ? JSON.parse(fs.readFileSync(FILE, "utf-8"))
      : {};

    const updated = {
      ...existing,
      ...req.body,
    };

    fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));

    console.log("✅ CMS SAVED");

    res.json({
      success: true,
      data: updated,
    });
  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ error: "Save failed" });
  }
});

/* =========================
   UPLOAD IMAGE (FIXED URL)
========================= */
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  console.log("📸 Uploaded:", url);

  res.json({
    success: true,
    url,
  });
});

/* =========================
   LOGIN (FIXED BCRYPT CHECK)
========================= */
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

  const user = users.find((u) => u.email === email);

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const isMatch = bcrypt.compareSync(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({
    token: jwt.sign({ id: user.id, email: user.email }, JWT_SECRET),
    user,
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 CMS v3 running on http://localhost:${PORT}`);
});
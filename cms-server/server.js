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
const UPLOAD_DIR = path.join(__dirname, "uploads");

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing in environment variables");
}

/* =========================
   SAFE FILE INIT
========================= */
const ensureFile = (file, data) => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  }
};

/* CONTENT INIT */
ensureFile(FILE, {
  hero: { title: "", subtitle: "" },
  about: { headline: "", text: "" },
  menu: [],
  gallery: [],
  services: []
});

/* =========================
   USERS INIT (FIXED)
========================= */
const initUsers = () => {
  if (!fs.existsSync(USERS_FILE)) {
    const defaultUser = [
      {
        id: 1,
        email: "admin@cms.com",
        password: bcrypt.hashSync("admin123", 10),
        role: "admin"
      }
    ];

    fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUser, null, 2));
  }
};

initUsers();

/* =========================
   UPLOAD FOLDER
========================= */
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/* =========================
   STATIC FILES
========================= */
app.use("/uploads", express.static(UPLOAD_DIR));

/* =========================
   HEALTH CHECK
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
  } catch {
    res.status(500).json({ error: "Failed to read content" });
  }
});

/* =========================
   UPDATE CONTENT
========================= */
app.post("/api/content", (req, res) => {
  try {
    const existing = JSON.parse(fs.readFileSync(FILE, "utf-8"));

    const updated = { ...existing, ...req.body };

    fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));

    res.json({ success: true, data: updated });
  } catch {
    res.status(500).json({ error: "Save failed" });
  }
});

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

/* =========================
   UPLOAD IMAGE
========================= */
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({ success: true, url });
});

/* =========================
   LOGIN
========================= */
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;

    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));

    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user });

  } catch {
    res.status(500).json({ error: "Login server error" });
  }
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 CMS v3 running on port ${PORT}`);
});
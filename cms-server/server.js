import express from "express";
import cors from "cors";
import fs from "fs";
import multer from "multer";
import path from "path";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

const FILE = path.join(__dirname, "content.json");
const USERS_FILE = path.join(__dirname, "users.json");
const UPLOAD_DIR = path.join(__dirname, "uploads");

const JWT_SECRET = "cms_secret_key";

/* =========================
   INIT FILES
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
  gallery: []
});

ensureFile(USERS_FILE, [
  {
    id: 1,
    email: "admin@cms.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin"
  }
]);

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

/* =========================
   STATIC FILES (CRITICAL FIX)
========================= */
app.use("/uploads", express.static(UPLOAD_DIR));

/* =========================
   BASE ROUTE
========================= */
app.get("/", (req, res) => {
  res.send("🚀 CMS v3 Running");
});

/* =========================
   GET CONTENT
========================= */
app.get("/api/content", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE, "utf-8"));
  res.json(data);
});

/* =========================
   SAVE CONTENT
========================= */
app.post("/api/content", (req, res) => {
  const existing = JSON.parse(fs.readFileSync(FILE, "utf-8"));

  const updated = {
    ...existing,
    ...req.body
  };

  fs.writeFileSync(FILE, JSON.stringify(updated, null, 2));

  res.json({ success: true, data: updated });
});

/* =========================
   UPLOAD IMAGE (FIXED URL)
========================= */
app.post("/api/upload", multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOAD_DIR),
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  })
}).single("image"), (req, res) => {

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  const url = `${baseUrl}/uploads/${req.file.filename}`;

  res.json({
    success: true,
    url
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`🚀 CMS v3 running on port ${PORT}`);
});
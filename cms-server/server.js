import express from "express";
import cors from "cors";
import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import multer from "multer";
import cloudinary from "cloudinary";
import streamifier from "streamifier";

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
   CLOUDINARY CONFIG 
========================= */
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* =========================
   FILE PATHS
========================= */
const FILE = path.join(__dirname, "content.json");
const USERS_FILE = path.join(__dirname, "users.json");
const LOGS_FILE = path.join(__dirname, "logs.json");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing");

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
  gallery: [],
  services: [],
});

ensureFile(USERS_FILE, [
  {
    id: 1,
    email: "admin@cms.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "super_admin",
  },
]);

ensureFile(LOGS_FILE, []);

/* =========================
   LOG SYSTEM 
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

  if (!token) return res.status(401).json({ error: "No token" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
};

/* =========================
   HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.send("CMS v4 PRO RUNNING");
});

/* =========================
   GET CONTENT
========================= */
app.get("/api/content", (req, res) => {
  const data = JSON.parse(fs.readFileSync(FILE));
  res.json(data);
});

/* =========================
   UPDATE CONTENT
========================= */
app.post("/api/content", auth, requireRole("super_admin"), (req, res) => {
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
   LOGIN
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
   CLOUDINARY UPLOAD
========================= */
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "chef-chi",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();

    logAction(req.user, "UPLOAD IMAGE");

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.delete("/api/upload/:public_id", auth, async (req, res) => {
  try {
    const { public_id } = req.params;

    const result = await cloudinary.v2.uploader.destroy(public_id);
    if (result.result !== "ok") {
      return res.status(500).json({ error: "Delete failed" });
    }

    logAction(req.user, "DELETE IMAGE");

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* =========================
   ANALYTICS DASHBOARD 
========================= */
app.get("/api/analytics", auth, (req, res) => {
  const logs = JSON.parse(fs.readFileSync(LOGS_FILE));

  const uploads = logs.filter((l) =>
    l.action.includes("UPLOAD")
  ).length;

  const logins = logs.filter((l) =>
    l.action === "LOGIN"
  ).length;

  const updates = logs.filter((l) =>
    l.action.includes("UPDATED")
  ).length;

  res.json({
    uploads,
    logins,
    updates,
    logs: logs.slice(-20),
  });
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`CMS v4 PRO running on port ${PORT}`);
});
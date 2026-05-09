import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { getContent, updateContent } from "../api/cms";
import "../styles/dashboard.css";

const DEFAULT_CONTENT = {
  hero: { title: "", subtitle: "" },
  about: { headline: "", text: "" },
  menu: [],
  gallery: [],
  services: [],
};

const Dashboard = () => {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  const navigate = useNavigate();

  /* =========================
     AUTH GUARD + AUTO LOGOUT
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("cms-token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded?.exp) {
        throw new Error("Invalid token");
      }

      const timeout = decoded.exp * 1000 - Date.now();

      // already expired
      if (timeout <= 0) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      const timer = setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, timeout);

      return () => clearTimeout(timer);

    } catch (err) {
      console.error("Auth error:", err);
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  /* =========================
     LOAD CMS
  ========================= */
  const loadCMS = async () => {
    setLoading(true);

    try {
      const data = await getContent();

      setContent({
        ...DEFAULT_CONTENT,
        ...data,
      });

      setDirty(false);
    } catch (err) {
      console.error("CMS load error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadCMS();
  }, []);

  /* =========================
     SAVE CMS
  ========================= */
  const saveCMS = async () => {
    setSaving(true);

    try {
      await updateContent(content);
      await loadCMS();
    } catch (err) {
      console.error("Save error:", err);
    }

    setSaving(false);
  };

  const markDirty = () => setDirty(true);

  /* =========================
     HERO
  ========================= */
  const updateHero = (field, value) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
    markDirty();
  };

  /* =========================
     ABOUT
  ========================= */
  const updateAbout = (field, value) => {
    setContent((prev) => ({
      ...prev,
      about: { ...prev.about, [field]: value },
    }));
    markDirty();
  };

  /* =========================
     MENU
  ========================= */
  const addMenuItem = () => {
    setContent((prev) => ({
      ...prev,
      menu: [...prev.menu, { name: "", category: "", desc: "" }],
    }));
    markDirty();
  };

  const updateMenuItem = (i, field, value) => {
    const updated = [...content.menu];
    updated[i][field] = value;

    setContent((prev) => ({ ...prev, menu: updated }));
    markDirty();
  };

  const removeMenuItem = (i) => {
    setContent((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, index) => index !== i),
    }));
    markDirty();
  };

  /* =========================
     GALLERY
  ========================= */
  const addGalleryItem = () => {
    setContent((prev) => ({
      ...prev,
      gallery: [...prev.gallery, { src: "", title: "", category: "" }],
    }));
    markDirty();
  };

  const updateGalleryItem = (i, field, value) => {
    const updated = [...content.gallery];
    updated[i][field] = value;

    setContent((prev) => ({ ...prev, gallery: updated }));
    markDirty();
  };

  const removeGalleryItem = (i) => {
    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, index) => index !== i),
    }));
    markDirty();
  };

  /* =========================
     IMAGE UPLOAD
  ========================= */
  const uploadImage = async (file, index) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      updateGalleryItem(index, "src", data.url);
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) return <h2>Loading CMS...</h2>;

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>Chef-Chi DASHBOARD</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={loadCMS}>🔄 Refresh</button>

          <button
            onClick={saveCMS}
            disabled={!dirty || saving}
            style={{
              background: dirty ? "green" : "gray",
              color: "white",
            }}
          >
            {saving ? "Saving..." : "💾 Save Changes"}
          </button>
        </div>
      </div>

      {dirty && <p style={{ color: "orange" }}>⚠ Unsaved changes</p>}

      {/* HERO */}
      <section>
        <h2>Hero</h2>

        <input
          placeholder="Title"
          value={content.hero.title}
          onChange={(e) => updateHero("title", e.target.value)}
        />

        <input
          placeholder="Subtitle"
          value={content.hero.subtitle}
          onChange={(e) => updateHero("subtitle", e.target.value)}
        />
      </section>

      {/* ABOUT */}
      <section>
        <h2>About</h2>

        <input
          placeholder="Headline"
          value={content.about.headline}
          onChange={(e) => updateAbout("headline", e.target.value)}
        />

        <textarea
          placeholder="Text"
          value={content.about.text}
          onChange={(e) => updateAbout("text", e.target.value)}
        />
      </section>

      {/* MENU */}
      <section>
        <h2>Menu</h2>

        {content.menu.map((item, i) => (
          <div key={i} className="card">

            <input
              placeholder="Name"
              value={item.name}
              onChange={(e) => updateMenuItem(i, "name", e.target.value)}
            />

            <input
              placeholder="Category"
              value={item.category}
              onChange={(e) => updateMenuItem(i, "category", e.target.value)}
            />

            <textarea
              placeholder="Desc"
              value={item.desc}
              onChange={(e) => updateMenuItem(i, "desc", e.target.value)}
            />

            <button onClick={() => removeMenuItem(i)}>Delete</button>

          </div>
        ))}

        <button onClick={addMenuItem}>+ Add Menu</button>
      </section>

      {/* GALLERY */}
      <section>
        <h2>Gallery</h2>

        {content.gallery.map((item, i) => (
          <div key={i} className="card">

            <input
              type="file"
              onChange={(e) => uploadImage(e.target.files[0], i)}
            />

            <input
              placeholder="Title"
              value={item.title}
              onChange={(e) => updateGalleryItem(i, "title", e.target.value)}
            />

            <input
              placeholder="Category"
              value={item.category}
              onChange={(e) => updateGalleryItem(i, "category", e.target.value)}
            />

            {item.src && <img src={item.src} width="120" />}

            <button onClick={() => removeGalleryItem(i)}>Delete</button>

          </div>
        ))}

        <button onClick={addGalleryItem}>+ Add Image</button>
      </section>

    </div>
  );
};

export default Dashboard;
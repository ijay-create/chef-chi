import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import ImageUploader from "../components/ImageUploader";
import { getContent, updateContent } from "../api/cms";
import "../styles/dashboard.css";

const BASE_URL = import.meta.env.VITE_API_URL;

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
     AUTH GUARD
  ========================= */
  useEffect(() => {
    const token = localStorage.getItem("cms-token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const decoded = jwtDecode(token);

      if (!decoded?.exp) {
        throw new Error("Invalid token");
      }

      const timeout = decoded.exp * 1000 - Date.now();

      if (timeout <= 0) {
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      const timer = setTimeout(() => {
        localStorage.clear();
        navigate("/login", { replace: true });
      }, timeout);

      return () => clearTimeout(timer);

    } catch (err) {
      console.error(err);

      localStorage.clear();

      navigate("/login", { replace: true });
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
      hero: {
        ...prev.hero,
        [field]: value,
      },
    }));

    markDirty();
  };

  /* =========================
     ABOUT
  ========================= */
  const updateAbout = (field, value) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value,
      },
    }));

    markDirty();
  };

  /* =========================
     MENU
  ========================= */
  const addMenuItem = () => {
    setContent((prev) => ({
      ...prev,
      menu: [
        ...prev.menu,
        {
          id: crypto.randomUUID(),
          name: "",
          category: "",
          desc: "",
        },
      ],
    }));

    markDirty();
  };

  const updateMenuItem = (index, field, value) => {
    setContent((prev) => {
      const updated = [...prev.menu];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        menu: updated,
      };
    });

    markDirty();
  };

  const removeMenuItem = (index) => {
    setContent((prev) => ({
      ...prev,
      menu: prev.menu.filter((_, i) => i !== index),
    }));

    markDirty();
  };

  /* =========================
     GALLERY
  ========================= */
  const addGalleryItem = () => {
    setContent((prev) => ({
      ...prev,
      gallery: [
        ...prev.gallery,
        {
          id: crypto.randomUUID(),
          src: "",
          title: "",
          category: "",
          public_id: "",
        },
      ],
    }));

    markDirty();
  };

  const updateGalleryItem = (index, field, value) => {
    setContent((prev) => {
      const updated = [...prev.gallery];

      updated[index] = {
        ...updated[index],
        [field]: value,
      };

      return {
        ...prev,
        gallery: updated,
      };
    });

    markDirty();
  };

  const deleteCloudinaryImage = async (public_id) => {
    try {
      const token = localStorage.getItem("cms-token");

      await fetch(
        `${BASE_URL}/api/upload/${encodeURIComponent(public_id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

    } catch (err) {
      console.error("Cloudinary delete failed:", err);
    }
  };

  const removeGalleryItem = async (index) => {
    const item = content.gallery[index];

    if (item?.public_id) {
      await deleteCloudinaryImage(item.public_id);
    }

    setContent((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));

    markDirty();
  };

  /* =========================
     CLOUDINARY UPLOAD
  ========================= */
  const uploadImage = async (file, index) => {
    if (!file) return;

    try {
      const token = localStorage.getItem("cms-token");

      const formData = new FormData();

      formData.append("image", file);

      setContent((prev) => {
        const updated = [...prev.gallery];

        updated[index] = {
          ...updated[index],
          uploading: true,
        };

        return {
          ...prev,
          gallery: updated,
        };
      });

      const res = await fetch(`${BASE_URL}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      setContent((prev) => {
        const updated = [...prev.gallery];

        updated[index] = {
          ...updated[index],
          src: data.url,
          public_id: data.public_id,
          uploading: false,
        };

        return {
          ...prev,
          gallery: updated,
        };
      });

      markDirty();

    } catch (err) {
      console.error("Upload error:", err);

      alert("Image upload failed");
    }
  };

  /* =========================
     UI
  ========================= */
  if (loading) {
    return <h2>Loading CMS...</h2>;
  }

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">

        <h1>Chef-Chi Dashboard</h1>

        <div style={{ display: "flex", gap: "10px" }}>

          <button onClick={loadCMS}>
            🔄 Refresh
          </button>

          <button
            onClick={saveCMS}
            disabled={!dirty || saving}
            style={{
              background: dirty ? "green" : "gray",
              color: "white",
            }}
          >
            {saving ? "Saving..." : "💾 Save"}
          </button>

        </div>

      </div>

      {dirty && (
        <p style={{ color: "orange" }}>
          ⚠ Unsaved changes
        </p>
      )}

      {/* HERO */}
      <section>

        <h2>Hero</h2>

        <input
          placeholder="Title"
          value={content.hero.title}
          onChange={(e) =>
            updateHero("title", e.target.value)
          }
        />

        <input
          placeholder="Subtitle"
          value={content.hero.subtitle}
          onChange={(e) =>
            updateHero("subtitle", e.target.value)
          }
        />

      </section>

      {/* ABOUT */}
      <section>

        <h2>About</h2>

        <input
          placeholder="Headline"
          value={content.about.headline}
          onChange={(e) =>
            updateAbout("headline", e.target.value)
          }
        />

        <textarea
          placeholder="Text"
          value={content.about.text}
          onChange={(e) =>
            updateAbout("text", e.target.value)
          }
        />

      </section>

      {/* MENU */}
      <section>

        <h2>Menu</h2>

        {content.menu.map((item, i) => (
          <div
            key={item.id || i}
            className="card"
          >

            <input
              placeholder="Name"
              value={item.name}
              onChange={(e) =>
                updateMenuItem(i, "name", e.target.value)
              }
            />

            <input
              placeholder="Category"
              value={item.category}
              onChange={(e) =>
                updateMenuItem(i, "category", e.target.value)
              }
            />

            <textarea
              placeholder="Description"
              value={item.desc}
              onChange={(e) =>
                updateMenuItem(i, "desc", e.target.value)
              }
            />

            <button onClick={() => removeMenuItem(i)}>
              Delete
            </button>

          </div>
        ))}

        <button onClick={addMenuItem}>
          + Add Menu
        </button>

      </section>

      {/* GALLERY */}
      <section>

        <h2>Gallery</h2>

        {content.gallery.map((item, i) => (
          <div
            key={item.id || i}
            className="card"
          >

            <ImageUploader
              onUpload={(file) =>
                uploadImage(file, i)
              }
            />

            {item.uploading && (
              <p>Uploading...</p>
            )}

            <input
              placeholder="Title"
              value={item.title}
              onChange={(e) =>
                updateGalleryItem(i, "title", e.target.value)
              }
            />

            <input
              placeholder="Category"
              value={item.category}
              onChange={(e) =>
                updateGalleryItem(i, "category", e.target.value)
              }
            />

            {item.src && (
              <img
                src={item.src}
                alt={item.title || "gallery"}
                width="140"
              />
            )}

            <button
              onClick={() => removeGalleryItem(i)}
            >
              Delete
            </button>

          </div>
        ))}

        <button onClick={addGalleryItem}>
          + Add Image
        </button>

      </section>

    </div>
  );
};

export default Dashboard;
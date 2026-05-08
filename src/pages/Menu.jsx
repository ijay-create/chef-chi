import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "../styles/menu.css";
import heroImg from "../assets/images/menuhero.jpg";
import { getContent } from "../api/cms";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD CMS
  ========================= */
  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getContent();

        if (data?.menu && Array.isArray(data.menu)) {
          setMenuItems(data.menu);
        } else {
          setMenuItems([]);
        }

      } catch (err) {
        console.error("❌ Menu load error:", err);
        setMenuItems([]);
      }

      setLoading(false);
    };

    loadMenu();
  }, []);

  /* =========================
     FILTER MENU
  ========================= */
  const filtered =
    filter === "all"
      ? menuItems
      : menuItems.filter(
          (item) =>
            item?.category?.toLowerCase().trim() ===
            filter.toLowerCase().trim()
        );

  /* =========================
     ANIMATION
  ========================= */
  const cardVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === "left" ? -100 : 100,
      scale: 0.9,
    }),

    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  if (loading) {
    return (
      <div className="section container">
        <h2>Loading Menu...</h2>
      </div>
    );
  }

  return (
    <section className="menu-page">

      {/* HERO */}
      <section
        className="menu-hero"
        style={{
          backgroundImage: `url(${heroImg})`,
        }}
      >
        <div className="menu-overlay">

          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Chef-Chi Signature Cuisine
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Our Luxury Menu
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            Crafted with premium ingredients,
            elegance, and unforgettable flavours.
          </motion.p>

        </div>
      </section>

      {/* FILTERS */}
      <section className="section container">
        <div className="menu-filters">

          {[
            "all",
            "starter",
            "main",
            "dessert",
            "drink",
            "swallows & soups",
          ].map((cat) => (
            <button
              key={cat}
              className={filter === cat ? "active" : ""}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}

        </div>
      </section>

      {/* MENU GRID */}
      <section className="section container">

        <div className="menu-grid">

          {filtered.length > 0 ? (
            filtered.map((item, index) => {
              const direction =
                index % 2 === 0 ? "left" : "right";

              return (
                <motion.div
                  key={index}
                  className="menu-card"
                  variants={cardVariants}
                  custom={direction}
                  initial="hidden"
                  whileInView="show"
                  viewport={{
                    once: false,
                    amount: 0.2,
                  }}
                >
                  <div className="menu-top">
                    <h3>{item?.name || "Untitled Dish"}</h3>

                    <span>
                      {item?.category || "Menu"}
                    </span>
                  </div>

                  <div className="menu-line"></div>

                  <p>
                    {item?.desc ||
                      "No description available."}
                  </p>

                </motion.div>
              );
            })
          ) : (
            <h3>No menu items found.</h3>
          )}

        </div>

      </section>

    </section>
  );
};

export default Menu;
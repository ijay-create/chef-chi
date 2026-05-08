import { useState } from "react";
import { motion } from "framer-motion";
import "../styles/contact.css";

const Contact = () => {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    event_type: "",
    event_date: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const text = `
*NEW CATERING BOOKING REQUEST*

👤 Name: ${form.name}
📧 Email: ${form.email}
📞 Phone: ${form.phone}

🎉 Event: ${form.event_type}
📅 Date: ${form.event_date}

📝 Details:
${form.message}
    `;

    const encodedText = encodeURIComponent(text);
    const phoneNumber = "352691221064";

    window.open(
      `https://wa.me/${phoneNumber}?text=${encodedText}`,
      "_blank"
    );

    setForm({
      name: "",
      email: "",
      phone: "",
      event_type: "",
      event_date: "",
      message: "",
    });

    setLoading(false);
  };

  // 🔥 CINEMATIC VARIANTS (shared system)
  const cardVariants = {
    hidden: (direction) => ({
      opacity: 0,
      x: direction === "left" ? -140 : 140,
      scale: 0.85,
      filter: "blur(8px)",
    }),

    show: {
      opacity: 1,
      x: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="contact-section section">

      <div className="container contact-wrapper">

        {/* LEFT INFO */}
        <motion.div
          className="contact-info"
          variants={cardVariants}
          custom="left"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >
          <span className="tag">Book Your Event</span>

          <h2>Let’s Create an Unforgettable Experience</h2>

          <p>
            Tell us about your event and we’ll design a bespoke
            catering experience tailored to your needs.
          </p>

          <div className="contact-details">
            <p>📍 Luxembourg City</p>
            <p>📞 +352 691 221 064</p>
            <p>📧 chef.chi.cateringservice@gmail.com</p>
          </div>

          <a
            className="whatsapp-btn"
            href="https://wa.me/352691221064"
            target="_blank"
            rel="noreferrer"
          >
            Chat on WhatsApp
          </a>
        </motion.div>

        {/* FORM */}
        <motion.form
          className="contact-form"
          onSubmit={handleSubmit}
          variants={cardVariants}
          custom="right"
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.3 }}
        >

          <div className="form-grid">

            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />

            <select
              name="event_type"
              value={form.event_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Event Type</option>
              <option value="Wedding">Wedding</option>
              <option value="Corporate">Corporate Event</option>
              <option value="Private Dining">Private Dining</option>
              <option value="Outdoor">Outdoor Event</option>
            </select>

            <input
              name="event_date"
              type="date"
              value={form.event_date}
              onChange={handleChange}
            />

          </div>

          <textarea
            name="message"
            placeholder="Tell us about your event..."
            value={form.message}
            onChange={handleChange}
            rows="5"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Opening WhatsApp..." : "Send via WhatsApp"}
          </button>

        </motion.form>

      </div>

    </section>
  );
};

export default Contact;
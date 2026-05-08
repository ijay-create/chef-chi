import { useState } from "react";
import "../styles/footer.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

import {
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineEnvironment,
} from "react-icons/ai";

import {
  SiInstagram,
  SiFacebook,
  SiWhatsapp,
} from "react-icons/si";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (!email) return alert("Please enter your email");

    // 🔥 FORMAT MESSAGE
    const text = `Hello 👋, I would like to subscribe to Chef-Chi Catering updates.\n\n📧 Email: ${email}`;

    const encodedText = encodeURIComponent(text);

    // ⚡ YOUR NUMBER (no +)
    const phoneNumber = "352691221064";

    // 🚀 OPEN WHATSAPP
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");

    // reset
    setEmail("");
  };

  return (
    <footer className="footer">

      <div className="container footer-grid">

        {/* BRAND */}
        <div className="footer-brand">

          <img src={logo} alt="Chef-Chi Logo" className="footer-logo" />

          <p>
            Luxury catering experiences crafted with precision for weddings,
            corporate events, and elite private dining across Luxembourg.
          </p>

          {/* 🔥 NEWSLETTER */}
          <div className="newsletter">
            <h5>Join Our Experience List</h5>

            <div className="newsletter-box">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button onClick={handleSubscribe}>
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* NAVIGATION */}
        <div className="footer-column">
          <h4>Navigation</h4>

          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/gallery">Gallery</Link>
          <Link to="/contact">Contact</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-column">
          <h4>Contact</h4>

          <p><AiOutlineEnvironment /> Luxembourg City</p>
          <p><AiOutlinePhone /> +352 691 221 064</p>
          <p><AiOutlineMail /> chef.chi.cateringservice@gmail.com</p>

          <span className="availability">
            Available for bookings worldwide
          </span>
        </div>

        {/* SOCIAL */}
        <div className="footer-column">
          <h4>Follow Us</h4>

          <div className="socials">
            <a
              href="https://instagram.com/chef.chi.catering.service" // ← change to your real username
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <SiInstagram />
           </a>

            <a href="https://wa.me/352691221064" target="_blank" rel="noreferrer">
              <SiWhatsapp />
            </a>

          </div>

          <p className="social-text">
            Stay connected with our latest luxury events.
          </p>

        </div>

      </div>

      <div className="footer-bottom">
        <p>© 2026 Chef-Chi Catering Service Luxembourg. All rights reserved.</p>
      </div>

    </footer>
  );
};

export default Footer;
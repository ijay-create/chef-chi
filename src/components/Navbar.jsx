import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import "../styles/navbar.css";
import logo from "../assets/logo.png";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setOpen(false);

  /* SCROLL EFFECT */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container nav-inner">

        {/* LOGO */}
        <Link to="/" className="logo" onClick={closeMenu}>
          <img src={logo} alt="Chef-Chi" />

          <span>
            Chef-Chi Catering Service <br />
            Luxembourg
          </span>
        </Link>

        {/* NAV LINKS */}
        <nav className={`nav-links ${open ? "active" : ""}`}>
          <NavLink to="/about" onClick={closeMenu}>
            About
          </NavLink>

          <NavLink to="/services" onClick={closeMenu}>
            Services
          </NavLink>

          <NavLink to="/menu" onClick={closeMenu}>
            Menu
          </NavLink>

          <NavLink to="/gallery" onClick={closeMenu}>
            Gallery
          </NavLink>

          <NavLink to="/contact" onClick={closeMenu}>
            Contact
          </NavLink>

          <Link
            to="/admin"
            className="admin-btn"
            onClick={closeMenu}
          >
            Admin Login
          </Link>
        </nav>

        {/* MOBILE MENU ICON */}
        <div
          className="menu-icon"
          onClick={() => setOpen(!open)}
        >
          {open ? <AiOutlineClose /> : <AiOutlineMenu />}
        </div>
      </div>

      {/* BACKDROP */}
      {open && (
        <div
          className="overlay"
          onClick={closeMenu}
        ></div>
      )}
    </header>
  );
};

export default Navbar;
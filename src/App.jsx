import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import WhatsAppFloat from "./components/WhatsAppFloat";

import ScrollToTopOnRoute from "./components/ScrollToTopOnRoute";
import SmoothScroll from "./components/SmoothScroll";

import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Menu from "./pages/Menu";
import Login from "./pages/auth/Login";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";

import Dashboard from "./pages/Dashboard";

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        {/* =========================
            ADMIN ROUTES (PROTECTED)
        ========================= */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* ROLE-SPECIFIC ROUTES (READY FOR FUTURE EXPANSION) */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/editor"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* LEGACY REDIRECT */}
        <Route
          path="/dashboard"
          element={<Navigate to="/admin" replace />}
        />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <>
      <ScrollToTopOnRoute />
      <SmoothScroll />

      <Navbar />
      <AnimatedRoutes />
      <Footer />

      <WhatsAppFloat />
    </>
  );
};

export default App;
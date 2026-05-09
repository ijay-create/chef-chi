import { jwtDecode } from "jwt-decode";

/* =========================
   GET CURRENT USER FROM TOKEN
========================= */
export const getUser = () => {
  const token = localStorage.getItem("cms-token"); // 👈 match your login key

  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};
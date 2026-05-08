import { FaWhatsapp } from "react-icons/fa";
import "../styles/whatsapp.css";

const WhatsAppFloat = () => {
  return (
    <a
        href="https://wa.me/+352691221064?text=Hello%20Chef-Chi%20I%20want%20to%20book%20an%20event"
        className="whatsapp-float"
        target="_blank"
        rel="noopener noreferrer"
    >
        
      <FaWhatsapp />
   </a>
  );
};

export default WhatsAppFloat;
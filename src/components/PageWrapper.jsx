import { motion } from "framer-motion";

const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    filter: "blur(10px)",
  },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    filter: "blur(10px)",
    transition: {
      duration: 0.4,
    },
  },
};

const PageWrapper = ({ children }) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
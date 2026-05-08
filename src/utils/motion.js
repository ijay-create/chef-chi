export const luxuryVariant = {
  hidden: (dir) => ({
    opacity: 0,
    x: dir === "left" ? -140 : 140,
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
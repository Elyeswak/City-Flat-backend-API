import React, { useEffect } from "react";
import "./StandardCoverPage.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";

function StandardCoverPage() {
  const { ref, inView } = useInView();
  const animation = useAnimation();
  useEffect(() => {
    if (inView) {
      animation.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.7 },
      });
    } else {
      animation.start({ x: -100, opacity: 0 });
    }
  }, [animation, inView]);

  return (
    <div className="standard__cover__page">
      <motion.div
        className="standard_cover_page_title"
        ref={ref}
        initial={{ x: -150, opacity: 0 }}
        animate={animation}
      >
        <h1>STANDARD</h1>
      </motion.div>
    </div>
  );
}

export default StandardCoverPage;

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import i18n from "./../../../i18next";
import { useTranslation } from "react-i18next";
import "./luxuryCoverPage.css";

function LuxuryCoverPage() {
  /**LANGUAGE SETTINGS */
  const { t } = useTranslation();
  /**MOTION ANIMATION */
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
    <div className="luxury__cover__page">
      <motion.div
        className="luxury_cover_page_title"
        ref={ref}
        initial={{ x: -150, opacity: 0 }}
        animate={animation}
      >
        <h1
          className={`${
            i18n.language === "de"
              ? "luxury_cover_page_title_german"
              : "luxury_cover_page_title"
          }`}
        >
          {t("LUXURY")}
        </h1>
      </motion.div>
    </div>
  );
}

export default LuxuryCoverPage;

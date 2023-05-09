import React, { useEffect, useState } from "react";
import "./premium.css";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import i18n from "./../../../i18next";
import { useTranslation } from "react-i18next";


function Premium() {

  const [currentLanguage, setCurrentLanguage] = useState("en");
  const { t } = useTranslation();


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
      animation.start({ x: 100, opacity: 0 });
    }
  }, [animation, inView]);

  return (
    <div className="">
      <motion.div className="premium__page">
        <div className="">
          <div className="title">
            <p className="title__premium">{t("PREMIUM")}</p>
          </div>
          <div className="line-in-middle"></div>
          <div className="premium__content">
            <div className="description__image">
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                whileInView={{ opacity: [0, 1] }}
                transition={{ duration: 0.7 }}
                src="https://c4.wallpaperflare.com/wallpaper/396/394/415/city-apartment-design-wallpaper-preview.jpg"
                alt="description"
              />
            </div>
            <div className="premium__description">
              <div className="side__line"></div>

              <motion.div
                className="description__content"
                ref={ref}
                initial={{ x: -100, opacity: 0 }}
                animate={animation}
              >
                <div className="description__title">
                  <p>{t("OUR PREMIUM COLLECTION")}</p>
                </div>

                <div className="description__text">
                  <p>
                    Our premium apartments feature modern appliances, tasteful
                    furnishings, and convenient access to local attractions and
                    entertainment. These apartments offer an exceptional level
                    of comfort and style, with a range of high-quality amenities
                    to elevate your stay.
                    <br />
                    <br />
                    Whether you're traveling for work or leisure, our premium
                    apartments offer an exceptional experience that is sure to
                    exceed your expectations.
                  </p>
                </div>

                <a href="/premium">
                  <button className="btn btn-outline-warning discover__button">
                  {t("DISCOVER MORE")}
                  </button>
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Premium;

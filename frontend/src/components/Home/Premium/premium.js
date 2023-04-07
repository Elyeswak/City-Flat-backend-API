import React from "react";
import "./premium.css";
import { motion } from "framer-motion";

function premium() {
  return (
    <div className="">
      <div className="premium__page">
        <div className="">
          <div className="title">
            <p className="title__premium">PREMIUM</p>
          </div>
          <div className="line-in-middle"></div>
          <div className="premium__content">
            <div className="description__image">
              <motion.img
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.8 }}
                whileInView={{ opacity: [0, 1] }}
                transition={{ duration: 0.7 }}
                src="./bailey-alexander-pkIJXMezi_E-unsplash 1.png"
                alt="description"
              />
            </div>
            <div className="premium__description">
              <div className="side__line"></div>

              <div className="description__content">
                <div className="description__title">
                  <p>OUR PREMIUM COLLECTION</p>
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
                    DISCOVER MORE
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default premium;

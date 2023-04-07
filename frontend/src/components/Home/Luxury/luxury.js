import React from "react";
import "./luxury.css";
import { motion } from "framer-motion";

function luxury() {
  return (
    <div className="">
      <div className="luxury__page">
        <div className="">
          <div className="title">
            <p className="title__luxury">LUXURY</p>
          </div>
          <div className="line-in-middle"></div>
          <div className="luxury__content">
            <div className="luxury__description">
              <div className="side__line"></div>

              <div className="description__content">
                <div className="description__title">
                  <p>OUR LUXURIOUS COLLECTION</p>
                </div>

                <div className="description__text">
                  <p>
                    Our luxury apartments are designed to provide you with the
                    ultimate in comfort and style, featuring high-end finishes,
                    top-of-the-line appliances, and world-class amenities. Our
                    luxury apartments are the perfect choice for discerning
                    travelers who demand the very best.
                    <br /> <br />
                    Whether you're traveling for business or pleasure, our
                    luxury apartments offer a truly unforgettable experience
                    that will leave you feeling pampered and indulged.
                  </p>
                </div>
                <a href="/luxury">
                  <button className="btn btn-outline-warning discover__button">
                    DISCOVER MORE
                  </button>
                </a>
              </div>
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default luxury;

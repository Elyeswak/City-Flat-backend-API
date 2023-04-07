import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Rate from "../../Rate/Rate";
import { motion } from "framer-motion";
import "./PremiumCollection.css";

function PremiumCollection() {
  const [rating2, setRating2] = useState(0);
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/appartments/getAllAppart")
      .then((result) => {
        setApartments(result.data);
        console.log();
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <section className="premium__collection__page">
      <motion.div
        whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <div className="premium_collection_items_title">
          <h2>OUR PREMIUM COLLECTION</h2>
          <div className="line-in-middle"></div>
        </div>
        <div className="premium_collection_items_content">
          <div className="premium_collection_content">
            <div className="row">
              {apartments.map((data) => {
                if (data.type === "PREMIUM") {
                  return (
                    <div className="col-sm-6" key={data.id}>
                      {" "}
                      <div className="card">
                        <div className="card_img">
                          <Link to={`/details/${data.id}`}>
                            <motion.img
                              whileHover={{ scale: 0.95 }}
                              whileTap={{ scale: 0.8 }}
                              whileInView={{ opacity: [0, 1] }}
                              transition={{ duration: 0.7 }}
                              src="./luxury-apartments.png"
                              className="card-img-top"
                              alt="..."
                            />
                          </Link>
                        </div>
                        <div className="card_body">
                          <div className="like_button">
                            <button>
                              <FontAwesomeIcon
                                icon={faHeart}
                                beat
                                className="highligh_premium"
                              />
                            </button>
                          </div>
                          <div className="card_content">
                            <h3>{data.name}</h3>
                            <p>{data.description}</p>
                            <Rate
                              rating={rating2}
                              onRating={(rate) => setRating2(rate)}
                            />
                            <strong>{data.pricePerNight}€</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default PremiumCollection;

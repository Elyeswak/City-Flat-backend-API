import React, { useState } from "react";
import Rate from "../../Rate/Rate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import './FilteringResults.css'

function FilteringResults({ filteredData }) {
  const [likedApartments, setLikedApartments] = useState([]);
  const [ratings, setRatings] = useState(Array(filteredData.length).fill(0));

  const handleLikeClick = (id) => {
    setLikedApartments((prevLikedApartments) =>
      prevLikedApartments.includes(id)
        ? prevLikedApartments.filter((prevId) => prevId !== id)
        : [...prevLikedApartments, id]
    );
  };

  const handleRatingChange = (index, rating) => {
    setRatings((prevRatings) =>
      prevRatings.map((prevRating, i) => (i === index ? rating : prevRating))
    );
  };

  if (!filteredData) {
    return (
      <>
        <strong>No data found</strong>
      </>
    );
  }

  return (
    <section className="luxury__collection__page">
      <motion.div
        whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
        transition={{ duration: 0.5 }}
      >
        <div className="luxury_collection_items_content">
          <div className="luxury_collection_content">
            <div className="row">
              {filteredData.map((data, index) => {
                const isLiked = likedApartments.includes(data.id);
                const rating = ratings[index];
                return (
                  <div className="col-sm-4" key={data.id}>
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
                        <div className="like_button_luxury">
                          <button onClick={() => handleLikeClick(data.id)}>
                            <FontAwesomeIcon
                              icon={isLiked ? faHeart : faHeartEmpty}
                              className={`heart-icon ${isLiked ? "liked" : ""}`}
                            />
                          </button>
                        </div>
                        <div className="card_content_luxury">
                          <h3>{data.name}</h3>
                          <p>{data.description}</p>
                          <Rate
                            rating={rating}
                            onRating={(rate) =>
                              handleRatingChange(index, rate)
                            }
                          />
                          <strong>{data.pricePerNight}€</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}



export default FilteringResults;

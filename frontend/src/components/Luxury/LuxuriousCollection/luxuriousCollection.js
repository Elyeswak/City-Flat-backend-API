import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import Rate from "../../Rate/Rate";
import { motion } from "framer-motion";
import i18n from "./../../../i18next";
import { useTranslation } from "react-i18next";
import "./luxuriouCollection.css";
import Loader from "../../Loader/Loader";

function LuxuriousCollection() {
  const [luxuryLoading, setLuxuryloading] = useState(true);

  const { t } = useTranslation();
  const [apartments, setApartments] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:9090/appartments/getAllAppart")
      .then((result) => {
        setApartments(
          result.data.map((apartment) => ({ ...apartment, liked: false }))
        );

        // Log the data here
        console.log(result.data);
        setLuxuryloading(false);
      })
      .catch((error) => console.log(error));
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userToken = user?.token;

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      axios
        .get(`http://localhost:9090/user/${userId}`)
        .then((response) => {
          setWishlist(response.data.wishlist);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleLikeClick = (id) => {
    if (user) {
      setApartments((prevApartments) =>
        prevApartments.map((apartment) =>
          apartment.id === id
            ? { ...apartment, liked: !apartment.liked }
            : apartment
        )
      );

      if (wishlist.includes(id)) {
        fetch(`http://localhost:9090/user/rmwishlist/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        })
          .then(() =>
            setWishlist((prevWishlist) =>
              prevWishlist.filter((item) => item !== id)
            )
          )
          .catch((error) => console.log(error));
      } else {
        fetch(`http://localhost:9090/user/wishlist/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
          },
        })
          .then(() => setWishlist((prevWishlist) => [...prevWishlist, id]))
          .catch((error) => console.log(error));
      }
    } else {
      return;
    }
  };

  return (
    <>
      {luxuryLoading ? (
        <Loader className={"percent-height"} />
      ) : (
        <section className="luxury__collection__page">
          <motion.div
            whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
            transition={{ duration: 0.5 }}
          >
            <div className="luxury_collection_items_title">
              <h2>{t("OUR LUXURIOUS COLLECTION")}</h2>
              <div className="line-in-middle"></div>
            </div>
            <div className="luxury_collection_items_content">
              <div className="luxury_collection_content">
                <div className="row">
                  {apartments.map((data) => {
                    if (data.type === "LUXURY") {
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
                                  src={data.img[0]}
                                  height={250}
                                  className="card-img-top"
                                  alt="..."
                                />
                              </Link>
                            </div>
                            <div className="card_body">
                              <div className="like_button_luxury">
                                <button
                                  onClick={() => handleLikeClick(data.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={
                                      wishlist.includes(data.id)
                                        ? faHeart
                                        : faHeartEmpty
                                    }
                                    className={`heart-icon ${
                                      wishlist.includes(data.id) ? "liked" : ""
                                    }`}
                                  />
                                </button>
                              </div>
                              <div className="card_content_luxury">
                                <h3>{data.name}</h3>
                                <p>{data.description}</p>
                                <Rate rating={data.rating} />
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
      )}
    </>
  );
}

export default LuxuriousCollection;

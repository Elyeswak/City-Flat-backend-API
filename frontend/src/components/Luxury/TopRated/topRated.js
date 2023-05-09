import React, { useEffect, useState } from "react";
import Rate from "../../Rate/Rate";
import { motion } from "framer-motion";

import axios from "axios";
import "./topRated.css";
import { Link } from "react-router-dom";
import i18n from "./../../../i18next";
import { useTranslation } from "react-i18next";

function TopRated() {
 
  const [apartments, setApartments] = useState([]);
   /**LANGUAGE SETTINGS */
   const { t } = useTranslation();

  useEffect(() => {
    axios
      .get("http://localhost:9090/appartments/getAllAppart")
      .then((result) => {
        setApartments(result.data);
        // Log the data here
        console.log(result.data);
      })
      .catch((error) => console.log(error));
  }, []);

  const filteredApartments = apartments.filter(data => data.rating === 5 && data.type === "LUXURY");

  return (
    <section className="top__rated__luxury_page">
  {filteredApartments.length > 0 && (
  <motion.div className="row row_props"
    whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
    transition={{ duration: 0.5 }}>
    <div className="col image_col">
      <img alt="" src={filteredApartments[0].img} />
    </div>
    <div className="col content_col" style={{ backgroundColor: "white" }}>
      <div className="card_infos_luxury">
        <div className="card__body_luxury">
          <h2>{t("OUR BEST APARTMENT")}</h2>
          <h4>{filteredApartments[0].name}</h4>
          <p className="apartment_description">{filteredApartments[0].description}</p>
          <Rate rating={filteredApartments[0].rating} />
          <strong>{filteredApartments[0].pricePerNight}€</strong>
        </div>
        <div className="card__button_luxury">
          <Link to={`/details/${filteredApartments[0].id}`}>
            <button type="button" className="btn btn-outline-dark" style={{fontSize: "14px", padding: "5px 10px"}}>
            {t("DISCOVER MORE")}
            </button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
)}
</section>

  );
}

export default TopRated;

import React, { useState } from 'react'
import Rate from "../../Rate/Rate";
import './TopRatedStandard.css'
import { motion } from "framer-motion";


function TopRatedStandard() {
  const [rating, setRating] = useState(0);
  return (
    <section className="top__rated__standard_page">
      <motion.div className="row row_props_standard "
       whileInView={{ y: [100, 50, 0], opacity: [0, 0, 1] }}
       transition={{ duration: 0.5 }}
      >
        <div className="col image_col_standard">
          {" "}
          <img alt="" src="./r-architecture-wDDfbanbhl8-unsplash.png" />
        </div>
        <div className="col content_col_standard" style={{ backgroundColor: "white" }}>
        <div className="card_infos_standard">
          <div className="card__body__standard">
            <h2>OUR BEST APARTEMENT</h2>
            <h4>SEBASTIAN-STAINES</h4>
            <p>Description about the house and stuff</p>
            <Rate rating={rating}  onRating={rate => setRating(rate)}/>
            <strong>120€</strong>
          </div>
          <div className="card__button_standard">
            <a href="/"><button type="button" className="btn btn-outline-dark">MORE DETAILS</button></a>
          </div>
          
  
        </div>
        </div>
      </motion.div>
    </section>
  );
}

export default TopRatedStandard
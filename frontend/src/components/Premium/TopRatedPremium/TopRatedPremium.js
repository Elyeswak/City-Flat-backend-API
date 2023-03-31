import React, { useState } from "react";
import Rate from "../../Rate/Rate";
import "./TopRatedPremium.css";

function TopRatedPremium() {
  const [rating, setRating] = useState(0);
  return (
    <section className="top__rated__premium_page">
      <div className="row row_props ">
        <div className="col image_col">
          {" "}
          <img alt="" src="./r-architecture-wDDfbanbhl8-unsplash.png" />
        </div>
        <div className="col content_col" style={{ backgroundColor: "white" }}>
        <div className="card_infos">
          <div className="card__body_luxury">
            <h2>OUR BEST APARTEMENT</h2>
            <h4>SEBASTIAN-STAINES</h4>
            <p>Description about the house and stuff</p>
            <Rate rating={rating}  onRating={rate => setRating(rate)}/>
            <strong>120€</strong>
          </div>
          <div className="card__button">
            <a href="/"><button type="button" class="btn btn-outline-dark">MORE DETAILS</button></a>
          </div>
          
  
        </div>
        </div>
      </div>
    </section>
  );
}

export default TopRatedPremium;

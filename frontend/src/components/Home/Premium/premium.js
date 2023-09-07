import React from "react";
import "./premium.css";

function premium() {
  return (
    <div className="">
      <div className="premium__page">
        <div className="">
          <div className="title">
            <p className="title__premium">Premium</p>
          </div>
          <div className="line-in-middle"></div>
          <div className="premium__content">
            <div className="description__image">
              <img
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
                    <br/>
                    <br/>
                    Whether you're traveling for work or
                    leisure, our premium apartments offer an exceptional
                    experience that is sure to exceed your expectations.
                  </p>
                </div>
                <button className="btn btn-outline-warning discover__button">
                  DISCOVER MORE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default premium;

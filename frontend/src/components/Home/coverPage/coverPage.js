import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

import "./coverPage.css";

function coverPage() {
  return (
    <div className="homepage">
      <div className="borders">
        <div className="container">
          <div className="header__cover">
            <div>
              <h1 className="title__cover">
                BOOK YOUR NEXT GETAWAY AND LET US TAKE CARE OF THE REST!
              </h1>
            </div>

            <form className="search">
              <input
                className="search__input"
                type="text"
                id="search"
                placeholder="Search"
              />
              <button className="search__filter">
                {" "}
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default coverPage;

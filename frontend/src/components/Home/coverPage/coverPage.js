import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import "./coverPage.css";

import { Range, getTrackBackground } from "react-range";

const PRICE_STEP = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 1000;

/**rooms consts */
const ROOM_STEP = 1;
const ROOM_MIN = 1;
const ROOM_MAX = 7;

function CoverPage() {
  const [openFilter, setOpenFilter] = useState(false);

  const [values, setValues] = useState([100, 900]);
  const [roomCount, setRoomCount] = useState(1);

  const handleChange = (newValues) => {
    setValues(newValues);
  };
  let menuRef = useRef();

  /*Filter useEffect*/
  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpenFilter(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  /**SEARCH BY FILTER */

  return (
    <div className="homepage">
      <div className="borders">
        <div className="container">
          <div className="header__cover">
            <div>
              <h1 className="title__cover">
                BOOK YOUR NEXT GETAWAY AND LET US <br /> TAKE CARE OF THE REST!
              </h1>
            </div>

            <form className="search">
              <input
                className="search__input"
                type="text"
                id="search"
                placeholder="Search"
              />
              <button
                className="search__filter"
                type="button"
                onClick={() => setOpenFilter(!openFilter)}
              >
                {" "}
                <FontAwesomeIcon icon={faFilter} />
              </button>
            </form>
            <div className="filter-container" ref={menuRef}>
              {openFilter && (
                <div
                  className={` flex flex-col gap-4 filter__menu ${
                    openFilter ? "active" : "inactive"
                  }`}
                >
                  <div className="filter__title">
                    <h4>Filter</h4>
                    <hr />
                  </div>
                  <div className="filter__list">
                    <div className="row row_filter price__filter">
                      <p>PRICE RANGE</p>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <Range
                          values={values}
                          step={PRICE_STEP}
                          min={MIN_PRICE}
                          max={MAX_PRICE}
                          onChange={handleChange}
                          renderTrack={({ props, children }) => (
                            <div
                              onMouseDown={props.onMouseDown}
                              onTouchStart={props.onTouchStart}
                              style={{
                                ...props.style,
                                height: "36px",
                                display: "flex",
                                width: "100%",
                              }}
                            >
                              <div
                                ref={props.ref}
                                style={{
                                  height: "5px",
                                  width: "100%",
                                  borderRadius: "4px",
                                  background: getTrackBackground({
                                    values,
                                    colors: ["#ccc", "#e8ca23", "#ccc"],
                                    min: MIN_PRICE,
                                    max: MAX_PRICE,
                                  }),
                                  alignSelf: "center",
                                }}
                              >
                                {children}
                              </div>
                            </div>
                          )}
                          renderThumb={({ props, isDragged }) => (
                            <div
                              {...props}
                              style={{
                                ...props.style,
                                height: "42px",
                                width: "42px",
                                borderRadius: "4px",
                                backgroundColor: "#FFF",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                boxShadow: "0px 2px 6px #AAA",
                              }}
                            >
                              <div
                                style={{
                                  height: "16px",
                                  width: "5px",
                                  backgroundColor: isDragged
                                    ? "#e8ca23"
                                    : "#CCC",
                                }}
                              />
                            </div>
                          )}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            width: "100%",
                          }}
                        >
                          <output>€{values[0]}</output>
                          <output>€{values[1]}</output>
                        </div>
                      </div>
                    </div>
                    <div className="row row_filter">
                      <p>TYPE</p>
                      <div className="row">
                        <div className="col">
                          <p>standard</p>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                        </div>
                        <div className="col">
                          <p>Premium</p>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                        </div>
                        <div className="col">
                          <p>Luxury</p>
                          <input
                            className="form-check-input"
                            type="radio"
                            name="flexRadioDefault"
                            id="flexRadioDefault1"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row row_filter">
                      <div className="col-sm"></div>
                      <div className="col-sm">
                        <p>ROOMS</p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            
                          }}
                        >
                          <Range
                            values={[roomCount]}
                            step={ROOM_STEP}
                            min={ROOM_MIN}
                            max={ROOM_MAX}
                            onChange={(newValues) => setRoomCount(newValues[0])}
                            renderTrack={({ props, children }) => (
                              <div
                                onMouseDown={props.onMouseDown}
                                onTouchStart={props.onTouchStart}
                                style={{
                                  ...props.style,
                                  height: "36px",
                                  display: "flex",
                                  width: "100%",
                                }}
                              >
                                <div
                                  ref={props.ref}
                                  style={{
                                    height: "5px",
                                    width: "100%",
                                    borderRadius: "4px",
                                    background: getTrackBackground({
                                      values: [roomCount],
                                      colors: ["#e8ca23", "#ccc"],
                                      min: ROOM_MIN,
                                      max: ROOM_MAX,
                                    }),
                                    alignSelf: "center",
                                  }}
                                >
                                  {children}
                                </div>
                              </div>
                            )}
                            renderThumb={({ props, isDragged }) => (
                              <div
                                {...props}
                                style={{
                                  ...props.style,
                                  height: "42px",
                                  width: "42px",
                                  borderRadius: "4px",
                                  backgroundColor: "#FFF",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  boxShadow: "0px 2px 6px #AAA",
                                }}
                              >
                                <div
                                  style={{
                                    height: "16px",
                                    width: "5px",
                                    backgroundColor: isDragged
                                      ? "#e8ca23"
                                      : "#CCC",
                                  }}
                                />
                              </div>
                            )}
                          />
                          <output style={{ marginTop: "30px" }}>
                            {roomCount}
                          </output>
                        </div>
                      </div>
                      <div className="col-sm"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="scroll__down">
              <p>SCROLL DOWN</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoverPage;

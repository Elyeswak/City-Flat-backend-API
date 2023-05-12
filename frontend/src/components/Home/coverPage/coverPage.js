import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { Range, getTrackBackground } from "react-range";
import FilteringResults from "./../FilteringPage/FilteringResults";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useAnimation } from "framer-motion";
import i18n from "./../../../i18next";
import { useTranslation } from "react-i18next";
import "./coverPage.css";

/**PRICE VARIABLES */
const PRICE_STEP = 10;
const MIN_PRICE = 0;
const MAX_PRICE = 1000;

/**ROOMS VARIABLES */
const ROOM_STEP = 1;
const ROOM_MIN = 1;
const ROOM_MAX = 7;

function CoverPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [roomCount, setRoomCount] = useState(1);
  const [priceValues, setPriceValues] = useState([100, 900]);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const { t } = useTranslation();

  const handlePriceChange = (newPriceValues) => {
    setPriceValues(newPriceValues);
  };

  const handlePropertyTypeChange = (event) => {
    setPropertyType(event.target.value);
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

  useEffect(() => {
    axios
      .get("http://localhost:9090/appartments/getAllAppart")
      .then((result) => {
        setData(result.data);
      })
      .catch((error) => console.log(error));
  }, []);
  /**SEARCH BY FILTER */

  const handleFilter = () => {
    const filteredData = data.filter((item) => {
      // Filter by price range
      const price = parseInt(item.pricePerNight);
      if (price < priceValues[0] || price > priceValues[1]) {
        return false;
      }

      // Filter by room count
      const rooms = parseInt(item.rooms);
      if (rooms !== roomCount) {
        return false;
      }

      // Filter by property type
      if (propertyType && item.type !== propertyType) {
        return false;
      }

      return true;
    });

    setFilteredData(filteredData);
    localStorage.setItem("filteredData", JSON.stringify(filteredData));
  };

  /**MOTION ANIMATION*/
  const { ref, inView } = useInView();
  const animation = useAnimation();
  useEffect(() => {
    if (inView) {
      animation.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.7 },
      });
    } else {
      animation.start({ x: -100, opacity: 0 });
    }
  }, [animation, inView]);

  return (
    <>
      <div className="homepage">
        <div className="borders">
          <div className="container">
            <div className="header__cover">
              <motion.div
                ref={ref}
                initial={{ x: -100, opacity: 0 }}
                animate={animation}
              >
                <h1 className="title__cover">
                  {t(
                    "BOOK YOUR NEXT GETAWAY AND LET US TAKE CARE OF THE REST!"
                  )}
                </h1>
              </motion.div>

              <form className="search">
                <input
                  className="search__input"
                  type="text"
                  id="search"
                  placeholder={t("SEARCH")}
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
                      <h4>FILTER</h4>
                      <hr />
                    </div>
                    <div className="filter__list">
                      <div className="row row_filter price__filter">
                        <p>{t("PRICE RANGE")}</p>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Range
                            values={priceValues}
                            step={PRICE_STEP}
                            min={MIN_PRICE}
                            max={MAX_PRICE}
                            onChange={handlePriceChange}
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
                                      values: priceValues,
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
                            <output>€{priceValues[0]}</output>
                            <output>€{priceValues[1]}</output>
                          </div>
                        </div>
                      </div>
                      <div className="row row_filter">
                        <p>{t("TYPE")}</p>
                        <div className="row">
                          <div className="col">
                            <p>{t("STANDARD")}</p>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault1"
                              value="STANDARD"
                              onChange={handlePropertyTypeChange}
                              checked={propertyType === "STANDARD"}
                            />
                          </div>
                          <div className="col">
                            <p>{t("PREMIUM")}</p>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault2"
                              value="PREMIUM"
                              onChange={handlePropertyTypeChange}
                              checked={propertyType === "PREMIUM"}
                            />
                          </div>
                          <div className="col">
                            <p>{t("LUXURY")}</p>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="flexRadioDefault"
                              id="flexRadioDefault3"
                              value="LUXURY"
                              onChange={handlePropertyTypeChange}
                              checked={propertyType === "LUXURY"}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="row row_filter">
                        <div className="col-sm"></div>
                        <div className="col-sm">
                          <p>{t("ROOMS")}</p>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              flexDirection: "column",
                              alignItems: "center",
                            }}
                          >
                            <Range
                              values={[roomCount]}
                              step={ROOM_STEP}
                              min={ROOM_MIN}
                              max={ROOM_MAX}
                              onChange={(newValues) =>
                                setRoomCount(newValues[0])
                              }
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
                            <output style={{ marginTop: "10px" }}>
                              {roomCount}
                            </output>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                marginTop: "20px",
                              }}
                            >
                              <button className="btn results" onClick={handleFilter}>
                                {t("SEE RESULTS")}
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="col-sm"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="scroll__down">
                <p>{t("SCROLL DOWN")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FilteringResults filteredData={filteredData} />
    </>
  );
}

export default CoverPage;

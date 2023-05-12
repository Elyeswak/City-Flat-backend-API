import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
// import Rate from "../Rate/Rate";
import "./ApartmentDetails.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-multiple-select-dropdown-lite/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { MapContainer, TileLayer, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import axios, { all } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelect from "react-multiple-select-dropdown-lite";
import { Card, Carousel } from "react-bootstrap";
import { Button, Form } from "react-bootstrap";
import ReviewCard from "./ReviewCard";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next";
import { Rating } from "react-simple-star-rating";
import ProgressBar from "./ProgressBar";

function ApartmentDetails() {
  /*
   * GETTING ID from the URL
   */

  let params = useParams();
  const { t } = useTranslation();
  const [apartment, setApartment] = useState(null);
  const [services, setServices] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [allReviews, setAllReviews] = useState([]);
  const [rate, setRate] = useState(0);
  const [ratingPercentages, setRatingPercentages] = useState([]);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [reviewsToShow, setReviewsToShow] = useState([]);
  const checkItemInLocalStorage = (itemName) => {
    const item = localStorage.getItem(itemName);
    return item !== null;
  };

  //user info
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userToken = user?.token;

  const [formData, setFormData] = useState({
    rating: "",
    review: "",
  });

  const [errors, setErrors] = useState({
    rating: "",
    review: "",
  });

  const [refresh, setRefresh] = useState(0);

  /**AXIOS REQUESTS */

  useEffect(() => {
    // fetch apartment data
    axios
      .get(`http://localhost:9090/user/appartments/${params.id}`)
      .then((response) => {
        setApartment(response.data);
        localStorage.setItem("apartment", JSON.stringify(response.data));
        setServices(response.data.services);
        const gotReviews = response.data.reviews;
        setAllReviews(gotReviews.reverse());
        setReviewsToShow(response.data.reviews.slice(0, 3));

        // fetch booked dates data
        const bookedDatesPromise = axios
          .get(`http://localhost:9090/user/orders/bookeddates/${params.id}`)
          .then((response) => {
            return response.data;
          })
          .catch((error) => {
            console.log(error);
          });

        Promise.all([bookedDatesPromise]).then((res) => {
          const [bookedDates] = res;
          setBookedDates(bookedDates);
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/appartments/reviews/${apartment?.id}`)
      .then((response) => {
        const gotReviews = response.data;
        setAllReviews(gotReviews.reverse());
        setReviewsToShow(response.data.slice(0, 3));
      })
      .catch(() => {});
    getRate();
  }, [refresh]);

  const getRate = () => {
    axios
      .get(`http://localhost:9090/user/appartments/${params.id}`)
      .then((response) => {
        setRate(response.data.rating);
      });
    console.log("current rate", rate);
  };

  /*
   * SELECT SERVICES
   */

  const [value, setvalue] = useState("");
  const handleOnchange = (val) => {
    setvalue(val);
    console.log("selected service", val);
  };

  // console.log("services", services)

  /**SERVICES OF THE APARTMENT */
  const options = services.map((service) => {
    return {
      label: service.name,
      value: service._id,
    };
  });

  /*
   *DATE
   */

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  /**EXTRACT SERVICES PRICES */
  const valueStr = value.split(",").map(String);
  const totalPricePerNight = valueStr.reduce((acc, curr) => {
    const servicePrice = services.find((s) => s._id === curr);
    if (servicePrice) {
      return acc + servicePrice.pricePerNight;
    }
    return acc;
  }, 0);
  localStorage.setItem("servicesPrice", JSON.stringify(totalPricePerNight));

  /**EXTRACT NAMES FROM SERVICES*/
  const valueStrNames = value.split(",").map(String);
  const serviceNames = valueStrNames.reduce((acc, curr) => {
    const serviceName = services.find((s) => s._id === curr);
    if (serviceName) {
      return [...acc, serviceName.name];
    }
    return acc;
  }, []);
  localStorage.setItem("serviceNames", JSON.stringify(serviceNames));

  /**EXTRACT IDS FROM SERVICES*/
  const valueStrIds = value.split(",").map(String);
  const serviceIds = valueStrIds.reduce((acc, curr) => {
    if (services.some((s) => s._id === curr)) {
      return [...acc, curr];
    }
    return acc;
  }, []);
  localStorage.setItem("serviceIds", JSON.stringify(serviceIds));

  /**CALCULATE THE DIFFRENCE BETWEEN 2 DATES */
  const startDate = date[0].startDate;
  const endDate = date[0].endDate;
  const diffInTime = endDate.getTime() - startDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);
  localStorage.setItem("diffInDays", JSON.stringify(diffInDays));

  /**APARTMENT PRICE */
  const apartmentPrice = apartment && apartment.pricePerNight * diffInDays;
  localStorage.setItem("apartmentPrice", JSON.stringify(apartmentPrice));

  /** THE TOTAL PRICE OF THE STAY */
  const totalPrice = apartmentPrice + totalPricePerNight;
  localStorage.setItem("totalPrice", JSON.stringify(totalPrice));

  /**STORING THE DATES LOCALLY */
  localStorage.setItem(
    "startDate",
    JSON.stringify(format(startDate, "dd/MM/yyyy"))
  );
  localStorage.setItem(
    "endDate",
    JSON.stringify(format(endDate, "dd/MM/yyyy"))
  );

  localStorage.setItem(
    "checkIn",
    JSON.stringify(format(startDate, "yyyy-MM-dd"))
  );
  localStorage.setItem(
    "checkOut",
    JSON.stringify(format(endDate, "yyyy-MM-dd"))
  );

  /**CHECK IF  THE USER IS LOGGEDIN AND HIS ACCOUNT IS ENBALED */

  const handleCheckUser = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const isVerified = user.isVerified;

      if (user && isVerified === true) {
        // user is logged in and account is verified
        navigate("/confirmation");
      } else if (user && isVerified === false) {
        // user is logged in but account is not verified
        console.log("account not verified");
        toast.error("❌ Your account is disabled please contact the admin", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        // user is not logged in
        toast.error("❌ Login before making any further actions", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          navigate("/login");
        }, 2600);
      }
    } else {
      navigate("/login");
    }
  };

  /**DISABLED BOOKED DATES */
  const disabledDates = bookedDates.flatMap(({ start, end }) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  });

  //submit the review
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Check for validation errors
    if (!formData.rating || !formData.review) {
      setErrors({
        rating: formData.rating ? "" : "Please enter a rating",
        review: formData.review ? "" : "Please enter a review",
      });
      return;
    }
    // Submit the form
    try {
      const response = await axios.post(
        `http://localhost:9090/appartments/reviews/${apartment.id}`,
        {
          User: user.id,
          UserName: user.name,
          Rating: formData.rating,
          Description: formData.review,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // authentication is required
          },
        }
      );
      const review = response.data;
      console.log(review);
      setFormData({
        rating: "",
        review: "",
      });
      setRefresh(refresh + 1);
      getRate();
    } catch (error) {}
  };

  const testData = [
    { bgcolor: "#FFBC0B", completed: ratingPercentages[0] },
    { bgcolor: "#FFBC0B", completed: ratingPercentages[1] },
    { bgcolor: "#FFBC0B", completed: ratingPercentages[2] },
    { bgcolor: "#FFBC0B", completed: ratingPercentages[3] },
    { bgcolor: "#FFBC0B", completed: ratingPercentages[4] },
  ];

  useEffect(() => {
    const ratingCounts = allReviews.reduce(
      (acc, review) => {
        const rating = Math.floor(review.Rating);
        acc[rating - 1]++;
        return acc;
      },
      [0, 0, 0, 0, 0]
    );

    const totalReviews = allReviews.length;
    setRatingPercentages(
      ratingCounts.map((count) => ((count / totalReviews) * 100).toFixed(0))
    );
  }, [allReviews]);

  const [showBtn, setShowBtn] = useState(false);

  const showReviews = () => {
    if (showBtn) {
      setShowBtn(false);
      setReviewsToShow(allReviews.slice(0, 3));
    } else {
      setShowBtn(true);
      setReviewsToShow(allReviews);
    }
  };

  /**RENDERING COMPONENT*/
  return (
    <>
      {apartment && (
        <div className="apartment_details">
          <Navbar />
          <div className="apartment_details_content">
            <div className="upper__space"></div>
            <ToastContainer
              position="top-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
            />
            {/** Apartment Details */}

            <div className="row">
              <div className="details__app">
                <div className="app_carousel">
                  <Carousel>
                    {apartment.img.map((image) => (
                      <Carousel.Item>
                        <img src={image} className="img-fluid" />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
                <div className="app_details">
                  <div>
                    <div className="row all__details">
                      <div className="app_title">
                        <h1>{apartment.name}</h1>
                        <h5>{apartment.location}</h5>
                        <Rating
                          initialValue={rate}
                          readonly
                          allowFraction
                          size={25}
                        />
                      </div>
                    </div>

                    <div className="row app_description">
                      <p>{apartment.description}</p>
                    </div>

                    <div className="row">
                      <div className="col"></div>
                      {/* <div className="col justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light custom-button "
                        >
                          Show reviews
                        </button>
                      </div> */}
                    </div>
                    <div className="services_details">
                      <div className="row" style={{ padding: "2%" }}>
                        <strong>{t("Choose your services")}:</strong>
                      </div>

                      <div className="services_selection">
                        <MultiSelect
                          onChange={handleOnchange}
                          options={options}
                          placeholder={t("Choose Services")}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="upper__space"></div>
            {/** Map and Calendar */}

            <div className="row">
              <div className="pick_reservation">
                <div className="reservation__map">
                  <MapContainer
                    center={[51.2277, 6.7735]}
                    zoom={13}
                    scrollWheelZoom={false}
                    tap={false}
                    removeOutsideVisibleBounds={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
                <div className="date__range">
                  <DateRange
                    editableDateInputs={true}
                    onChange={(item) => setDate([item.selection])}
                    moveRangeOnFirstSelection={false}
                    ranges={date}
                    className="date"
                    minDate={new Date()}
                    disabledDates={disabledDates}
                  />
                </div>
              </div>
            </div>

            {/** Reservation details */}
            <div className="upper__space"></div>
            <div className="row ">
              <div className="reservation_details">
                <div className="reservation_details_content">
                  <div className="row  dates_reservation">
                    <div className="col-6  check-in">
                      <div className="p-3">
                        {" "}
                        <p>{t("Check-in")}</p>
                        <strong>{`${format(
                          date[0].startDate,
                          "dd/MM/yyyy"
                        )}`}</strong>
                      </div>
                    </div>
                    <div className="col-6 check-out">
                      <div className="p-3">
                        {" "}
                        <p>{t("Check-out")}</p>
                        <strong>{`${format(
                          date[0].endDate,
                          "dd/MM/yyyy"
                        )}`}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="row details_row">
                    <p>{t("Nights Fees")} :€{apartmentPrice}</p>
                    <p>{t("Services Fees")} :€{totalPricePerNight}</p>
                    <p>{t("Total price")} :€{totalPrice}</p>
                  </div>
                  <div className="row custom-button-reservation-row">
                    <button
                      className="btn btn-dark custom-button-reservation"
                      onClick={handleCheckUser}
                    >
                      {t("RESERVE")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="review-cards-cont row mt-5">
              {user ? (
                <div className="text-light col-md-5 col-12">
                  <div className="write-review-cont">
                    <div className="d-flex align-items-center">
                      <img
                        src={user.img}
                        className="img-fluid img-thumbnail rounded-circle write-review-img"
                      />
                      <p className="ms-3 fs-4 text-light">
                        {user && user.name}
                      </p>
                    </div>
                    <p className="text-start fs-5 mt-3">{t("Give us a rate")}</p>
                    <div className="">
                      <Form onSubmit={handleSubmit}>
                        <div className="rate-cont d-flex justify-content-start mb-4">
                          <Rating
                            initialValue={formData.rate}
                            allowFraction
                            size={25}
                            onClick={(rate) => {
                              setFormData({
                                ...formData,
                                rating: rate,
                              });
                              console.log(formData);
                            }}
                            showTooltip
                          />
                        </div>
                        <Form.Group controlId="review" className="mb-2">
                          <Form.Control
                            as="textarea"
                            rows={3}
                            minLength={20}
                            maxLength={250}
                            value={formData.review}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                review: event.target.value,
                              })
                            }
                            isInvalid={!!errors.review}
                            className="review-textArea mt-5"
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.review}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button type="submit" className="w-50 add-review-btn">
                          {t("RATE")}
                        </Button>
                      </Form>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="col-md-7 col-12">
                <div className="row reviews-stats">
                  <div className="col text-start d-flex flex-column justify-content-between">
                    <p className="d-flex  align-items-end">
                      <span className="display-1 fw-bold text-light">
                        {rate}
                      </span>{" "}
                      <span
                        className="display-2 fw-bold text-light"
                        style={{ marginBottom: "10px" }}
                      >
                        ⭐
                      </span>
                    </p>
                    <p className="text-uppercase text-light m-0 fs-4">
                      {t("FROM ALL")} {allReviews.length} {t("REVIEWS")}
                    </p>
                  </div>
                  <div className="col">
                    {testData.map((item, idx) => (
                      <div className="d-flex align-items-center">
                        <span className="text-light me-2">{idx + 1}⭐</span>
                        <ProgressBar
                          key={idx}
                          bgcolor={item.bgcolor}
                          completed={item.completed}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {reviewsToShow.map((review, index) => (
                  <ReviewCard
                    key={index + 1}
                    review={review}
                    apartment={apartment}
                    allReviews={allReviews}
                    reviewsToShow={reviewsToShow}
                    setReviewsToShow={setReviewsToShow}
                    setAllReviews={setAllReviews}
                    getRate={getRate}
                    refresh={refresh}
                    setRefresh={setRefresh}
                    index={index + 1}
                  />
                ))}
                <button
                  className="btn btn-success float-end mt-3"
                  onClick={showReviews}
                >
                  {showBtn ? "Show less" : "Show all"}
                </button>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

let DefaultIcon = L.icon({
  iconUrl:
    "https://icon-library.com/images/google-maps-api-icon/google-maps-api-icon-15.jpg",
  iconSize: [32, 35],
});

L.Marker.prototype.options.icon = DefaultIcon;

export default ApartmentDetails;

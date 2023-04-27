import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import CarouselPage from "../../utils/Carousel";
import Rate from "../Rate/Rate";
import "./ApartmentDetails.css";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import "react-multiple-select-dropdown-lite/dist/index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { MapContainer, TileLayer, useMap, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import MultiSelect from "react-multiple-select-dropdown-lite";

function ApartmentDetails() {
  const [rating, setRating] = useState(0);

  /*
   * GETTING ID from the URL
   */

  let params = useParams();

  const [apartment, setApartment] = useState(null);
  const [service, setService] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  /**AXIOS REQUESTS */

  useEffect(() => {
    // fetch apartment data
    axios
      .get(`http://localhost:9090/user/appartments/${params.id}`)
      .then((response) => {
        setApartment(response.data);
        localStorage.setItem("apartment", JSON.stringify(response.data));
        setService(response.data.services);

        // // fetch services data
        // const servicePromises = response.data.services.map((el) => {
        //   return axios
        //     .get(`http://localhost:9090/user/services/${el}`)
        //     .then((response) => {
        //       return response.data;
        //     })
        //     .catch((error) => {
        //       console.log(error);
        //     });
        // });

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
        console.log(service)
      })
      .catch((error) => {
        console.log(error);
      });
  }, [params.id]);


  /*
   * SELECT SERVICES
   */

  const [value, setvalue] = useState("");
  const handleOnchange = (val) => {
    setvalue(val);
    console.log(val);
  };

  /**SERVICES OF THE APARTMENT */
  const options = service.map((service) => {
    return {
      label: service.name,
      value: service.id,
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
    const servicePrice = service.find((s) => s.id === curr);
    if (servicePrice) {
      return acc + servicePrice.pricePerNight;
    }
    return acc;
  }, 0);
  localStorage.setItem("servicesPrice", JSON.stringify(totalPricePerNight));

  /**EXTRACT NAMES FROM SERVICES*/
  const valueStrNames = value.split(",").map(String);
  const serviceNames = valueStrNames.reduce((acc, curr) => {
    const serviceName = service.find((s) => s.id === curr);
    if (serviceName) {
      return [...acc, serviceName.name];
    }
    return acc;
  }, []);
  localStorage.setItem("serviceNames", JSON.stringify(serviceNames));

  /**EXTRACT IDS FROM SERVICES*/
  const valueStrIds = value.split(",").map(String);
  const serviceIds = valueStrIds.reduce((acc, curr) => {
    if (service.some((s) => s.id === curr)) {
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
        navigate("/login");
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
                  <CarouselPage />
                </div>
                <div className="app_details">
                  <div>
                    <div className="row all__details">
                      <div className="app_title">
                        <h1>{apartment.name}</h1>
                        <h5>{apartment.location}</h5>
                        <Rate
                          rating={rating}
                          onRating={(rate) => setRating(rate)}
                        />
                      </div>
                    </div>

                    <div className="row app_description">
                      <p>{apartment.description}</p>
                    </div>

                    <div className="row">
                      <div className="col"></div>
                      <div className="col justify-content-end">
                        <button
                          type="button"
                          className="btn btn-light custom-button "
                        >
                          Show reviews
                        </button>
                      </div>
                    </div>
                    <div className="services_details">
                      <div className="row" style={{ padding: "2%" }}>
                        <strong>Choose your services:</strong>
                      </div>

                      <div className="services_selection">
                        <MultiSelect
                          onChange={handleOnchange}
                          options={options}
                          placeholder="Choose Services"
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
                        <p>Check-in</p>
                        <strong>{`${format(
                          date[0].startDate,
                          "dd/MM/yyyy"
                        )}`}</strong>
                      </div>
                    </div>
                    <div className="col-6 check-out">
                      <div className="p-3">
                        {" "}
                        <p>Check-out</p>
                        <strong>{`${format(
                          date[0].endDate,
                          "dd/MM/yyyy"
                        )}`}</strong>
                      </div>
                    </div>
                  </div>
                  <div className="row details_row">
                    <p>Nights Fees :€{apartmentPrice}</p>
                    <p>Services Fees :€{totalPricePerNight}</p>
                    <p>Total price :€{totalPrice}</p>
                  </div>
                  <div className="row custom-button-reservation-row">
                    <button
                      className="btn btn-dark custom-button-reservation"
                      onClick={handleCheckUser}
                    >
                      RESERVE
                    </button>
                  </div>
                </div>
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

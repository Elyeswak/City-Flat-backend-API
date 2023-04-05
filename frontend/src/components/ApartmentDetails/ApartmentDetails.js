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

import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { MapContainer, TileLayer, useMap, Popup, Marker } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useParams } from "react-router-dom";
import MultiSelect from "react-multiple-select-dropdown-lite";

function ApartmentDetails() {
  const [rating, setRating] = useState(0);

  /*
   * GETTING ID from the URL
   */

  let params = useParams();

  const [apartment, setApartment] = useState(null);
  const [service, setService] = useState([]);

  /**AXIOS REQUESTS */
  useEffect(() => {
    axios
      .get(`http://localhost:9090/user/appartments/${params.id}`)
      .then((response) => {
        setApartment(response.data);
        localStorage.setItem("apartment", JSON.stringify(response.data));

        const servicePromises = response.data.services.map((el) => {
          return axios
            .get(`http://localhost:9090/user/services/${el}`)
            .then((response) => {
              return response.data;
            })
            .catch((error) => {
              console.log(error);
            });
        });
        Promise.all(servicePromises).then((res) => {
          setService(res);
          console.log(res);
        });
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
  localStorage.setItem("startDate", JSON.stringify(format(startDate, "dd/MM/yyyy")));
  localStorage.setItem("endDate", JSON.stringify(format(endDate, "dd/MM/yyyy")));

  localStorage.setItem("checkIn", JSON.stringify(format(startDate, "yyyy-MM-dd")));
  localStorage.setItem("checkOut", JSON.stringify(format(endDate, "yyyy-MM-dd")));



  /*
   *RENDERING COMPONENT
   */

  return (
    <>
      {apartment && (
        <div className="apartment_details">
          <Navbar />
          <div className="apartment_details_content">
            <div className="upper__space"></div>
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
                    <a href="/confirmation">
                      <button className="btn btn-dark custom-button-reservation">
                        RESERVE
                      </button>
                    </a>
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

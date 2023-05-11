import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import "./Wishlist.css";
import axios from "axios";
import { Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";

function Wishlist() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const userToken = user.token;

  const [allApartments, setAllApartments] = useState([]);

  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/user/${userId}`)
      .then((response) => {
        setWishlist(response.data.wishlist);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:9090/appartments/getAllAppart`)
      .then((response) => {
        setAllApartments(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filteredApartments = allApartments.filter((apartment) =>
    wishlist.includes(apartment.id)
  );

  return (
    <div className="wishlist_page">
      <Navbar />
      <div className="content_page">
        <div className="upper__space"></div>
        <div className="upper__space wishlist_title">
          <h1>WISHLIST</h1>
        </div>
        <div className="wishlist__body">
          <div className="wishlist__content">
            {filteredApartments.map((apart) => (
              <div className="row pb-5">
                <div className="col">
                  <Carousel fade>
                    {apart.img.map((img) => (
                      <Carousel.Item>
                        <img
                          className="d-block w-100"
                          src={img}
                          alt="apartment image"
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                </div>
                <div className="col wishlist_description d-flex flex-column justify-content-center">
                  <h1>
                    <Link to={`/details/${apart.id}`} className="text-light">
                      {apart.name}
                    </Link>{" "}
                  </h1>
                  <p>{apart.description} </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;

import React from "react";
import Carousel from "react-bootstrap/Carousel";
import image1 from "./images/image1.jpg";
import image2 from "./images/image2.jpg";
import image3 from "./images/image3.jpg";

function CarouselPage() {
  return (
    <Carousel fade>
      <Carousel.Item>
        <img
          className="d-block w-100 img_size"
          src={image1}
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={image2} alt="Second slide" />
      </Carousel.Item>
      <Carousel.Item>
        <img className="d-block w-100" src={image3} alt="Third slide" />
      </Carousel.Item>
    </Carousel>
  );
}

export default CarouselPage;

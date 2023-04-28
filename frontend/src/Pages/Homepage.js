import React from "react";
import Navbar from "./../components/Navbar/Navbar";
import CoverPage from "../components/Home/coverPage/coverPage";
import Luxury from "./../components/Home/Luxury/luxury";
import Premium from "./../components/Home/Premium/premium";
import Standard from "./../components/Home/Standard/standard";
import Footer from "./../components/Footer/footer";
import "./../App.css"

function Homepage() {
  
  return (
    <div className="home">
      <Navbar />
      <CoverPage />
      <Luxury />
      <Premium />
      <Standard />
      <Footer />
    </div>
  );
}

export default Homepage;

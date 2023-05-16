import React from "react";
import Navbar from "../components/Navbar/Navbar";
import StandardCoverPage from "../components/Standard/StandardCoverPage/StandardCoverPage";
import StandardCollection from "../components/Standard/StandardCollection/StandardCollection";
import TopRatedStandard from "../components/Standard/TopRatedStandard/TopRatedStandard";
import Footer from "../components/Footer/footer";

function StandardPage() {
  return (

    <div className="standard" style={{backgroundColor:'black'}}>
      <Navbar/>
      <StandardCoverPage />
      <StandardCollection />
      <TopRatedStandard />
      <Footer />
    </div>
  );
}

export default StandardPage;

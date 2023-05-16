import React from "react";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/footer";
import { useTranslation } from "react-i18next";
import "./ThankyouPage.css";

function ThankyouPage() {

  const {t} = useTranslation()
  return (
    <div className="thankyou_page" style={{ backgroundColor: "black" }}>
      <Navbar/>
      <div className='upper__space'></div>
      <div className="thankyou__body">
        <div className="thankyou__content">
            <div className="thankyou__image">
                <img className="thankyou__image__class" src="./logo-cityflat.png"/>
            </div>
            <div className="thankyou__message"><h1>{t("THANK YOU FOR CHOOSING CITY FLAT")}</h1> <br/> <h1>{t("SEE YOU SOON!")}</h1></div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default ThankyouPage;

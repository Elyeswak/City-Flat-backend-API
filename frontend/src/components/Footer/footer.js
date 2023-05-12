import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import i18n from "../../i18next";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <div className="footer__page">
      <footer className="footer__content">
        <div className="footer_row row">
          <div className="col-lg-3 col-6 footer_col">
            {/* {t("")} */}
            <h3>{t("COMPANY")}</h3>
            <ul className="list-unstyled nav-links">
              <li>
                <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                  {t("About us")}
                </Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                  {t("Why Choose us")}
                </Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                  {t("Pricing")}
                </Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                  {t("Testimonial")}
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-3 col-6 footer_col">
            <h3>{t("RESOURCES")}</h3>
            <ul className="list-unstyled nav-links">
              <li>
                <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                  {t("Privacy Policy")}
                </Link>
              </li>
              <li>
                <Link to={"/"} onClick={() => window.scrollTo(0, 0)}>
                  {t("Terms")} &amp; {t("Condition")}
                </Link>
              </li>
              <li>
                <Link to={"/help"} onClick={() => window.scrollTo(0, 0)}>
                  {t("Contact Us")}
                </Link>{" "}
              </li>
            </ul>
          </div>
          <div className="col-lg-6 col-12 footer_col subscribe__content">
            <h3>CITY FLAT</h3>
            <p className="mb-4">{t("Subscribe to our Newsletter")}</p>
            <form action="#" className="subscribe">
              <input
                type="text"
                className="form-control"
                placeholder={t("Enter your e-mail")}
              />
              <input
                type="submit"
                className="btn btn-submit"
                value={t("Subscribe")}
              />
            </form>
          </div>
        </div>

        <div className="footer_row align-items-center">
          <div className="col-12">
            <div className="border-top my-5"></div>
          </div>
          <div className="col-md-6">
            <p>
              <small>&copy; {t("2023 All Rights Reserved.")}</small>
            </p>
          </div>
          <div className="col-md-6 text-md-right">
            <ul className="social list-unstyled">
              <li>
                <a href="#">
                  <FontAwesomeIcon icon={faFacebook} className="fa-2x" />
                </a>
              </li>
              <li>
                <a href="#">
                  <FontAwesomeIcon icon={faTwitter} className="fa-2x" />
                </a>
              </li>
              <li>
                <a href="#">
                  <FontAwesomeIcon icon={faInstagram} className="fa-2x" />
                </a>
              </li>
              <li>
                <a href="#">
                  <FontAwesomeIcon icon={faLinkedin} className="fa-2x" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

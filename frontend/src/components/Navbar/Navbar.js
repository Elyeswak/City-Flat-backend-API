import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { motion } from "framer-motion";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNavicon,
  faUserCircle,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import i18n from "./../../i18next";
import { NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { US, DE, FR } from "country-flag-icons/react/3x2";

function Navbar() {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const { t } = useTranslation();
  function handleLanguageChange(language) {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  }

  const [openProfile, setOpenProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  let menuRef = useRef();

  const [User, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  useEffect(() => {
    async function getUser() {
      try {
        const response = await axios.get(
          `http://localhost:9090/user/${User.id}`
        );
        const user = response.data;
        setIsAdmin(user.role === "ADMIN");
      } catch (error) {
        console.error(error);
      }
    }

    if (User) {
      getUser();
    }
  }, [User]);

  useEffect(() => {
    if (User) {
      setIsLoggedIn(true);
    }
  }, [User]);

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear(); // clear local storage
    setIsLoggedIn(false); // set isLoggedIn state to false
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="navbar-menu">
        <button
          className="float-on-hover"
          onClick={() => setOpenMenu(!openMenu)}
        >
          <FontAwesomeIcon icon={faNavicon} className="fa-2x" />
        </button>
        {openMenu && (
          <>
            <div className="menu__page">
              <div className="close__button">
                <button onClick={() => setOpenMenu(false)}>
                  <FontAwesomeIcon icon={faClose} className="fa-2x" />
                </button>
              </div>

              <div className="menu__content">
                <div className="menu__items">
                  <ul>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      <a href="/" className="link__item">
                        {t("HOME")}
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      {" "}
                      <a href="/standard" className="link__item">
                        {t("STANDARD")}
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      <a href="/premium" className="link__item">
                        {t("PREMIUM")}
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      {" "}
                      <a href="/luxury" className="link__item">
                        {t("LUXURY")}
                      </a>
                    </motion.li>
                    {isLoggedIn ? (
                      <motion.li
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.8 }}
                        transition={{ duration: 0.7 }}
                      >
                        {" "}
                        <a href="/wishlist" className="link__item">
                          {t("WISHLIST")}
                        </a>
                      </motion.li>
                    ) : null}
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      <a href="/help" className="link__item">
                        {t("CONTACT")}
                      </a>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="nav__right">
        <div className="languages_changer">
          <NavDropdown
            title={
              currentLanguage === "en" ? (
                <US title="United States" className="flag-icon" />
              ) : currentLanguage === "fr" ? (
                <FR title="France" className="flag-icon" />
              ) : (
                <DE title="Deutschland" className="flag-icon" />
              )
            }
            id="language-selector"
            onSelect={handleLanguageChange}
            selected="en"
          >
            <NavDropdown.Item
              eventKey="en"
              style={{ fontFamily: "font-alethia-pro" }}
            >
              <US title="United States" className="flag-icon" /> English
            </NavDropdown.Item>
            <NavDropdown.Item
              eventKey="fr"
              style={{ fontFamily: "font-alethia-pro" }}
            >
              <FR title="France" className="flag-icon" /> French
            </NavDropdown.Item>
            <NavDropdown.Item
              eventKey="de"
              style={{ fontFamily: "font-alethia-pro" }}
            >
              <DE title="Deutschland" className="flag-icon" /> German
            </NavDropdown.Item>
          </NavDropdown>
        </div>

        {isLoggedIn ? (
          <div className="navbar-user" ref={menuRef}>
            <button
              className="float-on-hover"
              onClick={() => setOpenProfile(!openProfile)}
            >
              {" "}
              <FontAwesomeIcon icon={faUserCircle} className="fa-2x" />
            </button>

            {openProfile && (
              <div
                className={` flex flex-col gap-4 dropdown__menu ${
                  openProfile ? "active" : "inactive"
                }`}
              >
                <div className="dropdown__list">
                  <a href="/requests">
                    <button className="button-31">{t("Orders")}</button>
                  </a>
                  {isLoggedIn ? (
                    <a href="/wishlist">
                      <button className="button-31">{t("Wishlist")}</button>
                    </a>
                  ) : null}

                  <a href="/account">
                    <button className="button-31">{t("Account")}</button>
                  </a>

                  {isAdmin ? (
                    <a href="/admndash">
                      <button className="button-31">Dashboard</button>
                    </a>
                  ) : null}
                  <hr />
                  <a href="/help">
                    <button className="button-31">{t("Help")}</button>
                  </a>

                  <button className="button-31" onClick={handleLogout}>
                    {t("Logout")}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="navbar-user auth-btns" ref={menuRef}>
            <a href="/signup">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.7 }}
                type="button"
                className="btn btn-dark"
              >
                {t("SIGNUP")}
              </motion.button>
            </a>
            <a href="/login">
              <motion.button
                type="button"
                className="btn btn-link"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                transition={{ duration: 0.7 }}
              >
                {t("LOGIN")}
              </motion.button>
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

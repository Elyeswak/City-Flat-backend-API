import React, { useEffect, useRef, useState } from "react";
import "./Navbar.css";
import { motion } from "framer-motion";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNavicon,
  faUserCircle,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  let menuRef = useRef();

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

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, []);

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
                        HOME
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      {" "}
                      <a href="/standard" className="link__item">
                        STANDARD
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      <a href="/premium" className="link__item">
                        PREMIUM
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      {" "}
                      <a href="/luxury" className="link__item">
                        LUXURY
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      {" "}
                      <a href="/wishlist" className="link__item">
                        WISHLIST
                      </a>
                    </motion.li>
                    <motion.li
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.8 }}
                      transition={{ duration: 0.7 }}
                    >
                      <a href="/contact" className="link__item">
                        CONTACT
                      </a>
                    </motion.li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
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
                <button className="button-31">Messages</button>
                <button className="button-31">Notifications</button>
                <a href="/wishlist">
                  <button className="button-31">Wishlist</button>
                </a>
                <hr />
                <a href="/account"><button className="button-31">Account</button></a>
                <button className="button-31">Help</button>
                <button className="button-31" onClick={handleLogout}>
                  Logout
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
              SIGNUP
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
              LOGIN
            </motion.button>
          </a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
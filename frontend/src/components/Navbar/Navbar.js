import React, { useEffect, useRef, useState } from "react";
import Dropdown from "../Dropdown/dropdown";
import "./Navbar.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faNavicon,
  faUserCircle,
  faClose,
} from "@fortawesome/free-solid-svg-icons";

function Navbar() {
  const [openProfile, setOpenProfile] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  let menuRef = useRef();

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setOpenProfile(false);
        console.log(menuRef.current);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

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
                    <li>
                      <a href="/" className="link__item">
                        HOME
                      </a>
                    </li>
                    <li>
                      {" "}
                      <a href="/standard" className="link__item">
                        STANDARD
                      </a>
                    </li>
                    <li>
                      <a href="/premium" className="link__item">
                        PREMIUM
                      </a>
                    </li>
                    <li>
                      {" "}
                      <a href="/luxury" className="link__item">
                        LUXURY
                      </a>
                    </li>
                    <li>
                      {" "}
                      <a href="/whishlist" className="link__item">
                        WISHLIST
                      </a>
                    </li>
                    <li>
                      <a href="/contact" className="link__item">
                        CONTACT
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

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
            <div className="user__info">
              <div className="circular__image">
                <img src="./avatar.png" alt="profile pic" />
              </div>
              <div className="user__name">
                <p>User Name</p>
              </div>
            </div>
            <div className="dropdown__list">
              <button className="button-31">Messages</button>
              <button className="button-31">Notifications</button>
              <button className="button-31">Whishlist</button>
              <hr />
              <button className="button-31">Account</button>
              <button className="button-31">Help</button>
              <button className="button-31">Logout</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;

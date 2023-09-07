import React from "react";
import './dropdown.css'

function dropdown() {
  return (
    <div className="flex flex-col gap-4 dropdown__menu">
        <div className="user__info">
           <div className="circular__image"><img src="./avatar.png" alt="profile pic"/></div>
           <div className="user__name"><p>User Name</p></div>
        </div>
      <div className="dropdown__list">
        
        <button className="button-31">Messages</button>
        <button className="button-31">Notifications</button>
        <button className="button-31">Whishlist</button>
        <hr/>
        <button className="button-31">Account</button>
        <button className="button-31">Help</button>
        <button className="button-31">Logout</button>
        
        </div>
    </div>
  );
}

export default dropdown;

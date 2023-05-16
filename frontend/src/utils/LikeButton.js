import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

function LikeButton(props) {
    return (
      <div className="like_button_luxury">
        <button onClick={props.onClick}>
          <FontAwesomeIcon
            icon={props.liked ? faHeart : faHeartEmpty}
            className={`heart-icon ${props.liked ? "liked" : ""}`}
          />
        </button>
      </div>
    );
  }
  

export default LikeButton
import React, { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { Card, Dropdown } from "react-bootstrap";
import EditModal from "./EditModal";

export default function ReviewCard({
  review,
  apartment,
  allReviews,
  setAllReviews,
  getRate,
  setFormData,
  index,
}) {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const userToken = user?.token;
  const isReviewOwner = userId === review.User;
  const [userImg, setUserImg] = useState("");

  useEffect(() => {
    // fetch all services
    axios
      .get(`http://localhost:9090/user/${review.User}`)
      .then((response) => {
        setUserImg(response.data.img);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [review]);

  const handleDeleteReview = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:9090/appartments/reviews/${review._id}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // authentication is required
          },
          data: {
            appartmentId: apartment.id,
          },
        }
      );
      const ResData = response.data;
      console.log(ResData);
      // Remove the deleted review from the allReviews array
      const updatedReviews = allReviews.filter(
        (deleteReview) => deleteReview._id !== review._id
      );

      setAllReviews(updatedReviews);
      getRate();
    } catch (error) {
      console.error(error);
    }
  };

  const [showModal, setShowModal] = useState(false);

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <Card key={review._id} className="text-dark review-card">
        <Card.Body>
          <Card.Title className="row">
            <div className="col text-start d-flex justify-content-center align-items-center">
              <img
                src={userImg}
                className="img-fluid img-thumbnail rounded-circle write-review-img"
              />
              <p className="col text-start ms-3 fs-4">
                {review.UserName ? review.UserName : "Unknown User"}
              </p>
            </div>
            <p className="col text-end">Rating: {review.Rating}⭐</p>
          </Card.Title>
          <Card.Text>
            <div className="row mb-3">
              <p className="col-10 text-start">{review.Description}</p>
              <p className="col-2 text-end">
                {moment(review.createdDate).format("DD MMMM YYYY")}
                <br />
                {moment(review.createdDate).format("h:mm A")}
              </p>
            </div>
            {isReviewOwner ? (
              <Dropdown className="drop-toggle">
                <Dropdown.Toggle
                  variant="success"
                  id="dropdown-basic"
                ></Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item>
                    <button
                      className="btn btn-link text-primary"
                      onClick={() => {
                        handleShowModal();
                      }}
                    >
                      Edit
                    </button>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <button
                      className="btn btn-link text-danger"
                      onClick={() => {
                        handleDeleteReview();
                      }}
                    >
                      Delete
                    </button>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : null}
          </Card.Text>
        </Card.Body>
      </Card>
      <EditModal
        showModal={showModal}
        review={review}
        apartment={apartment}
        userToken={userToken}
        getRate={getRate}
        setFormData={setFormData}
        setShowModal={setShowModal}
      />
    </>
  );
}

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Rating } from "react-simple-star-rating";
export default function EditModal({
  showModal,
  review,
  apartment,
  userToken,
  getRate,
  setRefresh,
  refresh,
  setShowModal,
  getReviewData,
}) {
  const handleCloseModal = () => setShowModal(false);
  const { t } = useTranslation();
  const [editedRating, setEditedRating] = useState(0);
  const [editedReview, setEditedReview] = useState("");
  useEffect(() => {
    // old review data
    axios
      .get(`http://localhost:9090/appartments/review/${review._id}`)
      .then((response) => {
        setEditedRating(response.data.Rating);
        setEditedReview(response.data.Description);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [refresh, getReviewData]);

  const handleEditReview = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9090/appartments/reviews/${review._id}`,
        {
          rating: editedRating,
          description: editedReview,
          appartmentId: apartment.id,
        },
        {
          headers: {
            Authorization: `Bearer ${userToken}`, // authentication is required
          },
        }
      );
      const ResData = response.data;
      handleCloseModal();
      setRefresh(refresh + 1);
      getRate();
    } catch (error) {}
  };
  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>{t("Edit review")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditReview();
          }}
        >
          {/* <Form.Group>
            <Form.Label>{t("Rating")} (0-5)</Form.Label>
            <Form.Control
              type="number"
              max="5"
              value={editedRating}
              onChange={(e) => setEditedRating(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">Error</Form.Control.Feedback>
          </Form.Group> */}
          <div className="rate-cont d-flex justify-content-start mb-4">
            <Rating
              initialValue={editedRating}
              transition
              emptyColor="#d7d7d7"
              allowFraction
              size={25}
              onClick={(rate) => {
                setEditedRating(rate);
              }}
              showTooltip
            />
          </div>
          <Form.Group>
            <Form.Control
              as="textarea"
              rows={4}
              minLength={15}
              maxLength={250}
              value={editedReview}
              onChange={(e) => setEditedReview(e.target.value)}
              className="review-textArea"
            />
            <Form.Control.Feedback type="invalid">{t("Error")}</Form.Control.Feedback>
          </Form.Group>
          <div className="d-flex justify-content-center">
            <Button type="submit" className="edit-btn w-25 mt-3">
              {t("SAVE")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

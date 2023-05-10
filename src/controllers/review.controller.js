import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Appartment from "../models/appartment.model.js";

export async function createReview(req, res) {
  try {
    const review = new Review({
      User: req.user.id,
      UserName: req.body.UserName,
      Rating: req.body.Rating,
      Description: req.body.Description,
    });
    const savedReview = await review.save();
    await Appartment.findByIdAndUpdate(req.params.param, {
      $push: { reviews: savedReview._id },
    })
      .then((result) => {
        res.status(201).json(savedReview);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function updateReview(req, res) {
  try {
    const review = await Review.findById(req.params.param);
    const oldRating = parseInt(review.Rating);
    const newRating = parseInt(req.body.rating);
    const apartmentId = req.body.appartmentId;
    const apartment = await Appartment.findById(apartmentId);
    const oldSumOfRatings = parseInt(apartment.sumOfRatings);
    const oldNumOfRatings = parseInt(apartment.numOfRatings);
    const newSumOfRatings = oldSumOfRatings - oldRating + newRating;
    const newNumOfRatings = oldNumOfRatings;
    const newRatingValue =
      newNumOfRatings === 0 ? 0 : Math.round(newSumOfRatings / newNumOfRatings);
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.param,
      { Rating: req.body.rating, Description: req.body.description },
      { new: true }
    )
      .then((result) => {
        res
          .status(201)
          .json({ message: "review updated successfuly !", object: result });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteReview(req, res) {
  try {
    const review = await Review.findByIdAndDelete(req.params.param);
    await Appartment.findByIdAndUpdate(req.body.appartmentId, {
      $pull: { reviews: review._id },
    })
      .then((result) => {
        res.status(200).json({ message: "deleted successfully ! " });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function getAllReviews(req, res) {
  try {
    const appartment = await Appartment.findById(req.params.param)
      .populate("reviews")
      .then((apart) => {
        res.status(200).json(apart.reviews);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to get reviews.");
  }
}

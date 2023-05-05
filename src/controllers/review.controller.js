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
    const apartment = await Appartment.findById(req.params.param);
    // Update total rating and number of reviews for the apartment
    const newSumOfRatings =
      parseInt(apartment.sumOfRatings) + parseInt(req.body.Rating);
    const numberOfRatings = apartment.numOfRatings + 1;
    await Appartment.findByIdAndUpdate(req.params.param, {
      $push: { reviews: savedReview._id },
      sumOfRatings: newSumOfRatings,
      numOfRatings: numberOfRatings,
      rating: Math.round(newSumOfRatings / numberOfRatings),
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
    const updatedReview = await Review.findByIdAndUpdate(
      req.params.param,
      { Rating: req.body.rating, Description: req.body.description },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Review updated successfully!", object: updatedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteReview(req, res) {
  try {
    console.log("trying to update the apart rating", req);
    console.log(req.body.sumOfRatings);
    console.log(req.body.numOfRatings);
    const newRatingValue =
      req.body.sumOfRatings <= 0 || req.body.numOfRatings >= 0
        ? 0
        : Math.round(req.body.sumOfRatings / req.body.numOfRatings);
    const updatedRating = await Appartment.findByIdAndUpdate(req.params.param, {
      sumOfRatings: req.body.sumOfRatings,
      numOfRatings: req.body.numOfRatings,
      rating: newRatingValue,
    });
    console.log("req body", req.body);
    const review = await Review.findByIdAndDelete(req.params.param);
    await Appartment.findByIdAndUpdate(req.body.appartmentId, {
      $pull: { reviews: review._id },
    })
      .then((result) => {
        res
          .status(200)
          .json({ message: "Rating and review deleted successfully!" });
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
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

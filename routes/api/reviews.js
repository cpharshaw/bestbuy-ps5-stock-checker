const router = require("express").Router();
const reviewsController = require("../../controllers/reviewsController");
const db = require("../../models");
const express = require("express");

// Matches with "/api/reviews"
router
  .route("/")
    .get(reviewsController.findAll)
    .post(reviewsController.create);

// Matches with "/api/reviews/:id"
router
  .route("/:id")
    .get(reviewsController.findById)
    .put(reviewsController.update)
    .delete(reviewsController.remove);



module.exports = router;

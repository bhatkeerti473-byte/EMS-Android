const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { isAuthenticated, isAdmin } = require("../middleware/auth");

// Client Routes
router.post("/", isAuthenticated, reviewController.submitReview);
router.post("/upload-images", isAuthenticated, reviewController.uploadReviewImages);
router.get("/client", isAuthenticated, reviewController.getClientReviews);

// Admin Routes
router.get("/admin", isAuthenticated, isAdmin, reviewController.getAllReviews);
router.post("/admin/respond/:reviewId", isAuthenticated, isAdmin, reviewController.adminRespondToReview);

module.exports = router;

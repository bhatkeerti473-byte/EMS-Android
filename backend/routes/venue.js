const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.get("/", adminController.getVenues);
router.get("/available", adminController.getAvailableVenues);
router.get("/:id", adminController.getVenueById);
router.post("/create", adminController.createVenue);

module.exports = router;
const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");

router.use((req, res, next) => {
  console.log("[ADMIN ROUTE]", req.method, req.originalUrl);
  next();
});

// Venue Management
router.get("/venues", adminController.getVenues);
router.post("/venues", adminController.createVenue);
router.post("/venues/upload", adminController.uploadVenueImage);
router.put("/venues/:id", adminController.updateVenue);
router.delete("/venues/:id", adminController.deleteVenue);

//router.get("/venue-menu", adminController.getVenueMenu);
//router.get("/venue-overview", adminController.getVenueOverview);

module.exports = router;
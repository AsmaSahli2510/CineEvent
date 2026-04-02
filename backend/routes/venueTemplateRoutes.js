const express = require("express");

const {
  getVenueTemplates,
  getPublishedVenueTemplatesForOrganizer,
  getPublishedVenueTemplateByIdForOrganizer,
  getVenueTemplateById,
  createVenueTemplate,
  updateVenueTemplate,
  deleteVenueTemplate,
} = require("../controllers/venueTemplateController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/published", protect, getPublishedVenueTemplatesForOrganizer);
router.get(
  "/published/:id",
  protect,
  getPublishedVenueTemplateByIdForOrganizer,
);

router.use(protect, adminOnly);

router.route("/").get(getVenueTemplates).post(createVenueTemplate);
router
  .route("/:id")
  .get(getVenueTemplateById)
  .put(updateVenueTemplate)
  .delete(deleteVenueTemplate);

module.exports = router;

const express = require("express");

const {
  getVenueTemplates,
  getVenueTemplateById,
  createVenueTemplate,
  updateVenueTemplate,
  deleteVenueTemplate,
} = require("../controllers/venueTemplateController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect, adminOnly);

router.route("/").get(getVenueTemplates).post(createVenueTemplate);
router
  .route("/:id")
  .get(getVenueTemplateById)
  .put(updateVenueTemplate)
  .delete(deleteVenueTemplate);

module.exports = router;

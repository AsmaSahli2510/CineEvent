const express = require("express");
const router = express.Router();
const {
  getEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadEventPoster } = require("../middleware/uploadMiddleware");

router.get("/", getEvents);
router.get("/mine", protect, getMyEvents);
router.get("/:id", getEventById);
router.post("/", protect, uploadEventPoster.single("poster"), createEvent);
router.put("/:id", protect, adminOnly, updateEvent);
router.delete("/:id", protect, adminOnly, deleteEvent);

module.exports = router;

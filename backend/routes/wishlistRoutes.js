const express = require("express");
const router = express.Router();
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  isInWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

// All routes require authentication
router.use(protect);

// Get user's wishlist
router.get("/", getWishlist);

// Add event to wishlist
router.post("/:eventId/add", addToWishlist);

// Remove event from wishlist
router.delete("/:eventId/remove", removeFromWishlist);

// Toggle wishlist (add if not present, remove if present)
router.post("/:eventId/toggle", toggleWishlist);

// Check if event is in wishlist
router.get("/:eventId/check", isInWishlist);

module.exports = router;

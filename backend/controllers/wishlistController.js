const User = require("../models/User");
const Event = require("../models/Event");

// Get user's wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user.wishlist || [],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Add event to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if already in wishlist
    if (user.wishlist.includes(eventId)) {
      return res.status(400).json({
        success: false,
        message: "Event already in wishlist",
      });
    }

    // Add to wishlist
    user.wishlist.push(eventId);
    await user.save();

    // Populate and return updated wishlist
    await user.populate("wishlist");

    res.status(200).json({
      success: true,
      message: "Event added to wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove event from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== eventId);
    await user.save();

    // Populate and return updated wishlist
    await user.populate("wishlist");

    res.status(200).json({
      success: true,
      message: "Event removed from wishlist",
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Toggle wishlist (add if not present, remove if present)
exports.toggleWishlist = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const isInWishlist = user.wishlist.includes(eventId);

    if (isInWishlist) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter((id) => id.toString() !== eventId);
    } else {
      // Add to wishlist
      user.wishlist.push(eventId);
    }

    await user.save();

    // Populate and return updated wishlist
    await user.populate("wishlist");

    res.status(200).json({
      success: true,
      message: isInWishlist
        ? "Event removed from wishlist"
        : "Event added to wishlist",
      added: !isInWishlist,
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Check if event is in user's wishlist
exports.isInWishlist = async (req, res) => {
  try {
    const { eventId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isInWishlist = user.wishlist.includes(eventId);

    res.status(200).json({
      success: true,
      isInWishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const User = require("../models/User");
const Reservation = require("../models/Reservation");
const Payout = require("../models/Payout");
const Event = require("../models/Event");

// Admin commission percentage
const ADMIN_COMMISSION_RATE = 10; // 10%

// Helper function to calculate organizer's current balance from reservations
const calculateOrganizerBalance = async (organizerId) => {
  try {
    const events = await Event.find({ organizer: organizerId }).select("_id");
    const eventIds = events.map((e) => e._id);

    // Get all confirmed, paid reservations
    const reservations = await Reservation.find({
      event: { $in: eventIds },
      status: "confirmed",
      paymentStatus: "paid",
    });

    // Calculate total revenue
    const totalRevenue = reservations.reduce((sum, res) => {
      return sum + (res.paidAmount || res.totalPrice || 0);
    }, 0);

    // Calculate organizer's amount (after 10% admin commission)
    const adminCommission = (totalRevenue * ADMIN_COMMISSION_RATE) / 100;
    const organizerAmount = totalRevenue - adminCommission;

    return {
      totalRevenue,
      adminCommission,
      currentBalance: organizerAmount,
      reservationCount: reservations.length,
    };
  } catch (error) {
    console.error("Error calculating balance:", error);
    return {
      totalRevenue: 0,
      adminCommission: 0,
      currentBalance: 0,
      reservationCount: 0,
    };
  }
};

// @desc    Get current organizer's wallet info
// @route   GET /api/wallets/my
// @access  Private
const getMyOrganizerWallet = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const organizer = await User.findById(organizerId).select({
      name: 1,
      email: 1,
      organizerProfile: 1,
      wallet: 1,
      createdAt: 1,
    });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Get events count
    const events = await Event.countDocuments({ organizer: organizerId });

    // Get event IDs
    const eventIds = await Event.find({ organizer: organizerId }).select("_id");

    // Get total reservations
    const reservations = await Reservation.countDocuments({
      event: { $in: eventIds },
    });

    // Get paid reservations count
    const paidReservations = await Reservation.countDocuments({
      event: { $in: eventIds },
      paymentStatus: "paid",
    });

    // Calculate current balance from confirmed, paid reservations
    const balanceData = await calculateOrganizerBalance(organizerId);

    // Get last payout
    const lastPayout = await Payout.findOne({
      organizer: organizerId,
      status: "completed",
    }).sort({ processedAt: -1 });

    // Get pending payouts
    const pendingPayouts = await Payout.countDocuments({
      organizer: organizerId,
      status: "pending",
    });

    res.json({
      organizer: {
        ...organizer.toObject(),
        wallet: {
          ...organizer.wallet.toObject(),
          currentBalance: balanceData.currentBalance,
          totalRevenue: balanceData.totalRevenue,
          adminCommission: balanceData.adminCommission,
        },
        stats: {
          eventsCount: events,
          reservationsCount: reservations,
          paidReservationsCount: paidReservations,
          pendingBalance: balanceData.currentBalance,
          pendingReservations: balanceData.reservationCount,
          totalPendingRevenue: balanceData.totalRevenue,
          pendingPayouts,
        },
        lastPayoutDate: lastPayout?.processedAt || null,
        payoutStatus: lastPayout?.status || "none",
      },
    });
  } catch (error) {
    console.error("Error fetching organizer wallet:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current organizer's earnings summary
// @route   GET /api/wallets/my/earnings
// @access  Private
const getMyEarnings = async (req, res) => {
  try {
    const organizerId = req.user._id;

    // Calculate current balance from confirmed, paid reservations
    const balanceData = await calculateOrganizerBalance(organizerId);

    // Get last payout
    const lastPayout = await Payout.findOne({
      organizer: organizerId,
      status: "completed",
    }).sort({ processedAt: -1 });

    // Get all completed payouts
    const completedPayouts = await Payout.find({
      organizer: organizerId,
      status: "completed",
    });

    const totalPaidOut = completedPayouts.reduce((sum, payout) => {
      return sum + (payout.organizerAmount || 0);
    }, 0);

    res.json({
      earnings: {
        currentBalance: balanceData.currentBalance,
        totalRevenue: balanceData.totalRevenue,
        adminCommission: balanceData.adminCommission,
        organizerWillGet: balanceData.currentBalance,
        totalEarned: totalPaidOut + balanceData.currentBalance,
        totalPaidOut,
        reservationCount: balanceData.reservationCount,
        lastPayoutDate: lastPayout?.processedAt || null,
        lastPayoutAmount: lastPayout?.organizerAmount || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching earnings:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current organizer's payout history
// @route   GET /api/wallets/my/payouts
// @access  Private
const getMyPayoutHistory = async (req, res) => {
  try {
    const organizerId = req.user._id;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Payout.countDocuments({ organizer: organizerId });

    const payouts = await Payout.find({ organizer: organizerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      payouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payout history:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all organizers with their wallet data
// @route   GET /api/wallets/organizers
// @access  Private/Admin
const getAllOrganizersWallet = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "balance",
      status = "all",
    } = req.query;
    const skip = (page - 1) * limit;

    // Get all organizers
    let query = { role: "organizer" };
    if (status === "verified") {
      query["wallet.bankDetailsVerified"] = true;
    } else if (status === "unverified") {
      query["wallet.bankDetailsVerified"] = false;
    }

    const total = await User.countDocuments(query);

    const organizers = await User.find(query)
      .select({
        name: 1,
        email: 1,
        organizerProfile: 1,
        wallet: 1,
        createdAt: 1,
      })
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate balance and get last payout for each organizer
    const organizersWithWallet = await Promise.all(
      organizers.map(async (org) => {
        // Calculate current balance from reservations
        const balanceData = await calculateOrganizerBalance(org._id);

        const lastPayout = await Payout.findOne({
          organizer: org._id,
          status: "completed",
        }).sort({ processedAt: -1 });

        return {
          ...org.toObject(),
          wallet: {
            ...org.wallet.toObject(),
            currentBalance: balanceData.currentBalance,
            totalRevenue: balanceData.totalRevenue,
            pendingReservations: balanceData.reservationCount,
          },
          lastPayoutDate: lastPayout?.processedAt || null,
        };
      }),
    );

    // Sort based on sortBy parameter
    organizersWithWallet.sort((a, b) => {
      const aBalance = a.wallet?.currentBalance || 0;
      const bBalance = b.wallet?.currentBalance || 0;
      return sortBy === "balance_asc"
        ? aBalance - bBalance
        : bBalance - aBalance;
    });

    res.json({
      organizers: organizersWithWallet,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching organizers wallet:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Calculate organizer revenue from reservations
// @route   POST /api/wallets/calculate-revenue
// @access  Private/Admin
const calculateOrganizerRevenue = async (req, res) => {
  try {
    const { organizerId } = req.body;

    // Find all confirmed, paid reservations for this organizer's events
    const events = await Event.find({
      organizer: organizerId,
    });

    if (events.length === 0) {
      return res.status(404).json({ message: "No events found for organizer" });
    }

    const eventIds = events.map((e) => e._id);

    // Get all confirmed, paid reservations
    const reservations = await Reservation.find({
      event: { $in: eventIds },
      status: "confirmed",
      paymentStatus: "paid",
    }).populate("event");

    // Calculate total revenue
    const totalRevenue = reservations.reduce((sum, res) => {
      return sum + (res.paidAmount || res.totalPrice || 0);
    }, 0);

    // Calculate admin commission and organizer amount
    const adminCommission = (totalRevenue * ADMIN_COMMISSION_RATE) / 100;
    const organizerAmount = totalRevenue - adminCommission;

    res.json({
      organizerId,
      totalRevenue,
      adminCommission,
      organizerAmount,
      reservationCount: reservations.length,
      reservationIds: reservations.map((r) => r._id),
    });
  } catch (error) {
    console.error("Error calculating revenue:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get wallet details for a specific organizer
// @route   GET /api/wallets/:organizerId
// @access  Private/Admin
const getOrganizerWallet = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const organizer = await User.findById(organizerId).select({
      name: 1,
      email: 1,
      organizerProfile: 1,
      wallet: 1,
      createdAt: 1,
    });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Get events count
    const events = await Event.countDocuments({ organizer: organizerId });

    // Get event IDs
    const eventIds = await Event.find({ organizer: organizerId }).select("_id");

    // Get total reservations
    const reservations = await Reservation.countDocuments({
      event: { $in: eventIds },
    });

    // Get paid reservations count
    const paidReservations = await Reservation.countDocuments({
      event: { $in: eventIds },
      paymentStatus: "paid",
    });

    // Calculate current balance from confirmed, paid reservations
    const balanceData = await calculateOrganizerBalance(organizerId);

    // Get last payout
    const lastPayout = await Payout.findOne({
      organizer: organizerId,
      status: "completed",
    }).sort({ processedAt: -1 });

    res.json({
      organizer: {
        ...organizer.toObject(),
        wallet: {
          ...organizer.wallet.toObject(),
          currentBalance: balanceData.currentBalance,
          totalRevenue: balanceData.totalRevenue,
          adminCommission: balanceData.adminCommission,
        },
        stats: {
          eventsCount: events,
          reservationsCount: reservations,
          paidReservationsCount: paidReservations,
          pendingBalance: balanceData.currentBalance,
          pendingReservations: balanceData.reservationCount,
          totalPendingRevenue: balanceData.totalRevenue,
        },
        lastPayoutDate: lastPayout?.processedAt || null,
      },
    });
  } catch (error) {
    console.error("Error fetching organizer wallet:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Trigger payout for an organizer
// @route   POST /api/wallets/trigger-payout
// @access  Private/Admin
const triggerPayout = async (req, res) => {
  try {
    const { organizerId, amount, method = "bank_transfer" } = req.body;

    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    // Check if organizer is verified
    if (!organizer.wallet.bankDetailsVerified) {
      return res.status(400).json({
        message: "Organizer bank details are not verified",
      });
    }

    // Check if organizer has IBAN/bank details
    if (!organizer.organizerProfile.iban) {
      return res.status(400).json({
        message: "Organizer bank account details are incomplete",
      });
    }

    // Calculate current balance from reservations
    const balanceData = await calculateOrganizerBalance(organizerId);

    if (balanceData.currentBalance <= 0) {
      return res.status(400).json({
        message: "No pending balance to process payout",
      });
    }

    // Get pending paid confirmed reservations for audit trail
    const events = await Event.find({ organizer: organizerId });
    const eventIds = events.map((e) => e._id);

    const reservations = await Reservation.find({
      event: { $in: eventIds },
      status: "confirmed",
      paymentStatus: "paid",
    });

    // Generate unique transaction reference
    const transactionRef = `PAYOUT-${Date.now()}-${organizerId}`;

    // Create payout record
    const payout = await Payout.create({
      organizer: organizerId,
      amount: balanceData.totalRevenue,
      adminCommission: balanceData.adminCommission,
      organizerAmount: balanceData.currentBalance,
      commissionRate: ADMIN_COMMISSION_RATE,
      status: "completed", // In production, this would be "pending" and need approval
      payoutMethod: method,
      bankAccountDetails: {
        iban: organizer.organizerProfile.iban,
        accountHolder:
          organizer.organizerProfile.organizationName || organizer.name,
      },
      transactionReference: transactionRef,
      processedAt: new Date(),
      reservations: reservations.map((r) => r._id),
    });

    // Update organizer wallet
    organizer.wallet.totalEarnings += balanceData.totalRevenue;
    organizer.wallet.totalPaidOut += balanceData.currentBalance;
    organizer.wallet.currentBalance = 0; // Reset current balance after payout
    organizer.wallet.lastPayoutDate = new Date();
    organizer.wallet.pendingPayoutAmount = 0;
    await organizer.save();

    res.json({
      success: true,
      message: "Payout triggered successfully",
      payout: {
        id: payout._id,
        transactionReference: payout.transactionReference,
        totalAmount: balanceData.totalRevenue,
        adminCommission: balanceData.adminCommission,
        organizerAmount: balanceData.currentBalance,
        status: payout.status,
        processedAt: payout.processedAt,
      },
      organizerUpdated: {
        totalEarnings: organizer.wallet.totalEarnings,
        totalPaidOut: organizer.wallet.totalPaidOut,
        currentBalance: organizer.wallet.currentBalance,
        lastPayoutDate: organizer.wallet.lastPayoutDate,
      },
    });
  } catch (error) {
    console.error("Error triggering payout:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payout history
// @route   GET /api/wallets/payouts/:organizerId
// @access  Private/Admin
const getPayoutHistory = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const total = await Payout.countDocuments({ organizer: organizerId });

    const payouts = await Payout.find({ organizer: organizerId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      payouts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching payout history:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify organizer bank details
// @route   PUT /api/wallets/:organizerId/verify-bank
// @access  Private/Admin
const verifyBankDetails = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { verified } = req.body;

    const organizer = await User.findById(organizerId);
    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    organizer.wallet.bankDetailsVerified = verified;
    await organizer.save();

    res.json({
      message: verified ? "Bank details verified" : "Bank verification removed",
      organizer: {
        id: organizer._id,
        name: organizer.name,
        bankDetailsVerified: organizer.wallet.bankDetailsVerified,
      },
    });
  } catch (error) {
    console.error("Error verifying bank details:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyOrganizerWallet,
  getMyEarnings,
  getMyPayoutHistory,
  getAllOrganizersWallet,
  calculateOrganizerRevenue,
  getOrganizerWallet,
  triggerPayout,
  getPayoutHistory,
  verifyBankDetails,
};

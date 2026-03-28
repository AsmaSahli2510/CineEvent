const User = require("../models/User");
const { generateToken } = require("../utils/helpers");
const { admin, isFirebaseReady } = require("../config/firebase");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const {
  sendPasswordResetEmail,
  sendOrganizerApprovalEmail,
  sendOrganizerRejectionEmail,
} = require("../utils/email");

const ORGANIZER_CHECKLIST_DEFINITIONS = [
  {
    key: "businessRegistrationValid",
    label: "Business registration document is clear and valid",
  },
  {
    key: "representativeIdMatches",
    label: "Representative identity document matches account details",
  },
  {
    key: "ibanVerified",
    label: "IBAN is valid and ownership information is consistent",
  },
  {
    key: "profileInformationComplete",
    label: "Organization profile information is complete and coherent",
  },
];

const normalizeChecklist = (rawChecklist) => {
  const checklistObject =
    rawChecklist && typeof rawChecklist === "object" ? rawChecklist : {};
  return ORGANIZER_CHECKLIST_DEFINITIONS.map((item) => ({
    ...item,
    passed: checklistObject[item.key] === true,
  }));
};

const removeOrganizerUploadedFiles = (legalDocuments = []) => {
  let deletedFilesCount = 0;

  legalDocuments.forEach((doc) => {
    const rawUrl = doc?.url || "";
    const candidateNames = [];

    // Support absolute URLs and plain relative paths saved in DB.
    if (rawUrl) {
      try {
        const parsed = new URL(rawUrl);
        const parsedName = path.basename(parsed.pathname || "");
        if (parsedName) {
          candidateNames.push(decodeURIComponent(parsedName));
        }
      } catch (_error) {
        const fallbackName = path.basename(rawUrl.split("?")[0]);
        if (fallbackName) {
          candidateNames.push(decodeURIComponent(fallbackName));
        }
      }
    }

    // If different formats are present, try unique filenames in order.
    const uniqueNames = [...new Set(candidateNames.filter(Boolean))];
    for (const filename of uniqueNames) {
      const absolutePath = path.join(
        __dirname,
        "..",
        "uploads",
        "legal-docs",
        filename,
      );

      if (fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        deletedFilesCount += 1;
        break;
      }
    }
  });

  return deletedFilesCount;
};

const buildAuthResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  organizerStatus: user.organizerStatus,
  organizerProfile: user.organizerProfile,
  token: generateToken(user._id),
});

const buildPendingOrganizerResponse = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  organizerStatus: user.organizerStatus,
  organizerProfile: user.organizerProfile,
});

// @desc    Register a new spectator
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide name, email and password" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "spectator",
      authProvider: "local",
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Register a new organizer (pending validation)
// @route   POST /api/auth/register-organizer
// @access  Public
const registerOrganizer = async (req, res) => {
  try {
    const legalDocuments = (req.files || []).map((file) => ({
      name: file.originalname,
      url: `${req.protocol}://${req.get("host")}/uploads/legal-docs/${file.filename}`,
      mimeType: file.mimetype,
      size: file.size,
    }));

    const {
      name,
      email,
      password,
      organizationName,
      website,
      shortBio,
      iban,
      legalDocumentName,
    } = req.body;

    if (!name || !email || !password || !organizationName || !iban) {
      return res.status(400).json({
        message:
          "Please provide name, email, password, organization name and IBAN",
      });
    }

    if (legalDocuments.length === 0) {
      return res.status(400).json({
        message: "Please upload at least one legal document",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "organizer",
      organizerStatus: "pending_validation",
      organizerProfile: {
        organizationName,
        website: website || "",
        shortBio: shortBio || "",
        iban,
        legalDocumentName:
          legalDocumentName || legalDocuments.map((doc) => doc.name).join(", "),
        legalDocuments,
      },
      authProvider: "local",
    });

    res.status(201).json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user (spectator, organizer or admin)
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.authProvider === "google") {
      return res.status(400).json({
        message:
          "This account uses Google Sign-In. Please sign in with Google.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (
      user.role === "organizer" &&
      user.organizerStatus === "pending_validation"
    ) {
      return res.status(403).json({
        message:
          "Your organizer application is under admin review. Please wait for the approval email with your access link.",
      });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Sign-In / Sign-Up (verifies Firebase ID token)
// @route   POST /api/auth/google
// @access  Public
const googleAuth = async (req, res) => {
  try {
    if (!isFirebaseReady()) {
      return res.status(503).json({
        message:
          "Google authentication is temporarily unavailable. Please check Firebase Admin configuration.",
      });
    }

    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: "Firebase ID token is required" });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    if (!email) {
      return res.status(400).json({
        message: "Google account did not provide an email address.",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      if (user.authProvider === "local") {
        return res.status(400).json({
          message:
            "An account with this email already exists. Please sign in with your email and password.",
        });
      }

      if (!user.googleId) {
        user.googleId = uid;
      }

      if (user.avatar) {
        user.avatar = "";
      }

      await user.save();
    } else {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        googleId: uid,
        avatar: "",
        role: "spectator",
        authProvider: "google",
      });
    }

    res.json(buildAuthResponse(user));
  } catch (error) {
    if (error.code && error.code.startsWith("auth/")) {
      return res
        .status(401)
        .json({ message: "Invalid or expired Google token" });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.password && user.authProvider === "local") {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json(buildAuthResponse(updatedUser));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request password reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+passwordResetToken +passwordResetExpires",
    );

    // Prevent account enumeration by always returning success message.
    if (!user) {
      return res.json({
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5174";
    const resetUrl = `${frontendBase.replace(/\/$/, "")}/reset-password/${rawToken}`;

    await sendPasswordResetEmail({
      to: user.email,
      name: user.name,
      resetUrl,
    });

    res.json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate reset token
// @route   GET /api/auth/reset-password/:token
// @access  Public
const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("_id");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or expired" });
    }

    res.json({ valid: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reset password by token
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Reset token is required" });
    }

    if (!password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res
        .status(400)
        .json({ message: "Reset link is invalid or expired" });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.json({ message: "Password has been reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending organizers for admin validation queue
// @route   GET /api/auth/admin/pending-organizers
// @access  Private (Admin only)
const getPendingOrganizers = async (req, res) => {
  try {
    const organizers = await User.find({
      role: "organizer",
      organizerStatus: "pending_validation",
    })
      .sort({ createdAt: -1 })
      .select("name email organizerStatus organizerProfile createdAt");

    res.json({ organizers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve organizer and send approval email with verification link
// @route   POST /api/auth/admin/approve-organizer/:organizerId
// @access  Private (Admin only)
const approveOrganizerAndSendEmail = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { checklist, internalNote } = req.body;

    const normalizedChecklist = normalizeChecklist(checklist);
    const missingItems = normalizedChecklist
      .filter((item) => !item.passed)
      .map((item) => item.label);

    if (missingItems.length > 0) {
      return res.status(400).json({
        message: "All checklist items must be validated before approval",
        missingItems,
      });
    }

    const user = await User.findById(organizerId).select(
      "+organizerApprovalToken +organizerApprovalTokenExpires",
    );

    if (!user) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({ message: "User is not an organizer" });
    }

    // Generate approval token (24 hours validity)
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.organizerStatus = "approved";
    user.organizerApprovalToken = hashedToken;
    user.organizerApprovalTokenExpires = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    );
    await user.save();

    // Send approval email with verification link
    const frontendBase = process.env.FRONTEND_URL || "http://localhost:5174";
    const dashboardUrl = `${frontendBase.replace(/\/$/, "")}/organizer-verify/${rawToken}`;

    await sendOrganizerApprovalEmail({
      to: user.email,
      name: user.name,
      dashboardUrl,
      organizationName: user.organizerProfile.organizationName,
      internalNote: (internalNote || "").trim(),
      checklist: normalizedChecklist.map((item) => item.label),
    });

    res.json({
      message: "Organizer approved and email sent successfully",
      organizer: buildAuthResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject organizer, send rejection email, and delete organizer data
// @route   POST /api/auth/admin/reject-organizer/:organizerId
// @access  Private (Admin only)
const rejectOrganizerAndSendEmail = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { checklist, internalNote } = req.body;

    const normalizedChecklist = normalizeChecklist(checklist);
    const missingItems = normalizedChecklist
      .filter((item) => !item.passed)
      .map((item) => item.label);

    if (missingItems.length === 0) {
      return res.status(400).json({
        message:
          "At least one missing checklist item is required for rejection",
      });
    }

    const user = await User.findById(organizerId);
    if (!user) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    if (user.role !== "organizer") {
      return res.status(400).json({ message: "User is not an organizer" });
    }

    await sendOrganizerRejectionEmail({
      to: user.email,
      name: user.name,
      organizationName: user.organizerProfile?.organizationName || "Organizer",
      missingItems,
      internalNote: (internalNote || "").trim(),
    });

    const deletedFilesCount = removeOrganizerUploadedFiles(
      user.organizerProfile?.legalDocuments || [],
    );
    await User.deleteOne({ _id: user._id });

    res.json({
      message:
        "Organizer rejected, email sent, and account deleted successfully",
      deletedFilesCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login organizer via approval verification link
// @route   GET /api/auth/organizer-verify/:token
// @access  Public
const loginViaOrganizerApprovalLink = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res
        .status(400)
        .json({ message: "Verification token is required" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      organizerApprovalToken: hashedToken,
      organizerApprovalTokenExpires: { $gt: new Date() },
      role: "organizer",
      organizerStatus: "approved",
    }).select("+organizerApprovalToken +organizerApprovalTokenExpires");

    if (!user) {
      return res.status(400).json({
        message:
          "Verification link is invalid, expired, or organizer not approved",
      });
    }

    // Keep token valid until expiry so repeated link hits (e.g. retries/dev double requests) still succeed.
    // Organizer access remains controlled by organizerStatus and token expiry.

    res.json(buildAuthResponse(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  registerOrganizer,
  login,
  googleAuth,
  forgotPassword,
  validateResetToken,
  resetPassword,
  getProfile,
  updateProfile,
  getPendingOrganizers,
  approveOrganizerAndSendEmail,
  rejectOrganizerAndSendEmail,
  loginViaOrganizerApprovalLink,
};

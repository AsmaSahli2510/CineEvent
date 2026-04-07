const Event = require("../models/Event");
const { paginate, buildPaginationMeta } = require("../utils/helpers");

const parsePositiveNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

const buildOrganizerEventDocument = (
  payload,
  user,
  uploadedPosterUrl,
  uploadedGalleryUrls = [],
) => {
  const projection = payload?.projection || {};
  const venue = payload?.venue || {};
  const roomConfiguration = payload?.roomConfiguration || {};
  const pricing = payload?.pricing || {};
  const movie = payload?.movie || {};
  const categories = pricing?.categories || {};

  // Dynamically extract category prices
  const categoryPrices = {};
  if (typeof categories === "object" && categories !== null) {
    Object.entries(categories).forEach(([key, value]) => {
      const parsed = parsePositiveNumber(value);
      if (parsed > 0) {
        categoryPrices[key] = parsed;
      }
    });
  }

  const categoryCandidates = Object.values(categoryPrices).filter(
    (value) => value > 0,
  );

  const basePrice = pricing?.isFreeEvent
    ? 0
    : categoryCandidates.length > 0
      ? categoryCandidates[0]
      : parsePositiveNumber(pricing.singlePrice);

  const dateFromIso = projection?.dateTimeIso
    ? new Date(projection.dateTimeIso)
    : null;
  const dateFromSplit =
    projection?.date && projection?.time
      ? new Date(`${projection.date}T${projection.time}`)
      : null;
  const fallbackDate = payload?.submittedAt
    ? new Date(payload.submittedAt)
    : new Date();
  const resolvedDate =
    dateFromIso && !Number.isNaN(dateFromIso.valueOf())
      ? dateFromIso
      : dateFromSplit && !Number.isNaN(dateFromSplit.valueOf())
        ? dateFromSplit
        : fallbackDate;

  const totalSeats = Math.max(
    1,
    parseInt(roomConfiguration.totalSeats || 0, 10) || 1,
  );

  return {
    organizer: user?._id,
    submittedByName:
      payload?.submittedBy?.organizerName || user?.name || "Organizer",
    organizationName:
      payload?.submittedBy?.organizationName ||
      user?.organizerProfile?.organizationName ||
      "",
    movieDetails: {
      title: String(movie.title || "").trim(),
      genre: String(movie.genre || "").trim(),
      durationMinutes: parseInt(movie.durationMinutes || 0, 10) || 0,
      synopsis: String(movie.synopsis || "").trim(),
      director: String(movie.director || "").trim(),
      posterFileName: String(movie.posterFileName || "").trim(),
      posterUrl: String(uploadedPosterUrl || movie.posterUrl || "").trim(),
      posterDataUrl: String(movie.posterDataUrl || "").trim(),
    },
    cinema: String(
      venue.venueTemplateName || venue.location || "Organizer Venue",
    ).trim(),
    hall: String(
      roomConfiguration.venueTemplateName || venue.venueType || "Main Hall",
    ).trim(),
    date: resolvedDate,
    startTime: String(projection.time || "").trim() || "00:00",
    endTime: "",
    totalSeats,
    price: basePrice,
    status: "pending_validation",
    venueDetails: {
      venueTemplateId: String(venue.venueTemplateId || ""),
      venueTemplateName: String(venue.venueTemplateName || ""),
      location: String(venue.location || ""),
      venueType: String(venue.venueType || ""),
    },
    venueSnapshot: {
      screenLabel: String(
        payload?.venueSnapshot?.screenLabel ||
          roomConfiguration?.screenLabel ||
          "SCREEN",
      ),
      rows: Array.isArray(payload?.venueSnapshot?.rows)
        ? payload.venueSnapshot.rows
        : [],
    },
    pricingDetails: {
      currency: String(pricing.currency || "TND"),
      isFreeEvent: Boolean(pricing.isFreeEvent),
      pricingMode: String(pricing.pricingMode || "unique"),
      singlePrice: parsePositiveNumber(pricing.singlePrice),
      categories: categoryPrices,
      serviceFeeRate: Number(pricing.serviceFeeRate || 0),
      serviceFee: Number(pricing.serviceFee || 0),
      spectatorTotal: Number(pricing.spectatorTotal || 0),
    },
    charity: {
      isCharityEvent: Boolean(payload?.charity?.isCharityEvent),
      beneficiaryAssociation: String(
        payload?.charity?.beneficiaryAssociation || "",
      ),
      minimumDonationSuggestion: Number(
        payload?.charity?.minimumDonationSuggestion || 0,
      ),
    },
    media: {
      teaserUrl: String(payload?.media?.teaserUrl || ""),
      galleryImageFileNames: Array.isArray(
        payload?.media?.galleryImageFileNames,
      )
        ? payload.media.galleryImageFileNames
        : [],
      galleryImageUrls:
        Array.isArray(uploadedGalleryUrls) && uploadedGalleryUrls.length > 0
          ? uploadedGalleryUrls
          : [],
    },
  };
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, movie, status, date } = req.query;
    const { skip } = paginate(page, limit);

    const filter = {};
    if (movie) filter.movie = movie;
    if (status) filter.status = status;
    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
    }

    const total = await Event.countDocuments(filter);
    const events = await Event.find(filter)
      .populate("movie", "title poster duration")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: 1 });

    res.json({
      events,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate("movie");
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current organizer events
// @route   GET /api/events/mine
// @access  Private/Organizer/Admin
const getMyEvents = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "organizer" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const filter =
      req.user.role === "organizer" ? { organizer: req.user._id } : {};
    const events = await Event.find(filter).sort({ createdAt: -1 });
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Organizer/Admin
const createEvent = async (req, res) => {
  try {
    if (
      !req.user ||
      (req.user.role !== "organizer" && req.user.role !== "admin")
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    let parsedBody = req.body;
    if (typeof req.body?.payload === "string") {
      try {
        parsedBody = JSON.parse(req.body.payload);
      } catch {
        return res
          .status(400)
          .json({ message: "Invalid event payload format" });
      }
    }

    const posterFile = req.files?.poster?.[0];
    const uploadedPosterUrl = posterFile
      ? `${req.protocol}://${req.get("host")}/uploads/event-posters/${posterFile.filename}`
      : "";

    const galleryFiles = req.files?.gallery || [];
    const uploadedGalleryUrls = galleryFiles.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/uploads/event-posters/${file.filename}`,
    );

    const isOrganizerSubmissionPayload = Boolean(
      parsedBody?.movie && parsedBody?.projection && parsedBody?.venue,
    );
    const payload =
      req.user.role === "organizer" && isOrganizerSubmissionPayload
        ? buildOrganizerEventDocument(
            parsedBody,
            req.user,
            uploadedPosterUrl,
            uploadedGalleryUrls,
          )
        : parsedBody;

    if (req.user.role === "organizer" && !isOrganizerSubmissionPayload) {
      return res
        .status(400)
        .json({ message: "Invalid organizer event payload" });
    }

    const event = await Event.create(payload);
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  getMyEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};

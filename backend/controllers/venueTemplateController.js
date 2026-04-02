const VenueTemplate = require("../models/VenueTemplate");
const { paginate, buildPaginationMeta } = require("../utils/helpers");

const normalizeRows = (rows = []) =>
  (Array.isArray(rows) ? rows : []).map((row) => {
    const seats = Math.max(1, Number(row.seats) || 1);
    const wheelchair = Math.max(
      0,
      Math.min(seats, Number(row.wheelchair) || 0),
    );

    const normalizedSeatOverrides = {};
    const rawOverrides = row.seatOverrides || {};
    Object.entries(rawOverrides).forEach(([seatNumber, seatType]) => {
      const numericSeatNumber = Number(seatNumber);
      if (numericSeatNumber > 0 && numericSeatNumber <= seats) {
        normalizedSeatOverrides[numericSeatNumber] = String(seatType || "");
      }
    });

    return {
      editorId: String(row.editorId || row.id || ""),
      label: String(row.label || "").trim() || "A",
      seats,
      aisleEvery: Math.max(0, Number(row.aisleEvery) || 0),
      zoneId: String(row.zoneId || "standard"),
      wheelchair,
      seatOverrides: normalizedSeatOverrides,
    };
  });

const normalizeStructures = (structures = []) =>
  (Array.isArray(structures) ? structures : []).map((structure) => ({
    editorId: String(structure.editorId || structure.id || ""),
    type: String(structure.type || "lounge"),
    name: String(structure.name || "Structure").trim(),
    side: String(structure.side || "center"),
  }));

const computeStats = (rows = []) => {
  const stats = {
    capacity: 0,
    rows: rows.length,
    wheelchair: 0,
    zones: {},
  };

  rows.forEach((row) => {
    const seatCount = Math.max(1, Number(row.seats) || 1);
    const wheelchairCount = Math.max(
      0,
      Math.min(seatCount, Number(row.wheelchair) || 0),
    );
    const overrides = row.seatOverrides || {};

    for (let seatNumber = 1; seatNumber <= seatCount; seatNumber += 1) {
      let seatType = row.zoneId;
      if (Object.prototype.hasOwnProperty.call(overrides, seatNumber)) {
        seatType = overrides[seatNumber];
      } else if (seatNumber <= wheelchairCount) {
        seatType = "accessible";
      }

      stats.capacity += 1;
      stats.zones[seatType] = (stats.zones[seatType] || 0) + 1;
      if (seatType === "accessible") {
        stats.wheelchair += 1;
      }
    }
  });

  return stats;
};

const buildTemplatePayload = (body) => {
  const rows = normalizeRows(body.rows);
  return {
    name: String(body.name || "").trim(),
    subtitle: String(body.subtitle || "").trim(),
    screenLabel: String(body.screenLabel || "SCREEN").trim(),
    presetId: String(body.presetId || "custom").trim(),
    ambience: String(body.ambience || "dark").trim(),
    covered: Boolean(body.covered),
    rows,
    structures: normalizeStructures(body.structures),
    status: body.status === "published" ? "published" : "draft",
    stats: computeStats(rows),
  };
};

// @desc    Get published venue templates for organizer event creation
// @route   GET /api/venue-templates/published
// @access  Private
const getPublishedVenueTemplatesForOrganizer = async (_req, res) => {
  try {
    const templates = await VenueTemplate.find({ status: "published" })
      .sort({ updatedAt: -1 })
      .select(
        "name subtitle screenLabel ambience covered stats rows structures status updatedAt",
      );

    res.json({ templates });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get one published venue template by ID for organizer preview
// @route   GET /api/venue-templates/published/:id
// @access  Private
const getPublishedVenueTemplateByIdForOrganizer = async (req, res) => {
  try {
    const template = await VenueTemplate.findOne({
      _id: req.params.id,
      status: "published",
    }).select(
      "name subtitle screenLabel ambience covered stats rows structures status updatedAt",
    );

    if (!template) {
      return res
        .status(404)
        .json({ message: "Published venue template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get venue templates
// @route   GET /api/venue-templates
// @access  Private/Admin
const getVenueTemplates = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, q } = req.query;
    const { skip } = paginate(page, limit);

    const filter = {};
    if (status) {
      filter.status = status;
    }
    if (q) {
      filter.name = { $regex: q, $options: "i" };
    }

    const total = await VenueTemplate.countDocuments(filter);
    const templates = await VenueTemplate.find(filter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10))
      .populate("createdBy", "name email role");

    res.json({
      templates,
      pagination: buildPaginationMeta(total, page, limit),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get venue template by ID
// @route   GET /api/venue-templates/:id
// @access  Private/Admin
const getVenueTemplateById = async (req, res) => {
  try {
    const template = await VenueTemplate.findById(req.params.id).populate(
      "createdBy",
      "name email role",
    );

    if (!template) {
      return res.status(404).json({ message: "Venue template not found" });
    }

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create venue template
// @route   POST /api/venue-templates
// @access  Private/Admin
const createVenueTemplate = async (req, res) => {
  try {
    const payload = buildTemplatePayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ message: "Template name is required" });
    }

    const template = await VenueTemplate.create({
      ...payload,
      createdBy: req.user._id,
    });

    res.status(201).json(template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update venue template
// @route   PUT /api/venue-templates/:id
// @access  Private/Admin
const updateVenueTemplate = async (req, res) => {
  try {
    const template = await VenueTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Venue template not found" });
    }

    const payload = buildTemplatePayload(req.body);
    if (!payload.name) {
      return res.status(400).json({ message: "Template name is required" });
    }

    Object.assign(template, payload);
    const updated = await template.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete venue template
// @route   DELETE /api/venue-templates/:id
// @access  Private/Admin
const deleteVenueTemplate = async (req, res) => {
  try {
    const template = await VenueTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Venue template not found" });
    }

    res.json({ message: "Venue template removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getVenueTemplates,
  getPublishedVenueTemplatesForOrganizer,
  getPublishedVenueTemplateByIdForOrganizer,
  getVenueTemplateById,
  createVenueTemplate,
  updateVenueTemplate,
  deleteVenueTemplate,
};

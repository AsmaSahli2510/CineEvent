import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import OrganizerPageFrame from "../../components/organizer/OrganizerPageFrame";
import { getPublishedVenueTemplates } from "../../api/venueTemplateApi";
import { createOrganizerEvent } from "../../api/eventApi";
import MiniVenueMap from "../../components/organizer/MiniVenueMap";

const STEPS = [
  {
    id: 1,
    title: "Event Type",
    subtitle: "Choose between movie or festival",
  },
  {
    id: 2,
    title: "Event Information",
    subtitle: "Core details and poster",
  },
  {
    id: 3,
    title: "Venue and Date",
    subtitle: "Venue selection and screening",
  },
  {
    id: 4,
    title: "Pricing",
    subtitle: "Ticketing, charity, and fees",
  },
  {
    id: 5,
    title: "Media (Optional)",
    subtitle: "Gallery images and teaser",
  },
];

const STEPPER_ITEMS = [
  { id: 1, label: "Type", icon: "category" },
  { id: 2, label: "Info", icon: "movie" },
  { id: 3, label: "Venue", icon: "location_on" },
  { id: 4, label: "Price", icon: "payments" },
  { id: 5, label: "Media", icon: "photo_library" },
];

const CREATE_EVENT_DRAFT_STORAGE_KEY = "organizer_create_event_draft_v1";
const ADMIN_VALIDATION_QUEUE_STORAGE_KEY = "admin_event_validation_queue";
const ORGANIZER_EVENTS_STORAGE_KEY = "organizer_events_store_v1";
const SERVICE_FEE_RATE = 0.075;
const MAX_POSTER_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 8;
const ALLOWED_POSTER_TYPES = ["image/jpeg", "image/png"];
const ALLOWED_GALLERY_TYPES = ["image/jpeg", "image/png", "image/webp"];

const CHARITY_ASSOCIATIONS = [
  "Amal Childhood Association",
  "Tunisian Red Crescent",
  "Insaf Association",
  "SOS Children's Villages Tunisia",
];

const ZONE_CARD_STYLES = {
  standard: "bg-white/70",
  premium: "bg-primary/80",
  vip: "bg-accent",
  accessible: "bg-pmr-green",
  bench: "bg-amber-400",
};

function rowSeatColor(row) {
  const zoneId = String(row?.zoneId || "standard");
  return ZONE_CARD_STYLES[zoneId] || ZONE_CARD_STYLES.standard;
}

function buildCardSeatRows(venue) {
  const rows = Array.isArray(venue?.rowItems) ? venue.rowItems : [];
  return rows.slice(0, 5).map((row, rowIndex) => {
    const seats = Math.max(
      2,
      Math.min(12, Math.ceil((Number(row.seats) || 10) / 2.5)),
    );
    const wheelchairCount = Math.max(
      0,
      Math.min(seats, Number(row.wheelchair || 0)),
    );

    return {
      key: `${venue.id}-row-${row.id || row.label || rowIndex}`,
      rowLabel: row.label || String.fromCharCode(65 + rowIndex),
      seats,
      wheelchairCount,
      seatClass: rowSeatColor(row),
    };
  });
}

function venueImageClass(ambience) {
  if (ambience === "sky") {
    return "from-sky-500/30 via-cyan-400/15 to-background-dark";
  }
  if (ambience === "festival") {
    return "from-primary/35 via-accent/20 to-background-dark";
  }
  return "from-white/15 via-white/5 to-background-dark";
}

const INITIAL_FORM_STATE = {
  eventType: "movie",
  // Movie fields
  movieTitle: "",
  genre: "",
  durationMinutes: "",
  synopsis: "",
  director: "",
  posterFile: null,
  posterPreviewUrl: "",
  // Festival fields
  festivalName: "",
  festivalCategory: "",
  festivalDescription: "",
  festivalStartDate: "",
  festivalEndDate: "",
  festivalPosterFile: null,
  festivalPosterPreviewUrl: "",
  // Common fields
  venueType: "",
  venueTemplateId: "",
  screeningDate: "",
  screeningTime: "",
  pricingMode: "unique",
  isFreeEvent: false,
  singlePrice: "",
  normalPrice: "",
  studentPrice: "",
  seniorPrice: "",
  zonesPrices: {},
  isCharityEvent: false,
  charityAssociation: "",
  minimumDonationSuggestion: "",
  galleryFiles: [],
  galleryPreviewUrls: [],
  teaserUrl: "",
};

function parsePositivePrice(value) {
  if (value === "") {
    return null;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function hasMaxThreeDecimals(value) {
  return /^\d+(\.\d{1,3})?$/.test(String(value));
}

function asTnd(value) {
  return `${value.toFixed(3)} TND`;
}

function toIsoDateTime(date, time) {
  if (!date || !time) {
    return null;
  }
  return new Date(`${date}T${time}`);
}

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [venues, setVenues] = useState([]);
  const [venuesLoading, setVenuesLoading] = useState(true);
  const [venuesError, setVenuesError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [draftSavedAt, setDraftSavedAt] = useState(null);
  const [submitCount, setSubmitCount] = useState(0);
  const hydratedDraftRef = useRef(false);

  const selectedVenue = useMemo(
    () => venues.find((venue) => venue.id === form.venueTemplateId) || null,
    [venues, form.venueTemplateId],
  );

  const getVenueZones = () => {
    if (!selectedVenue || !Array.isArray(selectedVenue.zones)) {
      return [];
    }
    return selectedVenue.zones.map(([zoneId]) => zoneId).sort();
  };

  const baseTicketPrice = useMemo(() => {
    if (form.isFreeEvent) {
      return 0;
    }

    const venueZones = getVenueZones();

    // If there are zones (dynamic pricing), use standard price if available
    if (venueZones.length > 0) {
      // Prefer standard price for spectator preview
      const standardPrice =
        parsePositivePrice(form.zonesPrices["standard"]) || 0;
      if (standardPrice > 0) {
        return standardPrice;
      }

      // Fallback to first available zone price
      for (const zoneId of venueZones) {
        const price = parsePositivePrice(form.zonesPrices[zoneId]) || 0;
        if (price > 0) {
          return price;
        }
      }

      return 0;
    }

    // Otherwise use single price
    if (form.pricingMode === "unique") {
      return parsePositivePrice(form.singlePrice) || 0;
    }

    // Fallback to legacy category pricing
    const candidates = [form.normalPrice, form.studentPrice, form.seniorPrice]
      .map((price) => parsePositivePrice(price) || 0)
      .filter((price) => price > 0);

    if (!candidates.length) {
      return 0;
    }

    return Math.min(...candidates);
  }, [
    form.isFreeEvent,
    form.pricingMode,
    form.singlePrice,
    form.normalPrice,
    form.studentPrice,
    form.seniorPrice,
    form.zonesPrices,
    selectedVenue,
  ]);

  const serviceFee = useMemo(() => {
    if (form.isFreeEvent || baseTicketPrice <= 0) {
      return 0;
    }
    return Number((baseTicketPrice * SERVICE_FEE_RATE).toFixed(3));
  }, [form.isFreeEvent, baseTicketPrice]);

  const spectatorTotal = useMemo(() => {
    if (form.isFreeEvent || baseTicketPrice <= 0) {
      return 0;
    }
    return Number((baseTicketPrice + serviceFee).toFixed(3));
  }, [form.isFreeEvent, baseTicketPrice, serviceFee]);

  useEffect(() => {
    const loadPublishedVenues = async () => {
      try {
        setVenuesLoading(true);
        setVenuesError("");

        const result = await getPublishedVenueTemplates();
        const templates = Array.isArray(result?.templates)
          ? result.templates
          : [];

        const normalized = templates.map((template) => ({
          id: String(template._id),
          name: String(template.name || "Unnamed venue"),
          description: String(template.subtitle || "Admin published venue"),
          type: template.covered ? "Cinema Hall" : "Open Air",
          location: String(template.subtitle || "Admin published venue"),
          ambience: String(template.ambience || "dark"),
          covered: Boolean(template.covered),
          capacity:
            Number(template?.stats?.capacity) > 0
              ? Number(template.stats.capacity)
              : null,
          rows: Number(template?.stats?.rows) || 0,
          screenLabel: String(template?.screenLabel || "SCREEN"),
          zones: Object.entries(template?.stats?.zones || {}),
          rowItems: Array.isArray(template?.rows) ? template.rows : [],
          structureItems: Array.isArray(template?.structures)
            ? template.structures
            : [],
          structures: Array.isArray(template?.structures)
            ? template.structures.length
            : 0,
        }));

        setVenues(normalized);
      } catch (loadError) {
        setVenues([]);
        setVenuesError(
          loadError.message || "Failed to load published admin venues.",
        );
      } finally {
        setVenuesLoading(false);
      }
    };

    loadPublishedVenues();
  }, []);

  useEffect(() => {
    try {
      const rawDraft = localStorage.getItem(CREATE_EVENT_DRAFT_STORAGE_KEY);
      if (!rawDraft) {
        hydratedDraftRef.current = true;
        return;
      }

      const parsedDraft = JSON.parse(rawDraft);
      setForm((previous) => ({
        ...previous,
        ...parsedDraft,
        posterFile: null,
        posterPreviewUrl: "",
        galleryFiles: [],
        galleryPreviewUrls: [],
      }));
      setDraftSavedAt(parsedDraft._savedAt || null);
      hydratedDraftRef.current = true;
    } catch {
      hydratedDraftRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydratedDraftRef.current) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      const payload = {
        ...form,
        posterFile: null,
        posterPreviewUrl: "",
        galleryFiles: [],
        galleryPreviewUrls: [],
        _savedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        CREATE_EVENT_DRAFT_STORAGE_KEY,
        JSON.stringify(payload),
      );
      setDraftSavedAt(payload._savedAt);
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [form]);

  useEffect(() => {
    return () => {
      if (form.posterPreviewUrl) {
        URL.revokeObjectURL(form.posterPreviewUrl);
      }
      form.galleryPreviewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [form.posterPreviewUrl, form.galleryPreviewUrls]);

  const setField = (field, value) => {
    setError("");
    setSuccess("");
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const handleTextInput = (event) => {
    const { name, type, checked, value } = event.target;
    setField(name, type === "checkbox" ? checked : value);
  };

  const handlePriceInput = (event) => {
    const { name, value } = event.target;
    if (value === "" || /^\d*(\.\d{0,3})?$/.test(value)) {
      setField(name, value);
    }
  };

  const handleZonePriceInput = (zoneId, value) => {
    if (value === "" || /^\d*(\.\d{0,3})?$/.test(value)) {
      setForm((previous) => {
        const newZonesPrices = { ...previous.zonesPrices, [zoneId]: value };
        if (value === "") {
          delete newZonesPrices[zoneId];
        }
        return {
          ...previous,
          zonesPrices: newZonesPrices,
        };
      });
      setError("");
      setSuccess("");
    }
  };

  const handlePosterUpload = (event) => {
    const file = event.target.files?.[0] || null;
    setError("");

    if (!file) {
      setForm((previous) => ({
        ...previous,
        posterFile: null,
        posterPreviewUrl: "",
      }));
      return;
    }

    if (!ALLOWED_POSTER_TYPES.includes(file.type)) {
      setError("Invalid poster: only JPG or PNG is allowed.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_POSTER_SIZE_BYTES) {
      setError("Invalid poster: maximum size is 5MB.");
      event.target.value = "";
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    setForm((previous) => {
      if (previous.posterPreviewUrl) {
        URL.revokeObjectURL(previous.posterPreviewUrl);
      }

      return {
        ...previous,
        posterFile: file,
        posterPreviewUrl: nextPreviewUrl,
      };
    });
  };

  const handleGalleryUpload = (event) => {
    const files = Array.from(event.target.files || []);
    setError("");

    if (!files.length) {
      return;
    }

    if (files.length > MAX_GALLERY_IMAGES) {
      setError(`You can upload up to ${MAX_GALLERY_IMAGES} gallery images.`);
      event.target.value = "";
      return;
    }

    for (const file of files) {
      if (!ALLOWED_GALLERY_TYPES.includes(file.type)) {
        setError("Invalid gallery image format. Use JPG, PNG, or WEBP.");
        event.target.value = "";
        return;
      }
      if (file.size > MAX_GALLERY_IMAGE_SIZE_BYTES) {
        setError("Each gallery image must be 5MB or less.");
        event.target.value = "";
        return;
      }
    }

    setForm((previous) => {
      previous.galleryPreviewUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });

      return {
        ...previous,
        galleryFiles: files,
        galleryPreviewUrls: files.map((file) => URL.createObjectURL(file)),
      };
    });
  };

  const validateStep1 = () => {
    if (!form.eventType) {
      return "Event type is required.";
    }
    return "";
  };

  const validateStep2 = () => {
    if (form.eventType === "movie") {
      if (!form.movieTitle.trim()) {
        return "Movie title is required.";
      }
      if (!form.genre.trim()) {
        return "Genre is required.";
      }
      if (!form.durationMinutes || Number(form.durationMinutes) <= 0) {
        return "Movie duration is required.";
      }
      if (!form.synopsis.trim()) {
        return "Synopsis is required.";
      }
      if (!form.director.trim()) {
        return "Director is required.";
      }
      if (!form.posterFile) {
        return "Movie poster (JPG/PNG) is required.";
      }
    } else if (form.eventType === "festival") {
      if (!form.festivalName.trim()) {
        return "Festival name is required.";
      }
      if (!form.festivalCategory.trim()) {
        return "Festival category is required.";
      }
      if (!form.festivalDescription.trim()) {
        return "Festival description is required.";
      }
      if (!form.festivalStartDate) {
        return "Festival start date is required.";
      }
      if (!form.festivalEndDate) {
        return "Festival end date is required.";
      }
      if (form.festivalStartDate > form.festivalEndDate) {
        return "Festival end date must be after start date.";
      }
      if (!form.festivalPosterFile) {
        return "Festival poster (JPG/PNG) is required.";
      }
    }

    return "";
  };

  const validateStep3 = () => {
    if (!venues.length) {
      return "No published admin venues are available right now.";
    }
    if (!form.venueTemplateId) {
      return "Please select a venue created by admin.";
    }
    if (!form.screeningDate || !form.screeningTime) {
      return "Screening date and time are required.";
    }

    const screeningDateTime = toIsoDateTime(
      form.screeningDate,
      form.screeningTime,
    );
    if (!screeningDateTime || Number.isNaN(screeningDateTime.valueOf())) {
      return "Invalid date or time.";
    }
    if (screeningDateTime <= new Date()) {
      return "Screening must be scheduled in the future.";
    }

    return "";
  };

  const validatePriceField = (label, value) => {
    if (!value) {
      return `${label} price is required.`;
    }
    if (!hasMaxThreeDecimals(value)) {
      return `${label} price can have at most 3 decimals.`;
    }
    if (!parsePositivePrice(value)) {
      return `${label} price must be strictly positive.`;
    }
    return "";
  };

  const validateStep4 = () => {
    if (!form.isFreeEvent) {
      const venueZones = getVenueZones();

      // If no zones, validate single price
      if (venueZones.length === 0) {
        const singlePriceError = validatePriceField("Single", form.singlePrice);
        if (singlePriceError) {
          return singlePriceError;
        }
      } else {
        // Validate prices for each zone
        for (const zoneId of venueZones) {
          const zonePrice = form.zonesPrices[zoneId];
          const zoneLabel = zoneId.charAt(0).toUpperCase() + zoneId.slice(1);
          const error = validatePriceField(zoneLabel, zonePrice);
          if (error) {
            return error;
          }
        }
      }
    }

    if (form.isCharityEvent) {
      if (!form.charityAssociation) {
        return "Please select a beneficiary association.";
      }
      if (!form.minimumDonationSuggestion) {
        return "Please add a minimum donation suggestion.";
      }
      if (!hasMaxThreeDecimals(form.minimumDonationSuggestion)) {
        return "Minimum donation can have at most 3 decimals.";
      }
      if (!parsePositivePrice(form.minimumDonationSuggestion)) {
        return "Minimum donation must be strictly positive.";
      }
    }

    return "";
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      return validateStep1();
    }
    if (step === 2) {
      return validateStep2();
    }
    if (step === 3) {
      return validateStep3();
    }
    return validateStep4();
  };

  const handleNextStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setStep((previous) => Math.min(previous + 1, 5));
  };

  const handlePreviousStep = () => {
    setError("");
    setStep((previous) => Math.max(previous - 1, 1));
  };

  const clearDraft = () => {
    localStorage.removeItem(CREATE_EVENT_DRAFT_STORAGE_KEY);
    setDraftSavedAt(null);
  };

  const handleSubmitForValidation = async () => {
    const validators = [
      validateStep1,
      validateStep2,
      validateStep3,
      validateStep4,
    ];
    for (const validator of validators) {
      const possibleError = validator();
      if (possibleError) {
        setError(possibleError);
        return;
      }
    }

    const nowIso = new Date().toISOString();
    const normalizedOrganizerId =
      currentUser?._id || currentUser?.id || "anonymous-organizer";
    const inferredSeatsFromRows = Array.isArray(selectedVenue?.rowItems)
      ? selectedVenue.rowItems.reduce(
          (total, row) => total + Math.max(0, Number(row?.seats) || 0),
          0,
        )
      : 0;
    const resolvedSeatCapacity =
      Number(selectedVenue?.capacity) > 0
        ? Number(selectedVenue.capacity)
        : inferredSeatsFromRows > 0
          ? inferredSeatsFromRows
          : null;
    const inferredWheelchairSeats = Array.isArray(selectedVenue?.rowItems)
      ? selectedVenue.rowItems.reduce(
          (total, row) => total + Math.max(0, Number(row?.wheelchair) || 0),
          0,
        )
      : 0;

    const payload = {
      id: `submission-${Date.now()}`,
      submittedAt: nowIso,
      submittedBy: {
        organizerId: normalizedOrganizerId,
        organizerName: currentUser?.name || "Organizer",
        organizationName:
          currentUser?.organizerProfile?.organizationName || "Organization",
      },
      status: "pending_validation",
      eventType: form.eventType,
      ...(form.eventType === "movie" && {
        movie: {
          title: form.movieTitle.trim(),
          genre: form.genre.trim(),
          durationMinutes: Number(form.durationMinutes),
          synopsis: form.synopsis.trim(),
          director: form.director.trim(),
          posterFileName: form.posterFile?.name || "",
        },
        projection: {
          date: form.screeningDate,
          time: form.screeningTime,
          dateTimeIso: toIsoDateTime(
            form.screeningDate,
            form.screeningTime,
          )?.toISOString(),
        },
      }),
      ...(form.eventType === "festival" && {
        festival: {
          name: form.festivalName.trim(),
          category: form.festivalCategory.trim(),
          description: form.festivalDescription.trim(),
          startDate: form.festivalStartDate,
          endDate: form.festivalEndDate,
          posterFileName: form.festivalPosterFile?.name || "",
        },
      }),
      venue: {
        venueType: selectedVenue?.type || "",
        venueTemplateId: form.venueTemplateId,
        venueTemplateName: selectedVenue?.name || "",
        location: selectedVenue?.location || "",
      },
      venueSnapshot: {
        screenLabel: selectedVenue?.screenLabel || "SCREEN",
        rows: Array.isArray(selectedVenue?.rowItems)
          ? selectedVenue.rowItems
          : [],
      },
      pricing: {
        currency: "TND",
        isFreeEvent: form.isFreeEvent,
        pricingMode: form.pricingMode,
        singlePrice: form.isFreeEvent ? 0 : Number(form.singlePrice || 0),
        categories: (() => {
          if (form.isFreeEvent) {
            return null;
          }

          const venueZones = getVenueZones();
          if (venueZones.length === 0) {
            // No zones: use singlePrice
            return null;
          }

          // Has zones: build categories from zone prices
          const zoneCategories = {};
          venueZones.forEach((zoneId) => {
            zoneCategories[zoneId] = Number(form.zonesPrices[zoneId] || 0);
          });
          return zoneCategories;
        })(),
        serviceFeeRate: SERVICE_FEE_RATE,
        serviceFee,
        spectatorTotal,
      },
      charity: {
        isCharityEvent: form.isCharityEvent,
        beneficiaryAssociation: form.isCharityEvent
          ? form.charityAssociation
          : null,
        minimumDonationSuggestion: form.isCharityEvent
          ? Number(form.minimumDonationSuggestion)
          : null,
      },
      media: {
        teaserUrl: form.teaserUrl ? form.teaserUrl.trim() : "",
        galleryImageFileNames: form.galleryFiles.map((file) => file.name),
      },
      roomConfiguration: {
        source: "admin_venue_template",
        venueTemplateName: selectedVenue?.name || "",
        totalSeats: resolvedSeatCapacity,
        rows: Number(selectedVenue?.rows) || 0,
        wheelchairSeats: inferredWheelchairSeats,
        screenLabel: selectedVenue?.screenLabel || "SCREEN",
      },
    };

    try {
      const posterFile =
        form.eventType === "movie" ? form.posterFile : form.festivalPosterFile;
      await createOrganizerEvent(payload, posterFile, form.galleryFiles);
    } catch (submitError) {
      setError(submitError.message || "Failed to submit event to backend.");
      return;
    }

    const queued = JSON.parse(
      localStorage.getItem(ADMIN_VALIDATION_QUEUE_STORAGE_KEY) || "[]",
    );
    queued.unshift(payload);
    localStorage.setItem(
      ADMIN_VALIDATION_QUEUE_STORAGE_KEY,
      JSON.stringify(queued),
    );

    const organizerEventRecord = {
      id: `event-${Date.now()}`,
      createdAt: nowIso,
      status: payload.status,
      eventType: payload.eventType,
      organizerId: normalizedOrganizerId,
      organizerName: payload.submittedBy.organizerName,
      organizationName: payload.submittedBy.organizationName,
      ...(form.eventType === "movie" && {
        movie: payload.movie,
        projection: payload.projection,
      }),
      ...(form.eventType === "festival" && {
        festival: payload.festival,
      }),
      venue: payload.venue,
      pricing: payload.pricing,
      charity: payload.charity,
      media: payload.media,
      roomConfiguration: payload.roomConfiguration,
    };

    const organizerEvents = JSON.parse(
      localStorage.getItem(ORGANIZER_EVENTS_STORAGE_KEY) || "[]",
    );
    organizerEvents.unshift(organizerEventRecord);
    localStorage.setItem(
      ORGANIZER_EVENTS_STORAGE_KEY,
      JSON.stringify(organizerEvents),
    );

    clearDraft();
    setSubmitCount((previous) => previous + 1);
    setStep(1);
    setForm(INITIAL_FORM_STATE);
    setError("");
    setSuccess(
      "Event submitted for admin validation. It is now pending review.",
    );
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <p className="text-sm text-white/70">
            Choose the type of event you want to create. This will determine
            which fields are available in the following steps.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setField("eventType", "movie")}
              className={`rounded-2xl border-2 p-6 transition-all ${
                form.eventType === "movie"
                  ? "border-accent bg-accent/20"
                  : "border-white/10 bg-background-dark hover:border-accent/50"
              }`}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">
                  {form.eventType === "movie" ? "check_circle" : "movie"}
                </span>
                <div className="text-left">
                  <h3 className="font-black text-white">Movie Event</h3>
                  <p className="text-sm text-white/60">
                    Single movie screening
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setField("eventType", "festival")}
              className={`rounded-2xl border-2 p-6 transition-all ${
                form.eventType === "festival"
                  ? "border-accent bg-accent/20"
                  : "border-white/10 bg-background-dark hover:border-accent/50"
              }`}>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-3xl">
                  {form.eventType === "festival"
                    ? "check_circle"
                    : "celebration"}
                </span>
                <div className="text-left">
                  <h3 className="font-black text-white">Festival Event</h3>
                  <p className="text-sm text-white/60">Multi-day festival</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      if (form.eventType === "movie") {
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-white/80">
                Movie title *
              </span>
              <input
                name="movieTitle"
                value={form.movieTitle}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Ex: Interstellar"
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Genre *
              </span>
              <input
                name="genre"
                value={form.genre}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Science fiction"
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Duration (min) *
              </span>
              <input
                name="durationMinutes"
                value={form.durationMinutes}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                placeholder="120"
                min="1"
                type="number"
              />
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-white/80">
                Synopsis *
              </span>
              <textarea
                name="synopsis"
                value={form.synopsis}
                onChange={handleTextInput}
                className="min-h-28 w-full rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Short story summary"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Director *
              </span>
              <input
                name="director"
                value={form.director}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Christopher Nolan"
                type="text"
              />
            </label>

            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-background-dark/70 p-4">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-white/80">
                    Movie poster (JPG/PNG, max 5MB) *
                  </span>
                  <input
                    accept="image/jpeg,image/png"
                    onChange={handlePosterUpload}
                    className="block w-full rounded-xl border border-dashed border-white/20 bg-background-dark p-3 text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-black file:text-charcoal"
                    type="file"
                  />
                  <p className="text-xs text-white/40">
                    Best result: portrait poster ratio close to 2:3.
                  </p>
                  <p className="text-xs text-white/40">
                    The uploaded image cannot be auto-restored after browser
                    restart.
                  </p>
                </label>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-white/50">
                    Poster preview
                  </p>
                  <div className="mx-auto w-full max-w-[210px]">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/15 bg-charcoal shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                      {form.posterPreviewUrl ? (
                        <img
                          src={form.posterPreviewUrl}
                          alt="Poster preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-background-dark to-accent/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white/70">
                          No poster yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        // Festival event fields
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-white/80">
                Festival name *
              </span>
              <input
                name="festivalName"
                value={form.festivalName}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Ex: International Film Festival"
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Category *
              </span>
              <input
                name="festivalCategory"
                value={form.festivalCategory}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Ex: Film, Music, Art"
                type="text"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Duration (days) - calculated from dates
              </span>
              <div className="h-12 w-full rounded-xl border border-white/10 bg-background-dark/50 px-4 flex items-center text-sm text-white/60">
                {form.festivalStartDate && form.festivalEndDate
                  ? `${Math.ceil(
                      (new Date(form.festivalEndDate) -
                        new Date(form.festivalStartDate)) /
                        (1000 * 60 * 60 * 24),
                    )} days`
                  : "-"}
              </div>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-semibold text-white/80">
                Description *
              </span>
              <textarea
                name="festivalDescription"
                value={form.festivalDescription}
                onChange={handleTextInput}
                className="min-h-28 w-full rounded-xl border border-white/10 bg-background-dark px-4 py-3 text-sm text-white outline-none transition focus:border-accent"
                placeholder="Describe your festival"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Start date *
              </span>
              <input
                name="festivalStartDate"
                value={form.festivalStartDate}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                type="date"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                End date *
              </span>
              <input
                name="festivalEndDate"
                value={form.festivalEndDate}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                type="date"
              />
            </label>

            <div className="md:col-span-2 rounded-2xl border border-white/10 bg-background-dark/70 p-4">
              <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_220px]">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-white/80">
                    Festival poster (JPG/PNG, max 5MB) *
                  </span>
                  <input
                    accept="image/jpeg,image/png"
                    onChange={(event) => {
                      const file = event.target.files?.[0] || null;
                      setError("");

                      if (!file) {
                        setForm((previous) => ({
                          ...previous,
                          festivalPosterFile: null,
                          festivalPosterPreviewUrl: "",
                        }));
                        return;
                      }

                      if (!ALLOWED_POSTER_TYPES.includes(file.type)) {
                        setError("Invalid poster: only JPG or PNG is allowed.");
                        event.target.value = "";
                        return;
                      }

                      if (file.size > MAX_POSTER_SIZE_BYTES) {
                        setError("Invalid poster: maximum size is 5MB.");
                        event.target.value = "";
                        return;
                      }

                      const nextPreviewUrl = URL.createObjectURL(file);
                      setForm((previous) => {
                        if (previous.festivalPosterPreviewUrl) {
                          URL.revokeObjectURL(
                            previous.festivalPosterPreviewUrl,
                          );
                        }

                        return {
                          ...previous,
                          festivalPosterFile: file,
                          festivalPosterPreviewUrl: nextPreviewUrl,
                        };
                      });
                    }}
                    className="block w-full rounded-xl border border-dashed border-white/20 bg-background-dark p-3 text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-black file:text-charcoal"
                    type="file"
                  />
                  <p className="text-xs text-white/40">
                    Best result: portrait poster ratio close to 2:3.
                  </p>
                </label>

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wider text-white/50">
                    Poster preview
                  </p>
                  <div className="mx-auto w-full max-w-[210px]">
                    <div className="relative aspect-[2/3] overflow-hidden rounded-xl border border-white/15 bg-charcoal shadow-[0_20px_40px_rgba(0,0,0,0.35)]">
                      {form.festivalPosterPreviewUrl ? (
                        <img
                          src={form.festivalPosterPreviewUrl}
                          alt="Poster preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/25 via-background-dark to-accent/20 px-4 text-center text-xs font-bold uppercase tracking-wider text-white/70">
                          No poster yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    if (step === 3) {
      return (
        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold text-white/80">
              Choose a published venue *
            </p>
            <p className="mt-1 text-xs text-white/50">
              Organizer access is read-only. You can open any venue in preview
              mode to inspect details and components.
            </p>
          </div>

          {venuesLoading ? (
            <div className="rounded-xl border border-white/10 bg-background-dark p-4 text-sm text-white/55">
              Loading published venues...
            </div>
          ) : null}

          {!venuesLoading && venuesError ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {venuesError}
            </div>
          ) : null}

          {!venuesLoading && !venuesError ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {venues.map((venue) => {
                const isSelected = venue.id === form.venueTemplateId;
                return (
                  <article
                    className={`group overflow-hidden rounded-2xl border bg-charcoal/70 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-all duration-300 ${
                      isSelected
                        ? "border-accent/50"
                        : "border-white/10 hover:-translate-y-1 hover:border-accent/40"
                    }`}
                    key={venue.id}>
                    <div
                      className={`relative border-b border-white/10 bg-gradient-to-br ${venueImageClass(venue.ambience)} p-4`}>
                      <MiniVenueMap
                        rows={venue.rowItems}
                        screenLabel={venue.screenLabel || "SCREEN"}
                      />
                    </div>
                    <div className="space-y-3 p-4">
                      <div>
                        <h4 className="text-sm font-black leading-tight text-white">
                          {venue.name}
                        </h4>
                        <p className="mt-1 line-clamp-2 text-xs text-white/55">
                          {venue.description || "Published venue template"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <button
                          className={`flex-1 rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                            isSelected
                              ? "border-accent/50 bg-accent/20 text-accent"
                              : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                          }`}
                          onClick={() => {
                            const newZonesPrices = {};
                            if (Array.isArray(venue.zones)) {
                              venue.zones.forEach(([zoneId]) => {
                                newZonesPrices[zoneId] = "";
                              });
                            }
                            setForm((previous) => ({
                              ...previous,
                              venueTemplateId: venue.id,
                              venueType: venue.type,
                              zonesPrices: newZonesPrices,
                            }));
                            setError("");
                            setSuccess("");
                          }}
                          type="button">
                          {isSelected ? "Selected" : "Select"}
                        </button>
                        <button
                          className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-white/85 transition-colors hover:bg-white/10"
                          onClick={() => {
                            const params = new URLSearchParams({
                              templateId: venue.id,
                              preview: "1",
                              returnTo: "/organizer/events/create",
                            });
                            navigate(
                              `/organizer/venues/preview?${params.toString()}`,
                            );
                          }}
                          type="button">
                          Open Details
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}

          {!venuesLoading && !venuesError && venues.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/20 bg-background-dark p-4 text-sm text-white/55">
              No published venues available yet.
            </div>
          ) : null}

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Screening date *
              </span>
              <input
                name="screeningDate"
                value={form.screeningDate}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                type="date"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-semibold text-white/80">
                Screening time *
              </span>
              <input
                name="screeningTime"
                value={form.screeningTime}
                onChange={handleTextInput}
                className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                type="time"
              />
            </label>
          </div>

          {selectedVenue && (
            <article className="md:col-span-2 rounded-2xl border border-accent/30 bg-accent/10 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-accent">
                Selected venue
              </p>
              <h4 className="mt-2 text-lg font-black text-white">
                {selectedVenue.name}
              </h4>
              <p className="text-sm text-white/70">
                {selectedVenue.type} - {selectedVenue.location}
                {selectedVenue.capacity
                  ? ` - ${selectedVenue.capacity} seats`
                  : ""}
              </p>
              <p className="mt-1 text-xs text-white/55">
                {selectedVenue.screenLabel} - {selectedVenue.rows} rows -{" "}
                {selectedVenue.structures} structures (read-only admin template)
              </p>
            </article>
          )}
        </div>
      );
    }

    if (step === 4) {
      return (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-background-dark p-4">
              <input
                checked={form.isFreeEvent}
                name="isFreeEvent"
                onChange={(event) => {
                  const checked = event.target.checked;
                  const venueZones = getVenueZones();
                  const clearedZonesPrices = {};
                  if (!checked && venueZones.length > 0) {
                    // Restore empty zone prices when unchecking free event
                    venueZones.forEach((zoneId) => {
                      clearedZonesPrices[zoneId] = "";
                    });
                  }
                  setForm((previous) => ({
                    ...previous,
                    isFreeEvent: checked,
                    singlePrice: checked ? "" : previous.singlePrice,
                    normalPrice: checked ? "" : previous.normalPrice,
                    studentPrice: checked ? "" : previous.studentPrice,
                    seniorPrice: checked ? "" : previous.seniorPrice,
                    zonesPrices:
                      venueZones.length > 0
                        ? checked
                          ? {}
                          : clearedZonesPrices
                        : previous.zonesPrices,
                  }));
                }}
                type="checkbox"
              />
              <span className="text-sm font-semibold text-white">
                Free event
              </span>
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-background-dark p-4">
              <input
                checked={form.isCharityEvent}
                name="isCharityEvent"
                onChange={(event) => {
                  const checked = event.target.checked;
                  setForm((previous) => ({
                    ...previous,
                    isCharityEvent: checked,
                    charityAssociation: checked
                      ? previous.charityAssociation
                      : "",
                    minimumDonationSuggestion: checked
                      ? previous.minimumDonationSuggestion
                      : "",
                  }));
                }}
                type="checkbox"
              />
              <span className="text-sm font-semibold text-white">
                Charity event
              </span>
            </label>
          </div>

          {!form.isFreeEvent && (
            <>
              {(() => {
                const venueZones = getVenueZones();

                if (venueZones.length === 0) {
                  // No zones: show single price field
                  return (
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-white/80">
                          Single price (TND) *
                        </span>
                        <input
                          name="singlePrice"
                          value={form.singlePrice}
                          onChange={handlePriceInput}
                          className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                          placeholder="25.500"
                          type="text"
                        />
                      </label>
                    </div>
                  );
                }

                // Has zones: show price field for each zone
                return (
                  <div>
                    <div className="mb-3">
                      <p className="text-xs uppercase tracking-wider text-white/50">
                        Prices by seat category from venue
                      </p>
                    </div>
                    <div
                      className={`grid gap-4 ${
                        venueZones.length <= 2
                          ? "md:grid-cols-2"
                          : "md:grid-cols-3"
                      }`}>
                      {venueZones.map((zoneId) => (
                        <label key={zoneId} className="space-y-2">
                          <span className="text-sm font-semibold text-white/80">
                            {zoneId.charAt(0).toUpperCase() + zoneId.slice(1)}{" "}
                            (TND) *
                          </span>
                          <input
                            value={form.zonesPrices[zoneId] || ""}
                            onChange={(e) =>
                              handleZonePriceInput(zoneId, e.target.value)
                            }
                            className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                            placeholder="25.000"
                            type="text"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </>
          )}

          {form.isCharityEvent && (
            <div className="grid gap-4 rounded-2xl border border-accent/30 bg-accent/10 p-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">
                  Beneficiary association *
                </span>
                <select
                  name="charityAssociation"
                  value={form.charityAssociation}
                  onChange={handleTextInput}
                  className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent">
                  <option value="">Select an association</option>
                  {CHARITY_ASSOCIATIONS.map((association) => (
                    <option key={association} value={association}>
                      {association}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-semibold text-white">
                  Minimum donation suggestion (TND) *
                </span>
                <input
                  name="minimumDonationSuggestion"
                  value={form.minimumDonationSuggestion}
                  onChange={handlePriceInput}
                  className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
                  placeholder="5.000"
                  type="text"
                />
              </label>
            </div>
          )}

          <article className="rounded-2xl border border-white/10 bg-background-dark/70 p-4">
            <p className="text-xs uppercase tracking-[0.15em] text-white/50">
              Spectator preview
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-white/50">Ticket base</p>
                <p className="mt-1 text-lg font-black text-white">
                  {asTnd(baseTicketPrice)}
                </p>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                <p className="text-xs text-white/50">Service fee</p>
                <p className="mt-1 text-lg font-black text-white">
                  {asTnd(serviceFee)}
                </p>
              </div>
              <div className="rounded-xl border border-accent/40 bg-accent/20 p-3">
                <p className="text-xs text-accent">Spectator total</p>
                <p className="mt-1 text-lg font-black text-white">
                  {asTnd(spectatorTotal)}
                </p>
              </div>
            </div>
          </article>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-background-dark/70 p-4">
            <p className="text-sm font-semibold text-white">Gallery images</p>
            <p className="mt-1 text-xs text-white/50">
              Optional. Add up to {MAX_GALLERY_IMAGES} images (JPG/PNG/WEBP, max
              5MB each).
            </p>
            <input
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleGalleryUpload}
              className="mt-3 block w-full rounded-xl border border-dashed border-white/20 bg-background-dark p-3 text-sm text-white/80 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-3 file:py-2 file:text-xs file:font-black file:text-charcoal"
              type="file"
            />
            <p className="mt-2 text-xs text-white/40">
              Gallery images cannot be auto-restored after browser restart.
            </p>
          </div>

          {form.galleryPreviewUrls.length > 0 && (
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-white/50">
                Gallery preview
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {form.galleryPreviewUrls.map((previewUrl, index) => (
                  <img
                    key={`${previewUrl}-${index}`}
                    src={previewUrl}
                    alt={`Gallery preview ${index + 1}`}
                    className="h-32 w-full rounded-xl border border-white/10 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <label className="space-y-2">
            <span className="text-sm font-semibold text-white/80">
              Teaser URL
            </span>
            <input
              name="teaserUrl"
              value={form.teaserUrl}
              onChange={handleTextInput}
              className="h-12 w-full rounded-xl border border-white/10 bg-background-dark px-4 text-sm text-white outline-none transition focus:border-accent"
              placeholder="https://www.youtube.com/watch?v=..."
              type="url"
            />
            <p className="text-xs text-white/50">
              Optional link to YouTube, Vimeo, or another teaser host.
            </p>
          </label>
        </div>
      );
    }

    return null;
  };

  const stepInfo = STEPS.find((item) => item.id === step);

  return (
    <OrganizerPageFrame
      title="Create Event"
      subtitle="Multi-step workflow aligned with admin review standards">
      <section className="space-y-6">
        <div className="relative mb-2 flex items-center justify-between px-2 md:px-4">
          <div className="absolute left-0 top-1/2 z-0 h-[1px] w-full -translate-y-1/2 bg-white/10" />
          {STEPPER_ITEMS.map((item) => {
            const isReached = step >= item.id;

            return (
              <div
                key={item.id}
                className="relative z-10 flex flex-col items-center gap-2 bg-background-dark px-1 md:px-3">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
                    isReached
                      ? "border-accent bg-accent text-charcoal"
                      : "border-white/10 bg-background-dark text-white/40"
                  }`}>
                  <span className="material-symbols-outlined text-[20px]">
                    {item.icon}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${
                    isReached ? "text-accent" : "text-white/40"
                  }`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-6">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-accent">
                {stepInfo?.title}
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">
                Create event
              </h2>
              <p className="mt-2 text-sm text-white/70">{stepInfo?.subtitle}</p>
            </div>

            {renderStepContent()}

            {error && (
              <div className="mt-5 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200">
                {error}
              </div>
            )}
            {success && (
              <div className="mt-5 rounded-xl border border-green-400/30 bg-green-400/10 p-3 text-sm text-green-200">
                {success}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
              <button
                type="button"
                onClick={handlePreviousStep}
                disabled={step === 1}
                className="rounded-xl border border-white/20 px-4 py-2 text-sm font-bold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40">
                Back
              </button>

              <div className="flex flex-wrap items-center gap-3">
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-xl bg-primary px-5 py-2 text-sm font-black text-white transition hover:brightness-110">
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmitForValidation}
                    className="rounded-xl bg-accent px-5 py-2 text-sm font-black text-charcoal transition hover:brightness-110">
                    Submit for validation
                  </button>
                )}
              </div>
            </div>
          </article>

          <aside className="space-y-4">
            <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-white/50">
                Draft
              </p>
              <p className="mt-2 text-sm text-white/80">
                Auto-save is active{draftSavedAt ? "." : " (waiting...)"}
              </p>
              {draftSavedAt && (
                <p className="mt-2 text-xs text-white/50">
                  Last save: {new Date(draftSavedAt).toLocaleString()}
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  clearDraft();
                  setForm(INITIAL_FORM_STATE);
                  setError("");
                  setSuccess("Draft cleared.");
                  setStep(1);
                }}
                className="mt-4 rounded-lg border border-white/20 px-3 py-2 text-xs font-bold text-white/80 transition hover:bg-white/10">
                Reset draft
              </button>
            </article>

            <article className="rounded-2xl border border-accent/30 bg-accent/10 p-5">
              <p className="text-xs uppercase tracking-[0.15em] text-accent">
                Price controls
              </p>
              <ul className="mt-3 space-y-2 text-sm text-white/85">
                <li>TND pricing with up to 3 decimals.</li>
                <li>
                  Automatic service fee: {(SERVICE_FEE_RATE * 100).toFixed(1)}%.
                </li>
                <li>Real-time spectator total preview.</li>
              </ul>
            </article>

            <article className="overflow-hidden rounded-2xl border border-accent/30">
              <p className="px-5 pt-5 text-[10px] uppercase tracking-[0.15em] text-accent/70 font-bold">
                Event Preview
              </p>

              {/* Card Container */}
              <div className="bg-gradient-to-br from-white/5 to-background-dark/30 p-4 m-5 rounded-xl border border-white/10 shadow-lg overflow-hidden max-h-[600px] overflow-y-auto">
                <div className="group relative overflow-hidden space-y-4">
                  {/* Poster Image Section */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-background-dark border border-white/10">
                    {form.eventType === "movie" && form.posterPreviewUrl ? (
                      <img
                        src={form.posterPreviewUrl}
                        alt="Event poster preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : form.eventType === "festival" &&
                      form.festivalPosterPreviewUrl ? (
                      <img
                        src={form.festivalPosterPreviewUrl}
                        alt="Event poster preview"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 via-background-dark to-accent/15 px-4 text-center">
                        <div className="space-y-2">
                          <span className="material-symbols-outlined text-3xl block text-white/40">
                            image_not_supported
                          </span>
                          <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                            Poster preview
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(6,8,12,0.8)_0%,rgba(6,8,12,0.3)_40%,transparent_70%)]" />

                    {/* Top Badge */}
                    <div className="absolute left-3 right-3 top-3 z-10 flex items-start justify-between gap-2 flex-wrap">
                      {form.isCharityEvent && (
                        <span className="border border-success/40 bg-success/20 px-2 py-0.5 text-[8px] font-black uppercase tracking-wider text-success backdrop-blur-sm rounded-sm">
                          Charity Event
                        </span>
                      )}
                      <span className="border border-white/15 bg-black/35 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.25em] text-white/80 backdrop-blur-sm rounded-sm">
                        {form.eventType === "movie" ? "Movie" : "Festival"}
                      </span>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-3">
                    {/* Title & Genre */}
                    <div>
                      <h3 className="line-clamp-2 text-sm font-black uppercase leading-tight tracking-wide text-white">
                        {form.eventType === "movie"
                          ? form.movieTitle || "Untitled Movie"
                          : form.festivalName || "Untitled Festival"}
                      </h3>
                      {form.eventType === "movie" && form.genre && (
                        <p className="mt-1 text-xs text-accent font-semibold uppercase tracking-wider">
                          {form.genre}
                        </p>
                      )}
                      {form.eventType === "festival" &&
                        form.festivalCategory && (
                          <p className="mt-1 text-xs text-accent font-semibold uppercase tracking-wider">
                            {form.festivalCategory}
                          </p>
                        )}
                    </div>

                    {/* Movie-Specific Details */}
                    {form.eventType === "movie" && (
                      <div className="space-y-2 pt-2 border-t border-white/10">
                        {form.director && (
                          <div className="flex items-start gap-2 text-[10px]">
                            <span className="material-symbols-outlined text-xs text-accent flex-shrink-0 mt-0.5">
                              person
                            </span>
                            <div className="flex-1">
                              <span className="text-white/60 block">
                                Director:
                              </span>
                              <span className="font-semibold text-white">
                                {form.director}
                              </span>
                            </div>
                          </div>
                        )}

                        {form.durationMinutes && (
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="material-symbols-outlined text-xs text-accent flex-shrink-0">
                              schedule
                            </span>
                            <span className="text-white/60">Duration:</span>
                            <span className="font-semibold text-white">
                              {form.durationMinutes} min
                            </span>
                          </div>
                        )}

                        {form.synopsis && (
                          <div className="pt-2 border-t border-white/10">
                            <p className="text-[10px] text-white/60 mb-1">
                              Synopsis:
                            </p>
                            <p className="text-[9px] text-white/75 line-clamp-3 leading-relaxed">
                              {form.synopsis}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Festival-Specific Details */}
                    {form.eventType === "festival" &&
                      form.festivalDescription && (
                        <div className="pt-2 border-t border-white/10">
                          <p className="text-[10px] text-white/60 mb-1">
                            Description:
                          </p>
                          <p className="text-[9px] text-white/75 line-clamp-2 leading-relaxed">
                            {form.festivalDescription}
                          </p>
                        </div>
                      )}

                    {/* Screening Details */}
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      {/* Venue */}
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="material-symbols-outlined text-xs text-accent flex-shrink-0">
                          location_on
                        </span>
                        <span className="text-white/60 flex-shrink-0">
                          Venue:
                        </span>
                        <span className="font-semibold text-white truncate">
                          {selectedVenue?.name || "Not selected"}
                        </span>
                      </div>

                      {/* Date & Time */}
                      {form.eventType === "movie" ? (
                        <>
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="material-symbols-outlined text-xs text-accent flex-shrink-0">
                              event
                            </span>
                            <span className="text-white/60 flex-shrink-0">
                              Date:
                            </span>
                            <span className="font-semibold text-white">
                              {form.screeningDate || "Pending..."}
                            </span>
                          </div>
                          {form.screeningTime && (
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="material-symbols-outlined text-xs text-accent flex-shrink-0">
                                access_time
                              </span>
                              <span className="text-white/60 flex-shrink-0">
                                Time:
                              </span>
                              <span className="font-semibold text-white">
                                {form.screeningTime}
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          {form.festivalStartDate && (
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="material-symbols-outlined text-xs text-accent flex-shrink-0">
                                event
                              </span>
                              <span className="text-white/60 flex-shrink-0">
                                From:
                              </span>
                              <span className="font-semibold text-white">
                                {form.festivalStartDate}
                              </span>
                            </div>
                          )}
                          {form.festivalEndDate && (
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="material-symbols-outlined text-xs text-accent flex-shrink-0">
                                event
                              </span>
                              <span className="text-white/60 flex-shrink-0">
                                To:
                              </span>
                              <span className="font-semibold text-white">
                                {form.festivalEndDate}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Pricing Details */}
                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-[10px]">
                        <span className="material-symbols-outlined text-xs text-primary flex-shrink-0">
                          payments
                        </span>
                        {form.isFreeEvent ? (
                          <>
                            <span className="text-white/60">Free Event</span>
                            <span className="font-black text-success">
                              No Cost
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="text-white/60 flex-shrink-0">
                              Total:
                            </span>
                            <span className="font-black text-primary">
                              {asTnd(spectatorTotal)}
                            </span>
                          </>
                        )}
                      </div>

                      {!form.isFreeEvent &&
                        (() => {
                          const venueZones = getVenueZones();

                          if (venueZones.length > 0) {
                            // Show zone prices
                            return (
                              <div className="space-y-1.5 text-[9px]">
                                {venueZones.map((zoneId) => {
                                  const price = parsePositivePrice(
                                    form.zonesPrices[zoneId],
                                  );
                                  if (!price || price <= 0) return null;

                                  return (
                                    <div
                                      key={zoneId}
                                      className="flex items-center gap-2 px-2 py-1 rounded bg-white/5">
                                      <span className="text-white/60 flex-shrink-0">
                                        {zoneId.charAt(0).toUpperCase() +
                                          zoneId.slice(1)}
                                        :
                                      </span>
                                      <span className="font-semibold text-primary">
                                        {asTnd(price)}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            );
                          }

                          // Show legacy category prices
                          if (form.pricingMode === "byCategory") {
                            return (
                              <div className="space-y-1.5 text-[9px]">
                                {parsePositivePrice(form.normalPrice) > 0 && (
                                  <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5">
                                    <span className="text-white/60 flex-shrink-0">
                                      Normal:
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {asTnd(
                                        parsePositivePrice(form.normalPrice),
                                      )}
                                    </span>
                                  </div>
                                )}
                                {parsePositivePrice(form.studentPrice) > 0 && (
                                  <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5">
                                    <span className="text-white/60 flex-shrink-0">
                                      Student:
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {asTnd(
                                        parsePositivePrice(form.studentPrice),
                                      )}
                                    </span>
                                  </div>
                                )}
                                {parsePositivePrice(form.seniorPrice) > 0 && (
                                  <div className="flex items-center gap-2 px-2 py-1 rounded bg-white/5">
                                    <span className="text-white/60 flex-shrink-0">
                                      Senior:
                                    </span>
                                    <span className="font-semibold text-primary">
                                      {asTnd(
                                        parsePositivePrice(form.seniorPrice),
                                      )}
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          }

                          return null;
                        })()}

                      {!form.isFreeEvent && (
                        <>
                          <div className="text-[9px] flex justify-between px-2 py-1 rounded bg-black/20">
                            <span className="text-white/60">Service Fee:</span>
                            <span className="font-semibold text-accent">
                              {asTnd(serviceFee)}
                            </span>
                          </div>
                          <div className="text-[9px] flex justify-between px-2 py-1 rounded bg-accent/10 border border-accent/20">
                            <span className="text-white/80 font-bold">
                              Spectator Total:
                            </span>
                            <span className="font-black text-primary">
                              {asTnd(spectatorTotal)}
                            </span>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Charity Info */}
                    {form.isCharityEvent && (
                      <div className="space-y-2 pt-3 border-t border-success/20 bg-success/5 rounded-lg p-2.5">
                        <div className="flex items-center gap-2 text-[10px]">
                          <span className="material-symbols-outlined text-xs text-success flex-shrink-0">
                            favorite
                          </span>
                          <span className="text-success/80 flex-shrink-0">
                            Beneficiary:
                          </span>
                          <span className="font-semibold text-success truncate">
                            {form.charityAssociation || "Not selected"}
                          </span>
                        </div>
                        {form.minimumDonationSuggestion && (
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="material-symbols-outlined text-xs text-success flex-shrink-0">
                              monetization_on
                            </span>
                            <span className="text-success/80 flex-shrink-0">
                              Min Donation:
                            </span>
                            <span className="font-semibold text-success">
                              {asTnd(Number(form.minimumDonationSuggestion))}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Media Preview */}
                    {(form.galleryPreviewUrls.length > 0 || form.teaserUrl) && (
                      <div className="space-y-2 pt-3 border-t border-white/10">
                        <p className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                          Media
                        </p>

                        {form.teaserUrl && (
                          <div className="flex items-center gap-2 text-[10px]">
                            <span className="material-symbols-outlined text-xs text-primary flex-shrink-0">
                              play_circle
                            </span>
                            <span className="text-white/60 flex-shrink-0">
                              Teaser:
                            </span>
                            <span className="font-semibold text-white truncate max-w-[150px]">
                              {form.teaserUrl.substring(0, 30)}...
                            </span>
                          </div>
                        )}

                        {form.galleryPreviewUrls.length > 0 && (
                          <div className="pt-2">
                            <p className="text-[9px] text-white/60 mb-1.5">
                              Gallery: {form.galleryPreviewUrls.length} image
                              {form.galleryPreviewUrls.length !== 1 ? "s" : ""}
                            </p>
                            <div className="grid grid-cols-4 gap-1">
                              {form.galleryPreviewUrls
                                .slice(0, 4)
                                .map((url, idx) => (
                                  <div
                                    key={idx}
                                    className="aspect-square rounded border border-white/10 overflow-hidden">
                                    <img
                                      src={url}
                                      alt={`Gallery ${idx + 1}`}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ))}
                              {form.galleryPreviewUrls.length > 4 && (
                                <div className="aspect-square rounded border border-white/10 bg-black/30 flex items-center justify-center text-[8px] font-bold text-white/60">
                                  +{form.galleryPreviewUrls.length - 4}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </article>
          </aside>
        </div>
      </section>
    </OrganizerPageFrame>
  );
}

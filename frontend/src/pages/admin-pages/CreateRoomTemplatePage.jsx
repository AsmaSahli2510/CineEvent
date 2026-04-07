import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  createVenueTemplate,
  getPublishedVenueTemplateById,
  getVenueTemplateById,
  updateVenueTemplate,
} from "../../api/venueTemplateApi";

const ZONES = [
  {
    id: "standard",
    name: "Standard",
    basePrice: 15,
    chipClass: "bg-white text-charcoal",
    seatClass:
      "bg-white/20 border border-white/20 hover:border-white/40 hover:bg-white/30",
    activeClass: "border-white",
    icon: "event_seat",
  },
  {
    id: "premium",
    name: "Premium",
    basePrice: 25,
    chipClass: "bg-primary/30 text-primary",
    seatClass:
      "bg-primary/70 border border-primary/50 hover:border-primary hover:bg-primary",
    activeClass: "border-primary",
    icon: "auto_awesome",
  },
  {
    id: "vip",
    name: "VIP",
    basePrice: 45,
    chipClass: "bg-accent/40 text-accent",
    seatClass:
      "bg-accent border border-accent/70 text-charcoal hover:bg-accent/90",
    activeClass: "border-accent",
    icon: "workspace_premium",
  },
  {
    id: "accessible",
    name: "PMR",
    basePrice: 12,
    chipClass: "bg-pmr-green/30 text-pmr-green",
    seatClass:
      "bg-pmr-green border border-pmr-green/60 text-charcoal hover:bg-pmr-green/90",
    activeClass: "border-pmr-green",
    icon: "accessible",
  },
  {
    id: "bench",
    name: "Bench",
    basePrice: 18,
    chipClass: "bg-amber-500/30 text-amber-300",
    seatClass:
      "bg-amber-600/80 border border-amber-400/60 text-charcoal hover:bg-amber-500",
    activeClass: "border-amber-400",
    icon: "weekend",
  },
];

const VENUE_PRESETS = [
  {
    id: "indoor-cinema",
    name: "Indoor Cinema",
    subtitle: "Classic theater with controlled acoustics",
    screenLabel: "SCREEN",
    ambience: "dark",
    covered: true,
    rows: [
      { label: "A", seats: 16, aisleEvery: 4, zoneId: "premium", wheelchair: 0 },
      { label: "B", seats: 18, aisleEvery: 6, zoneId: "premium", wheelchair: 0 },
      { label: "C", seats: 20, aisleEvery: 5, zoneId: "standard", wheelchair: 0 },
      { label: "D", seats: 22, aisleEvery: 5, zoneId: "standard", wheelchair: 0 },
      { label: "E", seats: 22, aisleEvery: 5, zoneId: "standard", wheelchair: 2 },
      { label: "F", seats: 24, aisleEvery: 6, zoneId: "standard", wheelchair: 2 },
    ],
    structures: [
      {
        id: "s-entrance-main",
        type: "entrance",
        name: "Main Entrance",
        side: "north",
      },
      {
        id: "s-projector",
        type: "projection",
        name: "Projection Booth",
        side: "south",
      },
    ],
  },
  {
    id: "open-air",
    name: "Open Air Theater",
    subtitle: "Outdoor seating under the sky",
    screenLabel: "OUTDOOR STAGE",
    ambience: "sky",
    covered: false,
    rows: [
      { label: "A", seats: 10, aisleEvery: 5, zoneId: "vip", wheelchair: 0 },
      { label: "B", seats: 12, aisleEvery: 6, zoneId: "premium", wheelchair: 0 },
      { label: "C", seats: 14, aisleEvery: 7, zoneId: "premium", wheelchair: 0 },
      { label: "D", seats: 16, aisleEvery: 8, zoneId: "standard", wheelchair: 2 },
      { label: "E", seats: 16, aisleEvery: 8, zoneId: "standard", wheelchair: 2 },
    ],
    structures: [
      { id: "s-food-1", type: "food", name: "Food Truck", side: "west" },
      { id: "s-garden-bar", type: "bar", name: "Garden Bar", side: "east" },
      { id: "s-rain", type: "shelter", name: "Rain Shelter", side: "north" },
    ],
  },
  {
    id: "festival",
    name: "Festival Arena",
    subtitle: "Mixed lounge + seats for event nights",
    screenLabel: "LIVE STAGE",
    ambience: "festival",
    covered: false,
    rows: [
      { label: "A", seats: 18, aisleEvery: 6, zoneId: "vip", wheelchair: 0 },
      { label: "B", seats: 20, aisleEvery: 5, zoneId: "premium", wheelchair: 0 },
      { label: "C", seats: 24, aisleEvery: 6, zoneId: "standard", wheelchair: 2 },
      { label: "D", seats: 24, aisleEvery: 6, zoneId: "standard", wheelchair: 2 },
    ],
    structures: [
      { id: "s-vip-lounge", type: "lounge", name: "VIP Lounge", side: "east" },
      { id: "s-artist", type: "backstage", name: "Backstage", side: "south" },
    ],
  },
  {
    id: "blank",
    name: "Blank Canvas",
    subtitle: "Start from scratch and build your own layout",
    templateName: "Custom Venue Template",
    screenLabel: "SCREEN",
    ambience: "dark",
    covered: true,
    rows: [],
    structures: [],
  },
];

const STRUCTURE_LIBRARY = [
  { type: "entrance", name: "Entrance", icon: "door_front" },
  { type: "exit", name: "Exit", icon: "door_back" },
  { type: "food", name: "Food Area", icon: "local_dining" },
  { type: "bar", name: "Bar", icon: "local_bar" },
  { type: "shelter", name: "Shelter", icon: "roofing" },
  { type: "restroom", name: "Restrooms", icon: "wc" },
  { type: "lounge", name: "Lounge", icon: "weekend" },
  { type: "projection", name: "Projection Booth", icon: "movie" },
  { type: "backstage", name: "Backstage", icon: "theater_comedy" },
];

const SIDES = ["north", "south", "east", "west", "center"];
const STRUCTURE_SIDE_OPTIONS = SIDES.filter((side) => side !== "center");

const AI_TEMPLATE_PRESETS = [
  {
    id: "indoor-basic",
    name: "Indoor Cinema",
    icon: "movie",
    defaults: {
      venueName: "Royal Cinema Hall",
      description: "Elegant indoor cinema for premieres and special screenings",
      screenLabel: "SCREEN",
      ambience: "dark",
      covered: true,
      rows: 10,
      seatsPerRow: 16,
      vipRows: "1-2",
      premiumRows: "3-6",
      standardRows: "7-10",
      benchSeats: "8, 10",
      pmrRow: 10,
      pmrCount: 2,
      components: [
        { type: "entrance", side: "north" },
        { type: "projection", side: "south" },
        { type: "restroom", side: "west" },
      ],
    },
  },
  {
    id: "open-air-basic",
    name: "Open Air",
    icon: "outdoor_garden",
    defaults: {
      venueName: "Open Sky Venue",
      description: "Outdoor cinema venue for summer screenings",
      screenLabel: "OUTDOOR STAGE",
      ambience: "sky",
      covered: false,
      rows: 8,
      seatsPerRow: 14,
      vipRows: "1-2",
      premiumRows: "3-5",
      standardRows: "6-8",
      benchSeats: "7",
      pmrRow: 8,
      pmrCount: 2,
      components: [
        { type: "food", side: "west" },
        { type: "bar", side: "east" },
        { type: "shelter", side: "north" },
      ],
    },
  },
  {
    id: "festival-basic",
    name: "Festival Arena",
    icon: "celebration",
    defaults: {
      venueName: "Festival Arena",
      description: "Festival venue for movie and live event nights",
      screenLabel: "MAIN STAGE",
      ambience: "festival",
      covered: false,
      rows: 12,
      seatsPerRow: 18,
      vipRows: "1-3",
      premiumRows: "4-8",
      standardRows: "9-12",
      benchSeats: "9",
      pmrRow: 12,
      pmrCount: 4,
      components: [
        { type: "entrance", side: "north" },
        { type: "lounge", side: "east" },
        { type: "food", side: "west" },
        { type: "backstage", side: "south" },
      ],
    },
  },
];

function cloneState(value) {
  return JSON.parse(JSON.stringify(value));
}

function rowId(label) {
  return `row-${label}-${Math.random().toString(36).slice(2, 7)}`;
}

function withIds(rows) {
  return rows.map((row) => ({
    ...row,
    id: row.editorId || row.id || rowId(row.label),
    seatOverrides: { ...(row.seatOverrides || {}) },
  }));
}

function mapTemplateToEditorState(template) {
  return {
    presetId: template.presetId || "custom",
    templateName: template.name || "Untitled Template",
    subtitle: template.subtitle || "",
    screenLabel: template.screenLabel || "SCREEN",
    ambience: template.ambience || "dark",
    covered: Boolean(template.covered),
    rows: withIds(template.rows || []),
    structures: (template.structures || []).map((structure) => ({
      ...structure,
      id:
        structure.editorId ||
        structure.id ||
        `s-${Math.random().toString(36).slice(2, 6)}`,
    })),
  };
}

function buildStateFromPreset(preset) {
  return {
    presetId: preset.id,
    templateName: preset.templateName || `${preset.name} Template`,
    subtitle: preset.subtitle,
    screenLabel: preset.screenLabel,
    ambience: preset.ambience,
    covered: preset.covered,
    rows: withIds(preset.rows),
    structures: (preset.structures || []).map((structure) => ({
      ...structure,
      id:
        structure.editorId ||
        structure.id ||
        `s-${Math.random().toString(36).slice(2, 6)}`,
    })),
  };
}

function zoneById(id) {
  return ZONES.find((zone) => zone.id === id) || ZONES[0];
}

function getSeatTypeFromRow(row, seatNumber) {
  if (row?.seatOverrides?.[seatNumber]) {
    return row.seatOverrides[seatNumber];
  }

  if (seatNumber <= (row.wheelchair || 0)) {
    return "accessible";
  }

  return row.zoneId;
}

function pruneSeatOverrides(overrides, seatCount) {
  if (!overrides) {
    return {};
  }

  return Object.entries(overrides).reduce((acc, [seatNumber, seatType]) => {
    if (Number(seatNumber) <= seatCount) {
      acc[seatNumber] = seatType;
    }
    return acc;
  }, {});
}

function nextRowLabel(rows) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const count = rows.length;
  if (count < alphabet.length) {
    return alphabet[count];
  }

  const first = alphabet[Math.floor(count / alphabet.length) - 1] || "A";
  const second = alphabet[count % alphabet.length];
  return `${first}${second}`;
}

function buildAiFormFromTemplate(template) {
  return {
    venueName: template.venueName || "Custom Venue Template",
    description: template.description || "AI-generated venue layout.",
    screenLabel: template.screenLabel || "SCREEN",
    ambience: template.ambience || "dark",
    covered: template.covered ?? true,
    rows: template.rows || 10,
    seatsPerRow: template.seatsPerRow || 12,
    vipRows: template.vipRows || "",
    premiumRows: template.premiumRows || "",
    standardRows: template.standardRows || "",
    benchSeats: template.benchSeats || "",
    pmrRow: template.pmrRow || "",
    pmrCount: template.pmrCount || "",
    components: template.components || [],
  };
}

function formatComponentLabel(type) {
  const item = STRUCTURE_LIBRARY.find((entry) => entry.type === type);
  return item ? item.name : type;
}

function parseBenchSeats(text) {
  return String(text || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((num) => Number.isInteger(num) && num > 0);
}

function parseRowRange(text) {
  const value = String(text || "").trim();
  if (!value) {
    return null;
  }

  const match = value.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!match) {
    return null;
  }

  const start = Number(match[1]);
  const end = Number(match[2]);

  if (!Number.isInteger(start) || !Number.isInteger(end) || start <= 0 || end < start) {
    return null;
  }

  return { start, end };
}

function buildPromptFromForm(form) {
  const lines = [];

  const vipRange = parseRowRange(form.vipRows);
  const premiumRange = parseRowRange(form.premiumRows);
  const standardRange = parseRowRange(form.standardRows);
  const benchSeats = parseBenchSeats(form.benchSeats);

  lines.push(`Create a venue called ${form.venueName}.`);
  lines.push(`Description: ${form.description}.`);
  lines.push(`Use screen label ${form.screenLabel}.`);
  lines.push(
    `Ambience is ${form.ambience} and the venue is ${form.covered ? "covered" : "not covered"}.`,
  );
  lines.push("");
  lines.push(`Generate exactly ${form.rows} rows.`);
  lines.push(`Each row has exactly ${form.seatsPerRow} seats.`);
  lines.push("");

  if (vipRange) {
    lines.push(`Rows ${vipRange.start} to ${vipRange.end} must be VIP.`);
  }

  if (premiumRange) {
    lines.push(`Rows ${premiumRange.start} to ${premiumRange.end} must be premium.`);
  }

  if (standardRange) {
    lines.push(`Rows ${standardRange.start} to ${standardRange.end} must be standard.`);
  }

  if (benchSeats.length) {
    const formattedSeats = benchSeats
      .map((seat) => `seat number ${seat}`)
      .join(" and ");
    lines.push(`${formattedSeats} in every row must be bench using seatOverrides.`);
  }

  if (form.pmrRow && form.pmrCount) {
    lines.push("");
    lines.push(`Only row ${form.pmrRow} may contain wheelchair seats.`);
    lines.push(
      `Row ${form.pmrRow} must contain exactly ${form.pmrCount} wheelchair seats using wheelchair: ${form.pmrCount} and seatOverrides.`,
    );
  }

  if (form.components.length) {
    lines.push("");
    lines.push("Add only these components:");
    form.components.forEach((component) => {
      lines.push(`${formatComponentLabel(component.type)} on ${component.side}.`);
    });
  }

  return lines.join("\n");
}

export default function CreateRoomTemplatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedTemplateId = searchParams.get("templateId");
  const previewOnly = ["1", "true", "yes"].includes(
    String(searchParams.get("preview") || "").toLowerCase(),
  );
  const returnToParam = searchParams.get("returnTo");
  const backHref =
    returnToParam && returnToParam.startsWith("/")
      ? returnToParam
      : previewOnly
        ? "/organizer/events/create"
        : "/admin/dashboard";

  const [editor, setEditor] = useState(() =>
    buildStateFromPreset(VENUE_PRESETS[0]),
  );
  const editorRef = useRef(editor);

  const [selectedRowId, setSelectedRowId] = useState(
    editor.rows[0]?.id || null,
  );
  const [selectedZoneId, setSelectedZoneId] = useState("standard");
  const [selectedStructureId, setSelectedStructureId] = useState(
    editor.structures[0]?.id || null,
  );
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [mode, setMode] = useState(previewOnly ? "preview" : "design");
  const [zoom, setZoom] = useState(90);
  const [notice, setNotice] = useState("");
  const [templateId, setTemplateId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiTab, setAiTab] = useState("templates");
  const [aiForm, setAiForm] = useState(() =>
    buildAiFormFromTemplate(AI_TEMPLATE_PRESETS[0].defaults),
  );

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useEffect(() => {
    if (!requestedTemplateId) {
      return;
    }

    let isMounted = true;

    const loadTemplate = async () => {
      try {
        setIsLoadingTemplate(true);
        const template = previewOnly
          ? await getPublishedVenueTemplateById(requestedTemplateId)
          : await getVenueTemplateById(requestedTemplateId);
        if (!isMounted) {
          return;
        }

        const mapped = mapTemplateToEditorState(template);
        setEditor(mapped);
        setTemplateId(template._id);
        setSelectedRowId(mapped.rows[0]?.id || null);
        setSelectedStructureId(mapped.structures[0]?.id || null);
        setSelectedSeat(null);
        setUndoStack([]);
        setRedoStack([]);
        announce(`Loaded template: ${template.name}`);
      } catch (error) {
        if (!isMounted) {
          return;
        }
        announce(error.message || "Failed to load template.");
      } finally {
        if (isMounted) {
          setIsLoadingTemplate(false);
        }
      }
    };

    loadTemplate();

    return () => {
      isMounted = false;
    };
  }, [requestedTemplateId, previewOnly]);

  const selectedRow = useMemo(
    () => editor.rows.find((row) => row.id === selectedRowId) || null,
    [editor.rows, selectedRowId],
  );

  const selectedStructure = useMemo(
    () =>
      editor.structures.find(
        (structure) => structure.id === selectedStructureId,
      ) || null,
    [editor.structures, selectedStructureId],
  );

  const selectedSeatType = useMemo(() => {
    if (!selectedSeat) {
      return null;
    }

    const row = editor.rows.find((item) => item.id === selectedSeat.rowId);
    if (!row || selectedSeat.number > row.seats) {
      return null;
    }

    return getSeatTypeFromRow(row, selectedSeat.number);
  }, [editor.rows, selectedSeat]);

  const stats = useMemo(() => {
    const summary = {
      capacity: 0,
      rows: editor.rows.length,
      zones: {},
      wheelchair: 0,
    };

    for (const row of editor.rows) {
      for (let seatNumber = 1; seatNumber <= row.seats; seatNumber += 1) {
        const seatType = getSeatTypeFromRow(row, seatNumber);
        summary.capacity += 1;
        summary.zones[seatType] = (summary.zones[seatType] || 0) + 1;
        if (seatType === "accessible") {
          summary.wheelchair += 1;
        }
      }
    }

    return summary;
  }, [editor.rows]);

  const structureGroups = useMemo(() => {
    const initial = {
      north: [],
      south: [],
      east: [],
      west: [],
      center: [],
    };

    editor.structures.forEach((structure) => {
      const side = SIDES.includes(structure.side) ? structure.side : "center";
      initial[side].push(structure);
    });

    return initial;
  }, [editor.structures]);

  const announce = (text) => {
    setNotice(text);
    window.setTimeout(() => {
      setNotice("");
    }, 2200);
  };

  const commit = (updater) => {
    const previous = cloneState(editorRef.current);
    const next = updater(cloneState(editorRef.current));
    setUndoStack((stack) => [...stack, previous]);
    setRedoStack([]);
    setEditor(next);
  };

  const handleUndo = () => {
    setUndoStack((stack) => {
      if (!stack.length) {
        return stack;
      }

      const previous = stack[stack.length - 1];
      setRedoStack((redo) => [...redo, cloneState(editorRef.current)]);
      setEditor(previous);
      return stack.slice(0, -1);
    });
  };

  const handleRedo = () => {
    setRedoStack((stack) => {
      if (!stack.length) {
        return stack;
      }

      const next = stack[stack.length - 1];
      setUndoStack((undo) => [...undo, cloneState(editorRef.current)]);
      setEditor(next);
      return stack.slice(0, -1);
    });
  };

  const applyPreset = (presetId) => {
    const preset = VENUE_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    const nextState = buildStateFromPreset(preset);
    commit(() => nextState);
    setTemplateId(null);
    setSelectedRowId(nextState.rows[0]?.id || null);
    setSelectedStructureId(nextState.structures[0]?.id || null);
    setSelectedSeat(null);
    announce(`Loaded preset: ${preset.name}`);
  };

  const buildTemplatePayload = (status = "draft") => ({
    name: editor.templateName,
    subtitle: editor.subtitle,
    screenLabel: editor.screenLabel,
    presetId: editor.presetId || "custom",
    ambience: editor.ambience,
    covered: editor.covered,
    status,
    rows: editor.rows.map((row) => ({
      editorId: row.id,
      label: row.label,
      seats: row.seats,
      aisleEvery: row.aisleEvery,
      zoneId: row.zoneId,
      wheelchair: row.wheelchair,
      seatOverrides: row.seatOverrides || {},
    })),
    structures: editor.structures.map((structure) => ({
      editorId: structure.id,
      type: structure.type,
      name: structure.name,
      side: structure.side,
    })),
  });

  const updateSelectedRow = (field, value) => {
    if (!selectedRowId) {
      return;
    }

    commit((draft) => {
      draft.rows = draft.rows.map((row) =>
        row.id === selectedRowId
          ? {
              ...row,
              [field]: value,
              wheelchair:
                field === "seats"
                  ? Math.min(row.wheelchair, value)
                  : row.wheelchair,
              seatOverrides:
                field === "seats"
                  ? pruneSeatOverrides(row.seatOverrides, value)
                  : row.seatOverrides,
            }
          : row,
      );
      return draft;
    });
  };

  const updateSelectedSeatType = (seatType) => {
    if (!selectedSeat) {
      return;
    }

    commit((draft) => {
      draft.rows = draft.rows.map((row) => {
        if (row.id !== selectedSeat.rowId || selectedSeat.number > row.seats) {
          return row;
        }

        const nextOverrides = { ...(row.seatOverrides || {}) };
        if (seatType === row.zoneId) {
          delete nextOverrides[selectedSeat.number];
        } else {
          nextOverrides[selectedSeat.number] = seatType;
        }

        return {
          ...row,
          seatOverrides: nextOverrides,
        };
      });

      return draft;
    });
  };

  const clearSelectedSeatOverride = () => {
    if (!selectedSeat) {
      return;
    }

    commit((draft) => {
      draft.rows = draft.rows.map((row) => {
        if (row.id !== selectedSeat.rowId || !row.seatOverrides) {
          return row;
        }

        const nextOverrides = { ...row.seatOverrides };
        delete nextOverrides[selectedSeat.number];
        return { ...row, seatOverrides: nextOverrides };
      });

      return draft;
    });
  };

  const addRow = () => {
    commit((draft) => {
      const label = nextRowLabel(draft.rows);
      const newRow = {
        id: rowId(label),
        label,
        seats: 16,
        aisleEvery: 4,
        zoneId: selectedZoneId,
        wheelchair: 0,
        seatOverrides: {},
      };
      draft.rows.push(newRow);
      setSelectedRowId(newRow.id);
      setSelectedSeat(null);
      return draft;
    });
  };

  const duplicateRow = () => {
    if (!selectedRow) {
      return;
    }

    commit((draft) => {
      const index = draft.rows.findIndex((row) => row.id === selectedRow.id);
      if (index < 0) {
        return draft;
      }

      const label = nextRowLabel(draft.rows);
      const copy = {
        ...draft.rows[index],
        id: rowId(label),
        label,
        seatOverrides: { ...(draft.rows[index].seatOverrides || {}) },
      };
      draft.rows.splice(index + 1, 0, copy);
      setSelectedRowId(copy.id);
      setSelectedSeat(null);
      return draft;
    });
  };

  const removeRow = () => {
    if (!selectedRowId || editor.rows.length <= 1) {
      return;
    }

    const remaining = editor.rows.filter((row) => row.id !== selectedRowId);

    commit((draft) => {
      draft.rows = draft.rows.filter((row) => row.id !== selectedRowId);
      return draft;
    });

    setSelectedRowId(remaining[0]?.id || null);
    if (selectedSeat?.rowId === selectedRowId) {
      setSelectedSeat(null);
    }
  };

  const addStructure = (item) => {
    commit((draft) => {
      const newStructure = {
        id: `s-${item.type}-${Math.random().toString(36).slice(2, 6)}`,
        type: item.type,
        name: item.name,
        side: "center",
      };
      draft.structures.push(newStructure);
      setSelectedStructureId(newStructure.id);
      return draft;
    });
  };

  const updateSelectedStructure = (field, value) => {
    if (!selectedStructureId) {
      return;
    }

    commit((draft) => {
      draft.structures = draft.structures.map((structure) =>
        structure.id === selectedStructureId
          ? { ...structure, [field]: value }
          : structure,
      );
      return draft;
    });
  };

  const removeStructure = () => {
    if (!selectedStructureId) {
      return;
    }

    const remaining = editor.structures.filter(
      (structure) => structure.id !== selectedStructureId,
    );

    commit((draft) => {
      draft.structures = draft.structures.filter(
        (structure) => structure.id !== selectedStructureId,
      );
      return draft;
    });

    setSelectedStructureId(remaining[0]?.id || null);
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      announce("Please write a prompt for AI generation.");
      return;
    }

    try {
      setIsGeneratingAI(true);

      const res = await fetch("/api/ai/generate-layout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: aiPrompt.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "AI generation failed.");
      }

      const rowsWithIds = withIds(data.rows || []);
      const structuresWithIds = (data.structures || []).map((structure) => ({
        ...structure,
        id:
          structure.editorId ||
          structure.id ||
          `s-${Math.random().toString(36).slice(2, 6)}`,
      }));

      commit((draft) => {
        draft.presetId = "custom";
        draft.templateName = data.name || draft.templateName;
        draft.subtitle = data.subtitle || draft.subtitle;
        draft.screenLabel = data.screenLabel || draft.screenLabel;
        draft.ambience = data.ambience || draft.ambience;
        draft.covered =
          typeof data.covered === "boolean" ? data.covered : draft.covered;
        draft.rows = rowsWithIds;
        draft.structures = structuresWithIds;
        return draft;
      });

      setTemplateId(null);
      setSelectedRowId(rowsWithIds[0]?.id || null);
      setSelectedStructureId(structuresWithIds[0]?.id || null);
      setSelectedSeat(null);
      setIsAiOpen(false);
      announce("AI venue generated successfully.");
    } catch (error) {
      console.error("AI generation error:", error);
      announce(error.message || "AI generation failed.");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const applyAiTemplatePreset = (presetId) => {
    const preset = AI_TEMPLATE_PRESETS.find((item) => item.id === presetId);
    if (!preset) {
      return;
    }

    const nextForm = buildAiFormFromTemplate(preset.defaults);
    setAiForm(nextForm);
    setAiTab("templates");
    announce(`Loaded AI template: ${preset.name}`);
  };

  const updateAiForm = (field, value) => {
    setAiForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addAiComponent = () => {
    setAiForm((prev) => ({
      ...prev,
      components: [...prev.components, { type: "entrance", side: "north" }],
    }));
  };

  const updateAiComponent = (index, field, value) => {
    setAiForm((prev) => ({
      ...prev,
      components: prev.components.map((component, componentIndex) =>
        componentIndex === index
          ? { ...component, [field]: value }
          : component,
      ),
    }));
  };

  const removeAiComponent = (index) => {
    setAiForm((prev) => ({
      ...prev,
      components: prev.components.filter(
        (_, componentIndex) => componentIndex !== index,
      ),
    }));
  };

  const convertFormToPrompt = () => {
    const prompt = buildPromptFromForm(aiForm);
    setAiPrompt(prompt);
    setAiTab("prompt");
    announce("Template converted to prompt.");
  };

  const saveTemplate = async () => {
    if (!editor.templateName?.trim()) {
      announce("Template name is required before saving.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = buildTemplatePayload("draft");
      const saved = templateId
        ? await updateVenueTemplate(templateId, payload)
        : await createVenueTemplate(payload);

      setTemplateId(saved._id);
      announce("Template saved to database.");
    } catch (error) {
      announce(error.message || "Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  const publishTemplate = async () => {
    if (!editor.templateName?.trim()) {
      announce("Template name is required before publishing.");
      return;
    }

    try {
      setIsSaving(true);
      const payload = buildTemplatePayload("published");
      const published = templateId
        ? await updateVenueTemplate(templateId, payload)
        : await createVenueTemplate(payload);

      setTemplateId(published._id);
      announce("Template published to database.");
      window.setTimeout(() => {
        navigate("/admin/venues/templates");
      }, 350);
    } catch (error) {
      announce(error.message || "Failed to publish template.");
    } finally {
      setIsSaving(false);
    }
  };

  const ambientClass =
    editor.ambience === "sky"
      ? "bg-gradient-to-b from-sky-900/30 via-background-dark to-background-dark"
      : editor.ambience === "festival"
        ? "bg-gradient-to-b from-primary/25 via-background-dark to-background-dark"
        : "bg-background-dark";

  const isPreview = mode === "preview";

  return (
    <>
      <style>{`
        .room-template-page {
          font-family: 'Spline Sans', sans-serif;
          background-color: #1C1C1C;
        }

        .room-template-page .seat-grid {
          background-image:
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .room-template-page .sky-particles::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255,255,255,0.2) 1px, transparent 1px),
            radial-gradient(circle at 70% 30%, rgba(245,192,101,0.3) 1px, transparent 1px),
            radial-gradient(circle at 40% 75%, rgba(255,255,255,0.15) 1px, transparent 1px);
          background-size: 160px 160px;
          pointer-events: none;
          opacity: 0.6;
        }

        .room-template-page .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .room-template-page .custom-scrollbar::-webkit-scrollbar-track {
          background: #1C1C1C;
        }

        .room-template-page .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #333;
          border-radius: 10px;
        }

        .room-template-page select,
        .room-template-page select option,
        .room-template-page select optgroup {
          background-color: #232323;
          color: #f5f5f5;
        }

        .room-template-page textarea::placeholder,
        .room-template-page input::placeholder {
          color: rgba(255,255,255,0.35);
        }
      `}</style>

      <div className="room-template-page text-white overflow-hidden h-screen flex flex-col bg-background-dark">
        <header className="h-14 border-b border-white/10 bg-charcoal flex items-center justify-between px-3 lg:px-5 z-20">
          <div className="flex items-center gap-4 lg:gap-6 min-w-0">
            <Link className="flex items-center gap-2" to={backHref}>
              <span className="material-symbols-outlined text-accent">
                movie_filter
              </span>
              <h1 className="text-xs lg:text-sm font-black tracking-tighter uppercase whitespace-nowrap">
                CINEADMIN{" "}
                <span className="text-white/40 ml-2 font-normal">
                  | {previewOnly ? "Preview" : "Editor"}
                </span>
              </h1>
            </Link>
            <div className="h-6 w-px bg-white/10 hidden lg:block" />
            <div className="hidden md:block min-w-0">
              <h2 className="text-sm font-bold text-white truncate">
                {editor.templateName}
              </h2>
              <p className="text-[10px] text-white/40">{editor.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            {previewOnly ? null : (
              <div className="hidden md:flex bg-white/5 rounded-lg p-1">
                <button
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 ${
                    mode === "design"
                      ? "bg-accent text-charcoal"
                      : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => setMode("design")}
                  type="button">
                  <span className="material-symbols-outlined text-sm">
                    design_services
                  </span>
                  Design
                </button>
                <button
                  className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 ${
                    mode === "preview"
                      ? "bg-accent text-charcoal"
                      : "text-white/60 hover:text-white"
                  }`}
                  onClick={() => setMode("preview")}
                  type="button">
                  <span className="material-symbols-outlined text-sm">
                    visibility
                  </span>
                  Preview
                </button>
              </div>
            )}

            {isPreview ? null : (
              <>
                <button
                  className="px-3 lg:px-5 py-2 bg-primary/20 border border-primary/40 text-accent rounded-lg text-xs font-bold hover:bg-primary transition-all"
                  disabled={isSaving || isLoadingTemplate}
                  onClick={saveTemplate}
                  type="button">
                  {isSaving ? "SAVING..." : "SAVE"}
                </button>
                <Link
                  className="px-3 lg:px-5 py-2 bg-white/5 border border-white/10 text-white rounded-lg text-xs font-black hover:bg-white/10 transition-all"
                  to="/admin/venues/templates">
                  CANCEL
                </Link>
                <button
                  className="px-3 lg:px-5 py-2 bg-accent text-charcoal rounded-lg text-xs font-black hover:opacity-90 transition-all"
                  disabled={isSaving || isLoadingTemplate}
                  onClick={publishTemplate}
                  type="button">
                  {isSaving ? "PUBLISHING..." : "PUBLISH"}
                </button>
              </>
            )}

            {isLoadingTemplate ? (
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent/80">
                Loading template...
              </span>
            ) : null}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {isPreview ? null : (
            <aside className="w-14 lg:w-56 border-r border-white/5 bg-charcoal flex flex-col p-2 lg:p-4 overflow-y-auto custom-scrollbar">
              <div className="mb-6">
                <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-3 hidden lg:block">
                  Venue Preset
                </h3>
                <div className="space-y-1.5">
                  {VENUE_PRESETS.map((preset) => {
                    const active = preset.id === editor.presetId;
                    return (
                      <button
                        key={preset.id}
                        className={`w-full p-2 rounded-lg border text-left transition-all ${
                          active
                            ? "border-accent bg-accent/10"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        }`}
                        onClick={() => applyPreset(preset.id)}
                        type="button">
                        <p className="text-[11px] font-bold text-white leading-none hidden lg:block">
                          {preset.name}
                        </p>
                        <p className="text-[9px] text-white/50 mt-0.5 hidden lg:block">
                          {preset.subtitle}
                        </p>
                        <span className="material-symbols-outlined text-[18px] text-white/70 lg:hidden">
                          {preset.id === "open-air"
                            ? "outdoor_garden"
                            : "stadium"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-3 hidden lg:block">
                  Zone Painter
                </h3>
                <div className="space-y-1.5">
                  {ZONES.map((zone) => (
                    <button
                      key={zone.id}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg border transition-all ${
                        selectedZoneId === zone.id
                          ? `${zone.activeClass} bg-white/10`
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        if (selectedSeat) {
                          updateSelectedSeatType(zone.id);
                        } else if (selectedRow) {
                          updateSelectedRow("zoneId", zone.id);
                        }
                      }}
                      type="button">
                      <span className="material-symbols-outlined text-white/80 text-[15px]">
                        {zone.icon}
                      </span>
                      <div className="hidden lg:block text-left">
                        <p className="text-[11px] font-bold text-white leading-none">
                          {zone.name}
                        </p>
                        <p className="text-[9px] text-white/40 mt-0.5">
                          ${zone.basePrice} base
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-3 hidden lg:block">
                  Add Components
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-1.5">
                  {STRUCTURE_LIBRARY.map((item) => (
                    <button
                      key={item.type}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg flex flex-col items-center justify-center gap-0.5 hover:bg-white/10"
                      onClick={() => addStructure(item)}
                      type="button">
                      <span className="material-symbols-outlined text-white/70 text-base">
                        {item.icon}
                      </span>
                      <span className="text-[8px] font-bold text-white/60 uppercase hidden lg:block">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          )}

          <main
            className={`flex-1 relative overflow-auto custom-scrollbar seat-grid ${ambientClass} ${
              editor.ambience === "sky" ? "sky-particles" : ""
            }`}>
            <div
              className="min-w-[860px] min-h-[760px] p-8 lg:p-10 flex flex-col items-center relative"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: "top center",
              }}>
              <div className="w-2/3 h-4 bg-gradient-to-b from-accent/40 to-transparent rounded-full mb-16 relative flex items-center justify-center">
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 text-[10px] font-black text-accent tracking-[0.45em] uppercase whitespace-nowrap">
                  {editor.screenLabel}
                </div>
              </div>

              {editor.covered ? null : (
                <div className="mb-6 rounded-full bg-sky-300/10 border border-sky-200/20 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-sky-200">
                  Open sky mode active
                </div>
              )}

              {structureGroups.north.length ? (
                <div className="mb-5 flex w-full max-w-3xl flex-wrap items-center justify-center gap-1.5">
                  {structureGroups.north.map((structure) => {
                    const structureMeta =
                      STRUCTURE_LIBRARY.find(
                        (item) => item.type === structure.type,
                      ) || STRUCTURE_LIBRARY[0];
                    return (
                      <button
                        key={structure.id}
                        className={`px-2.5 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-all ${
                          !isPreview && selectedStructureId === structure.id
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                        disabled={isPreview}
                        onClick={() => {
                          if (isPreview) return;
                          setSelectedStructureId(structure.id);
                        }}
                        type="button">
                        <span className="material-symbols-outlined text-sm">
                          {structureMeta.icon}
                        </span>
                        {structure.name}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className="relative w-full max-w-3xl">
                {structureGroups.west.length ? (
                  <div className="absolute right-full top-1/2 mr-3 flex -translate-y-1/2 flex-col items-end gap-1.5">
                    {structureGroups.west.map((structure) => {
                      const structureMeta =
                        STRUCTURE_LIBRARY.find(
                          (item) => item.type === structure.type,
                        ) || STRUCTURE_LIBRARY[0];
                      return (
                        <button
                          key={structure.id}
                          className={`px-2.5 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-all ${
                            !isPreview && selectedStructureId === structure.id
                              ? "border-accent bg-accent/15 text-accent"
                              : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                          disabled={isPreview}
                          onClick={() => {
                            if (isPreview) return;
                            setSelectedStructureId(structure.id);
                          }}
                          type="button">
                          <span className="material-symbols-outlined text-sm">
                            {structureMeta.icon}
                          </span>
                          {structure.name}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                {structureGroups.east.length ? (
                  <div className="absolute left-full top-1/2 ml-3 flex -translate-y-1/2 flex-col items-start gap-1.5">
                    {structureGroups.east.map((structure) => {
                      const structureMeta =
                        STRUCTURE_LIBRARY.find(
                          (item) => item.type === structure.type,
                        ) || STRUCTURE_LIBRARY[0];
                      return (
                        <button
                          key={structure.id}
                          className={`px-2.5 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-all ${
                            !isPreview && selectedStructureId === structure.id
                              ? "border-accent bg-accent/15 text-accent"
                              : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                          disabled={isPreview}
                          onClick={() => {
                            if (isPreview) return;
                            setSelectedStructureId(structure.id);
                          }}
                          type="button">
                          <span className="material-symbols-outlined text-sm">
                            {structureMeta.icon}
                          </span>
                          {structure.name}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div className="space-y-2.5 w-full max-w-3xl">
                  {editor.rows.map((row) => {
                    const zone = zoneById(row.zoneId);
                    const seatNodes = [];

                    for (
                      let seatIndex = 1;
                      seatIndex <= row.seats;
                      seatIndex += 1
                    ) {
                      const seatType = getSeatTypeFromRow(row, seatIndex);
                      const seatZone = zoneById(seatType);
                      const isAccessible = seatType === "accessible";
                      const isBench = seatType === "bench";
                      const isSelectedSeat =
                        selectedSeat?.rowId === row.id &&
                        selectedSeat?.number === seatIndex;

                      seatNodes.push(
                        <button
                          key={`${row.id}-seat-${seatIndex}`}
                          className={`w-6 h-6 rounded-t-md text-[9px] font-bold transition-all ${seatZone.seatClass} ${
                            isSelectedSeat ? "ring-2 ring-white" : ""
                          } ${mode === "preview" ? "opacity-85" : ""}`}
                          disabled={isPreview}
                          onClick={(event) => {
                            if (isPreview) return;
                            event.stopPropagation();
                            setSelectedRowId(row.id);
                            setSelectedSeat({
                              rowId: row.id,
                              number: seatIndex,
                            });
                          }}
                          type="button">
                          {isAccessible ? (
                            <span className="material-symbols-outlined text-[10px] leading-none">
                              accessible
                            </span>
                          ) : isBench ? (
                            <span className="material-symbols-outlined text-[10px] leading-none">
                              weekend
                            </span>
                          ) : (
                            seatIndex
                          )}
                        </button>,
                      );

                      if (
                        row.aisleEvery > 0 &&
                        seatIndex < row.seats &&
                        seatIndex % row.aisleEvery === 0
                      ) {
                        seatNodes.push(
                          <div
                            key={`${row.id}-aisle-${seatIndex}`}
                            className="w-4 border-t border-dashed border-white/20"
                          />,
                        );
                      }
                    }

                    return (
                      <div
                        key={row.id}
                        className={`w-full flex items-center gap-3 rounded-xl px-2.5 py-1.5 transition-all border ${
                          !isPreview && selectedRowId === row.id
                            ? "border-accent/60 bg-accent/10"
                            : isPreview
                              ? "border-transparent"
                              : "border-transparent hover:border-white/15 hover:bg-white/5"
                        }`}
                        onClick={() => {
                          if (isPreview) return;
                          setSelectedRowId(row.id);
                          setSelectedSeat(null);
                        }}>
                        <span className="text-xs font-bold text-white/50 w-5">
                          {row.label}
                        </span>
                        <div className="flex flex-wrap items-center gap-2">
                          {seatNodes}
                        </div>
                        <span
                          className={`ml-auto text-[10px] font-bold uppercase px-2 py-1 rounded ${zone.chipClass}`}>
                          {zone.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 w-full max-w-3xl space-y-2">
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {structureGroups.center.map((structure) => {
                    const structureMeta =
                      STRUCTURE_LIBRARY.find(
                        (item) => item.type === structure.type,
                      ) || STRUCTURE_LIBRARY[0];
                    return (
                      <button
                        key={structure.id}
                        className={`px-2.5 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-all ${
                          !isPreview && selectedStructureId === structure.id
                            ? "border-accent bg-accent/15 text-accent"
                            : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                        }`}
                        disabled={isPreview}
                        onClick={() => {
                          if (isPreview) return;
                          setSelectedStructureId(structure.id);
                        }}
                        type="button">
                        <span className="material-symbols-outlined text-sm">
                          {structureMeta.icon}
                        </span>
                        {structure.name}
                      </button>
                    );
                  })}
                </div>

                {structureGroups.south.length ? (
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    {structureGroups.south.map((structure) => {
                      const structureMeta =
                        STRUCTURE_LIBRARY.find(
                          (item) => item.type === structure.type,
                        ) || STRUCTURE_LIBRARY[0];
                      return (
                        <button
                          key={structure.id}
                          className={`px-2.5 py-1.5 rounded-full border text-[10px] uppercase tracking-[0.12em] flex items-center gap-1 transition-all ${
                            !isPreview && selectedStructureId === structure.id
                              ? "border-accent bg-accent/15 text-accent"
                              : "border-white/20 bg-white/5 text-white/70 hover:bg-white/10"
                          }`}
                          disabled={isPreview}
                          onClick={() => {
                            if (isPreview) return;
                            setSelectedStructureId(structure.id);
                          }}
                          type="button">
                          <span className="material-symbols-outlined text-sm">
                            {structureMeta.icon}
                          </span>
                          {structure.name}
                        </button>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            {!isPreview && (
              <>
                <button
                  className="absolute bottom-5 right-5 z-20 h-14 w-14 rounded-full bg-accent text-charcoal shadow-2xl border border-accent/40 hover:scale-105 transition-all flex items-center justify-center"
                  onClick={() => setIsAiOpen((prev) => !prev)}
                  type="button"
                  title="Open AI assistant">
                  <span className="material-symbols-outlined text-[28px]">
                    auto_awesome
                  </span>
                </button>

                {isAiOpen ? (
                  <div className="absolute right-5 bottom-24 z-30 w-[380px] max-w-[calc(100%-2rem)] rounded-3xl border border-white/10 bg-charcoal/95 backdrop-blur-2xl shadow-2xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                      <div>
                        <h3 className="text-sm font-black text-white">
                          AI Venue Assistant
                        </h3>
                        <p className="text-[10px] text-white/45">
                          Templates first, prompt second
                        </p>
                      </div>
                      <button
                        className="material-symbols-outlined text-white/60 hover:text-white"
                        onClick={() => setIsAiOpen(false)}
                        type="button">
                        close
                      </button>
                    </div>

                    <div className="flex bg-white/5 m-3 rounded-xl p-1">
                      <button
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold ${
                          aiTab === "templates"
                            ? "bg-accent text-charcoal"
                            : "text-white/60 hover:text-white"
                        }`}
                        onClick={() => setAiTab("templates")}
                        type="button">
                        Templates
                      </button>
                      <button
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-bold ${
                          aiTab === "prompt"
                            ? "bg-accent text-charcoal"
                            : "text-white/60 hover:text-white"
                        }`}
                        onClick={() => setAiTab("prompt")}
                        type="button">
                        Custom Prompt
                      </button>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto custom-scrollbar px-4 pb-4">
                      {aiTab === "templates" ? (
                        <div className="space-y-4">
                          <div>
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider mb-2">
                              Quick starts
                            </p>
                            <div className="grid grid-cols-3 gap-2">
                              {AI_TEMPLATE_PRESETS.map((preset) => (
                                <button
                                  key={preset.id}
                                  className="rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 p-3 text-left transition-all"
                                  onClick={() => applyAiTemplatePreset(preset.id)}
                                  type="button">
                                  <span className="material-symbols-outlined text-accent text-[20px]">
                                    {preset.icon}
                                  </span>
                                  <p className="text-[11px] font-bold text-white mt-2">
                                    {preset.name}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-3">
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                              Venue info
                            </p>

                            <input
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                              placeholder="Venue name"
                              value={aiForm.venueName}
                              onChange={(e) => updateAiForm("venueName", e.target.value)}
                            />

                            <textarea
                              className="w-full min-h-[72px] resize-none bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                              placeholder="Short description"
                              value={aiForm.description}
                              onChange={(e) => updateAiForm("description", e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                placeholder="Screen label"
                                value={aiForm.screenLabel}
                                onChange={(e) => updateAiForm("screenLabel", e.target.value)}
                              />
                              <select
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                value={aiForm.ambience}
                                onChange={(e) => updateAiForm("ambience", e.target.value)}>
                                <option value="dark">Dark</option>
                                <option value="sky">Sky</option>
                                <option value="festival">Festival</option>
                              </select>
                            </div>

                            <button
                              className={`w-full rounded-xl border px-3 py-2 text-sm font-bold ${
                                aiForm.covered
                                  ? "bg-primary/25 border-primary/40 text-accent"
                                  : "bg-black/20 border-white/10 text-white/70"
                              }`}
                              onClick={() => updateAiForm("covered", !aiForm.covered)}
                              type="button">
                              {aiForm.covered ? "Covered venue" : "Open sky venue"}
                            </button>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-3">
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                              Layout
                            </p>

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                type="number"
                                min={1}
                                value={aiForm.rows}
                                onChange={(e) =>
                                  updateAiForm("rows", Math.max(1, Number(e.target.value) || 1))
                                }
                                placeholder="Number of rows"
                              />
                              <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                type="number"
                                min={4}
                                value={aiForm.seatsPerRow}
                                onChange={(e) =>
                                  updateAiForm("seatsPerRow", Math.max(4, Number(e.target.value) || 4))
                                }
                                placeholder="Seats per row"
                              />
                            </div>

                            <input
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                              placeholder="VIP rows (example: 1-2)"
                              value={aiForm.vipRows}
                              onChange={(e) => updateAiForm("vipRows", e.target.value)}
                            />

                            <input
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                              placeholder="Premium rows (example: 3-6)"
                              value={aiForm.premiumRows}
                              onChange={(e) => updateAiForm("premiumRows", e.target.value)}
                            />

                            <input
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                              placeholder="Standard rows (example: 7-10)"
                              value={aiForm.standardRows}
                              onChange={(e) => updateAiForm("standardRows", e.target.value)}
                            />
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-3">
                            <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                              Special seats
                            </p>

                            <input
                              className="w-full bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                              placeholder="Bench seat numbers in every row (example: 8, 10)"
                              value={aiForm.benchSeats}
                              onChange={(e) => updateAiForm("benchSeats", e.target.value)}
                            />

                            <div className="grid grid-cols-2 gap-2">
                              <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                type="number"
                                min={0}
                                value={aiForm.pmrRow}
                                onChange={(e) =>
                                  updateAiForm("pmrRow", Math.max(0, Number(e.target.value) || 0))
                                }
                                placeholder="PMR row"
                              />
                              <input
                                className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                type="number"
                                min={0}
                                value={aiForm.pmrCount}
                                onChange={(e) =>
                                  updateAiForm("pmrCount", Math.max(0, Number(e.target.value) || 0))
                                }
                                placeholder="PMR seats"
                              />
                            </div>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-bold text-white/50 uppercase tracking-wider">
                                Components
                              </p>
                              <button
                                className="text-[11px] font-bold text-accent"
                                onClick={addAiComponent}
                                type="button">
                                + Add
                              </button>
                            </div>

                            <div className="space-y-2">
                              {aiForm.components.map((component, index) => (
                                <div
                                  key={`ai-component-${index}`}
                                  className="grid grid-cols-[1fr_1fr_auto] gap-2">
                                  <select
                                    className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                    value={component.type}
                                    onChange={(e) =>
                                      updateAiComponent(index, "type", e.target.value)
                                    }>
                                    {STRUCTURE_LIBRARY.map((item) => (
                                      <option key={item.type} value={item.type}>
                                        {item.name}
                                      </option>
                                    ))}
                                  </select>
                                  <select
                                    className="bg-black/20 border border-white/10 rounded-xl px-3 py-2 text-sm text-white"
                                    value={component.side}
                                    onChange={(e) =>
                                      updateAiComponent(index, "side", e.target.value)
                                    }>
                                    {SIDES.filter((side) => side !== "center").map((side) => (
                                      <option key={side} value={side}>
                                        {side.toUpperCase()}
                                      </option>
                                    ))}
                                  </select>
                                  <button
                                    className="material-symbols-outlined text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-2"
                                    onClick={() => removeAiComponent(index)}
                                    type="button">
                                    delete
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <button
                            className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-3 text-sm font-black text-white hover:bg-white/15"
                            onClick={convertFormToPrompt}
                            type="button">
                            Convert form → prompt
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            className="w-full min-h-[260px] resize-none bg-white/5 border border-white/10 rounded-2xl px-3 py-3 text-sm text-white focus:outline-none focus:border-accent"
                            placeholder="Write your custom AI prompt here... Example: Create a venue name, choose indoor or outdoor, set number of rows and seats per row, define VIP/premium/standard row ranges, add bench or PMR seats, and place components like entrance, bar, food area, or restrooms."
                            value={aiPrompt}
                            onChange={(event) => setAiPrompt(event.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <button
                              className="flex-1 rounded-xl bg-accent text-charcoal px-3 py-3 text-sm font-black hover:opacity-90"
                              onClick={handleAIGenerate}
                              type="button"
                              disabled={isGeneratingAI}>
                              {isGeneratingAI ? "Generating..." : "Generate with AI"}
                            </button>
                            <button
                              className="rounded-xl bg-white/10 border border-white/10 px-3 py-3 text-sm font-bold text-white hover:bg-white/15"
                              onClick={() => setAiTab("templates")}
                              type="button">
                              Back
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
              </>
            )}

            {isPreview ? null : (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-charcoal/85 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-2xl flex items-center gap-3 shadow-2xl z-10">
                <div className="flex items-center gap-2 border-r border-white/10 pr-3">
                  <button
                    className="material-symbols-outlined text-white/60 hover:text-white transition-colors"
                    onClick={() => setZoom((value) => Math.max(55, value - 5))}
                    type="button">
                    zoom_out
                  </button>
                  <span className="text-xs font-bold text-white/40 w-10 text-center">
                    {zoom}%
                  </span>
                  <button
                    className="material-symbols-outlined text-white/60 hover:text-white transition-colors"
                    onClick={() => setZoom((value) => Math.min(130, value + 5))}
                    type="button">
                    zoom_in
                  </button>
                </div>
                <button
                  className="material-symbols-outlined text-white/60 hover:text-white transition-colors disabled:opacity-30"
                  disabled={!undoStack.length}
                  onClick={handleUndo}
                  type="button">
                  undo
                </button>
                <button
                  className="material-symbols-outlined text-white/60 hover:text-white transition-colors disabled:opacity-30"
                  disabled={!redoStack.length}
                  onClick={handleRedo}
                  type="button">
                  redo
                </button>
                <button
                  className="material-symbols-outlined text-white/60 hover:text-white transition-colors"
                  onClick={removeRow}
                  type="button">
                  delete
                </button>
              </div>
            )}
          </main>

          {isPreview ? null : (
            <aside className="w-64 border-l border-white/5 bg-charcoal flex-col overflow-y-auto custom-scrollbar hidden xl:flex">
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">
                    Venue Settings
                  </h3>
                  <div className="space-y-2">
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-accent"
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          templateName: event.target.value,
                        }))
                      }
                      type="text"
                      value={editor.templateName}
                    />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-accent"
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          subtitle: event.target.value,
                        }))
                      }
                      type="text"
                      value={editor.subtitle}
                    />
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-accent"
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          screenLabel: event.target.value,
                        }))
                      }
                      type="text"
                      value={editor.screenLabel}
                    />
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[11px] text-white focus:outline-none focus:border-accent"
                      onChange={(event) =>
                        setEditor((prev) => ({
                          ...prev,
                          ambience: event.target.value,
                        }))
                      }
                      value={editor.ambience}>
                      <option value="dark">Dark</option>
                      <option value="sky">Sky</option>
                      <option value="festival">Festival</option>
                    </select>
                    <button
                      className={`w-full rounded-lg text-[11px] font-bold border px-2.5 py-1.5 ${
                        editor.covered
                          ? "bg-primary/25 border-primary/40 text-accent"
                          : "bg-white/5 border-white/10 text-white/70"
                      }`}
                      onClick={() =>
                        setEditor((prev) => ({
                          ...prev,
                          covered: !prev.covered,
                        }))
                      }
                      type="button">
                      {editor.covered ? "Covered" : "Open Sky"}
                    </button>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5">
                  <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">
                    Selected Row
                  </h3>
                  {selectedRow ? (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs font-bold text-white"
                          maxLength={2}
                          onChange={(event) =>
                            updateSelectedRow(
                              "label",
                              event.target.value.toUpperCase(),
                            )
                          }
                          type="text"
                          value={selectedRow.label}
                        />
                        <select
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                          onChange={(event) =>
                            updateSelectedRow("zoneId", event.target.value)
                          }
                          value={selectedRow.zoneId}>
                          {ZONES.map((zone) => (
                            <option key={zone.id} value={zone.id}>
                              {zone.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <input
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                          min={4}
                          onChange={(event) =>
                            updateSelectedRow(
                              "seats",
                              Math.max(4, Number(event.target.value) || 4),
                            )
                          }
                          type="number"
                          value={selectedRow.seats}
                        />
                        <input
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                          min={0}
                          onChange={(event) =>
                            updateSelectedRow(
                              "aisleEvery",
                              Math.max(0, Number(event.target.value) || 0),
                            )
                          }
                          type="number"
                          value={selectedRow.aisleEvery}
                        />
                        <input
                          className="bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                          min={0}
                          onChange={(event) =>
                            updateSelectedRow(
                              "wheelchair",
                              Math.min(
                                selectedRow.seats,
                                Math.max(0, Number(event.target.value) || 0),
                              ),
                            )
                          }
                          type="number"
                          value={selectedRow.wheelchair}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          className="rounded-lg py-1.5 text-[11px] font-bold border border-white/10 bg-white/5 hover:bg-white/10"
                          onClick={addRow}
                          type="button">
                          Add Row
                        </button>
                        <button
                          className="rounded-lg py-1.5 text-[11px] font-bold border border-white/10 bg-white/5 hover:bg-white/10"
                          onClick={duplicateRow}
                          type="button">
                          Duplicate
                        </button>
                        <button
                          className="rounded-lg py-1.5 text-[11px] font-bold border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                          onClick={removeRow}
                          type="button">
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-xs text-white/40">
                        Select a row to edit.
                      </p>
                      <button
                        className="w-full rounded-lg py-1.5 text-[11px] font-bold border border-white/10 bg-white/5 hover:bg-white/10"
                        onClick={addRow}
                        type="button">
                        Add First Row
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5">
                  <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">
                    Selected Seat
                  </h3>
                  {selectedSeat ? (
                    <div className="space-y-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px]">
                        <span className="text-white/50">Seat</span>{" "}
                        <span className="font-bold text-white">
                          {selectedRow?.label || "?"}-{selectedSeat.number}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {ZONES.map((zone) => (
                          <button
                            key={`seat-zone-${zone.id}`}
                            className={`rounded-lg py-1.5 text-[10px] font-bold border transition-all ${
                              selectedSeatType === zone.id
                                ? `${zone.activeClass} bg-white/10`
                                : "border-white/10 bg-white/5 hover:bg-white/10"
                            }`}
                            onClick={() => updateSelectedSeatType(zone.id)}
                            type="button">
                            {zone.name}
                          </button>
                        ))}
                      </div>
                      <button
                        className="w-full rounded-lg py-1.5 text-[11px] font-bold border border-white/10 bg-white/5 hover:bg-white/10"
                        onClick={clearSelectedSeatOverride}
                        type="button">
                        Reset To Row Default
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">
                      Click a seat in the map to edit it individually.
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5">
                  <h3 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">
                    Selected Structure
                  </h3>
                  {selectedStructure ? (
                    <div className="space-y-2">
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                        onChange={(event) =>
                          updateSelectedStructure("name", event.target.value)
                        }
                        type="text"
                        value={selectedStructure.name}
                      />
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-[11px] text-white"
                        onChange={(event) =>
                          updateSelectedStructure("side", event.target.value)
                        }
                        value={selectedStructure.side}>
                        {STRUCTURE_SIDE_OPTIONS.map((side) => (
                          <option key={side} value={side}>
                            {side.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <button
                        className="w-full rounded-lg py-1.5 text-[11px] font-bold border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                        onClick={removeStructure}
                        type="button">
                        Remove Structure
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs text-white/40">
                      Add or select a structure.
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5">
                  <h4 className="text-[9px] font-bold text-white/40 uppercase tracking-widest mb-2.5">
                    Venue Statistics
                  </h4>
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-white/40">Total Capacity</span>
                      <span className="font-bold text-white">
                        {stats.capacity} seats
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/40">Rows</span>
                      <span className="font-bold text-white">{stats.rows}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-pmr-green">PMR Seats</span>
                      <span className="font-bold text-pmr-green">
                        {stats.wheelchair}
                      </span>
                    </div>
                    {ZONES.map((zone) => (
                      <div
                        key={`stat-${zone.id}`}
                        className="flex justify-between">
                        <span className="text-white/50">{zone.name}</span>
                        <span className="font-bold text-white">
                          {stats.zones[zone.id] || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {notice ? (
                  <div className="rounded-lg border border-green-500/20 bg-green-500/10 p-2.5 text-[11px] text-green-300">
                    {notice}
                  </div>
                ) : null}
              </div>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}
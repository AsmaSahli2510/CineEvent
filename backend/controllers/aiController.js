const VALID_ZONE_IDS = ["standard", "premium", "vip", "accessible", "bench"];
const VALID_AMBIENCE = ["dark", "sky", "festival"];
const VALID_STRUCTURE_TYPES = [
  "entrance",
  "exit",
  "food",
  "bar",
  "shelter",
  "restroom",
  "lounge",
  "projection",
  "backstage",
];
const VALID_STRUCTURE_SIDES = ["north", "south", "east", "west", "center"];
const OLLAMA_MODEL = "qwen2.5:3b";

const SYSTEM_PROMPT = `
You are a STRICT JSON generator for venue templates.

You MUST return ONLY raw JSON.
NO explanation.
NO markdown.
NO comments.
NO text before or after JSON.

Output format:
{
  "name": "string",
  "subtitle": "string",
  "screenLabel": "string",
  "ambience": "dark|sky|festival",
  "covered": true,
  "rows": [
    {
      "label": "A",
      "seats": 12,
      "aisleEvery": 6,
      "zoneId": "standard",
      "wheelchair": 0,
      "seatOverrides": {
        "8": "bench"
      }
    }
  ],
  "structures": [
    {
      "type": "entrance",
      "name": "Main Entrance",
      "side": "north"
    }
  ]
}

Rules:
- Never invent more rows than requested
- Never invent more seats per row than requested
- Labels must increment A, B, C, D...
- zoneId must be one of: standard, premium, vip, accessible, bench
- structure type must be one of:
  entrance, exit, food, bar, shelter, restroom, lounge, projection, backstage
- structure side must be one of:
  north, south, east, west, center
`;

function getLabelFromIndex(index) {
  let n = index;
  let label = "";

  do {
    label = String.fromCharCode(65 + (n % 26)) + label;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);

  return label;
}

function safeParseJson(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Empty model response");
  }

  const trimmed = text.trim();

  try {
    return JSON.parse(trimmed);
  } catch (_) {}

  const codeBlockMatch =
    trimmed.match(/```json\s*([\s\S]*?)```/i) ||
    trimmed.match(/```([\s\S]*?)```/);

  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch (_) {}
  }

  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch (_) {}
  }

  throw new Error("Could not extract valid JSON from model response");
}

function validateSeatOverrides(raw, seats) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }

  const result = {};

  for (const [key, value] of Object.entries(raw)) {
    const seatNumber = Number(key);
    const seatType = String(value || "").toLowerCase().trim();

    if (
      Number.isInteger(seatNumber) &&
      seatNumber >= 1 &&
      seatNumber <= seats &&
      VALID_ZONE_IDS.includes(seatType)
    ) {
      result[String(seatNumber)] = seatType;
    }
  }

  return result;
}

function validateRow(row, index) {
  if (!row || typeof row !== "object" || Array.isArray(row)) {
    return null;
  }

  const label = /^[A-Z]{1,2}$/.test(String(row.label || "").toUpperCase())
    ? String(row.label).toUpperCase()
    : getLabelFromIndex(index);

  let seats = Number(row.seats);
  if (!Number.isInteger(seats) || seats < 4 || seats > 100) {
    seats = 12;
  }

  let aisleEvery = Number(row.aisleEvery);
  if (!Number.isInteger(aisleEvery) || aisleEvery < 0 || aisleEvery >= seats) {
    aisleEvery = Math.floor(seats / 2);
  }

  let zoneId = String(row.zoneId || "standard").toLowerCase().trim();
  if (!VALID_ZONE_IDS.includes(zoneId)) {
    zoneId = "standard";
  }

  let wheelchair = Number(row.wheelchair);
  if (!Number.isInteger(wheelchair) || wheelchair < 0) {
    wheelchair = 0;
  }

  const seatOverrides = validateSeatOverrides(row.seatOverrides, seats);

  return {
    label,
    seats,
    aisleEvery,
    zoneId,
    wheelchair,
    seatOverrides,
  };
}

function normalizeStructureType(type) {
  const t = String(type || "").toLowerCase().trim();

  if (VALID_STRUCTURE_TYPES.includes(t)) return t;
  if (t.includes("projection")) return "projection";
  if (t.includes("restroom") || t.includes("toilet") || t.includes("wc")) {
    return "restroom";
  }
  if (t === "food_area" || t.includes("food")) return "food";
  if (t.includes("bar")) return "bar";
  if (t.includes("lounge")) return "lounge";
  if (t.includes("entrance")) return "entrance";
  if (t.includes("exit")) return "exit";
  if (t.includes("shelter")) return "shelter";
  if (t.includes("backstage")) return "backstage";

  return "lounge";
}

function validateStructure(structure, index) {
  if (!structure || typeof structure !== "object" || Array.isArray(structure)) {
    return null;
  }

  const safeType = normalizeStructureType(structure.type);
  const side = String(structure.side || "center").toLowerCase().trim();
  const safeSide = VALID_STRUCTURE_SIDES.includes(side) ? side : "center";

  const name =
    String(structure.name || "").trim() ||
    `${safeType.charAt(0).toUpperCase()}${safeType.slice(1)} ${index + 1}`;

  return {
    type: safeType,
    name,
    side: safeSide,
  };
}

function extractRequestedRowCount(prompt) {
  const p = String(prompt || "").toLowerCase();
  const match = p.match(/(\d+)\s*rows?/);
  return match ? Number(match[1]) : null;
}

function extractRequestedSeats(prompt) {
  const p = String(prompt || "").toLowerCase();

  const patterns = [
    /each row has exactly\s*(\d+)\s*seats?/,
    /each row has\s*(\d+)\s*seats?/,
    /exactly\s*(\d+)\s*seats?\s*per row/,
    /(\d+)\s*seats?\s*per row/,
  ];

  for (const pattern of patterns) {
    const match = p.match(pattern);
    if (match) {
      return Number(match[1]);
    }
  }

  return null;
}

function extractBenchSeats(prompt) {
  const p = String(prompt || "").toLowerCase();
  const seats = new Set();

  const patterns = [
    /seat number ([\d,\sand]+) in every row.*bench/,
    /seat number ([\d,\sand]+) in each row.*bench/,
    /seats? ([\d,\sand]+) in every row.*bench/,
    /seats? ([\d,\sand]+) in each row.*bench/,
  ];

  for (const pattern of patterns) {
    const match = p.match(pattern);
    if (match && match[1]) {
      const numbers = match[1].match(/\d+/g) || [];
      numbers.forEach((num) => {
        const parsed = Number(num);
        if (Number.isInteger(parsed)) {
          seats.add(parsed);
        }
      });
    }
  }

  return Array.from(seats).sort((a, b) => a - b);
}

function extractExclusivePmrRule(prompt) {
  const p = String(prompt || "").toLowerCase();

  const patterns = [
    /only row\s*(\d+)\s*(?:may contain|has|must contain).*(\d+)\s*(?:pmr|accessible|wheelchair)/,
    /only row\s*(\d+)\s*may contain wheelchair seats/,
    /only row\s*(\d+)\s*may contain pmr seats/,
    /row\s*(\d+)\s*must contain exactly\s*(\d+)\s*(?:pmr|accessible|wheelchair)/,
    /row\s*(\d+)\s*.*exactly\s*(\d+)\s*(?:pmr|accessible|wheelchair)/,
    /exactly\s*(\d+)\s*(?:pmr|accessible|wheelchair).*?only row\s*(\d+)/,
  ];

  let rowNumber = null;
  let count = null;

  for (const pattern of patterns) {
    const match = p.match(pattern);
    if (!match) continue;

    if (
      pattern.source.includes("only row") &&
      match[1] &&
      rowNumber === null
    ) {
      rowNumber = Number(match[1]);
    }

    if (match[2] && count === null) {
      count = Number(match[2]);
    }

    if (
      pattern.source.startsWith("exactly") &&
      match[1] &&
      match[2]
    ) {
      count = Number(match[1]);
      rowNumber = Number(match[2]);
    }
  }

  if (rowNumber !== null && count !== null) {
    return { rowNumber, count };
  }

  return null;
}

function extractZoneRanges(prompt) {
  const p = String(prompt || "").toLowerCase();
  const ranges = [];

  const rangeRegex =
    /rows?\s+(\d+)\s*(?:to|-)\s*(\d+)\s+must\s+be\s+(vip|premium|standard)/g;

  let match;
  while ((match = rangeRegex.exec(p)) !== null) {
    ranges.push({
      start: Number(match[1]),
      end: Number(match[2]),
      zoneId: match[3],
    });
  }

  const singleRegex = /row\s+(\d+)\s+must\s+be\s+(vip|premium|standard)/g;
  while ((match = singleRegex.exec(p)) !== null) {
    ranges.push({
      start: Number(match[1]),
      end: Number(match[1]),
      zoneId: match[2],
    });
  }

  return ranges;
}

function inferDefaultsFromPrompt(prompt) {
  const p = String(prompt || "").toLowerCase();

  let ambience = "dark";
  if (p.includes("open air") || p.includes("outdoor") || p.includes("open sky")) {
    ambience = "sky";
  } else if (p.includes("festival")) {
    ambience = "festival";
  }

  let covered = true;
  if (
    p.includes("open air") ||
    p.includes("outdoor") ||
    p.includes("not covered") ||
    p.includes("uncovered") ||
    p.includes("open sky")
  ) {
    covered = false;
  }

  let screenLabel = "SCREEN";
  if (p.includes("main stage")) {
    screenLabel = "MAIN STAGE";
  } else if (p.includes("outdoor stage")) {
    screenLabel = "OUTDOOR STAGE";
  }

  return { ambience, covered, screenLabel };
}

function buildDefaultName(prompt) {
  const p = String(prompt || "").toLowerCase();

  if (p.includes("festival")) return "Festival Arena";
  if (p.includes("open air") || p.includes("outdoor")) return "Open Air Theater";
  if (p.includes("cinema")) return "Cinema Hall";
  if (p.includes("theater")) return "Theater Room";

  return "Custom Venue Template";
}

function buildDefaultSubtitle(prompt) {
  const p = String(prompt || "").toLowerCase();

  if (p.includes("festival")) return "AI-generated festival venue layout";
  if (p.includes("open air") || p.includes("outdoor")) {
    return "AI-generated outdoor venue layout";
  }
  return "AI-generated venue layout";
}

function applyPromptRules(rows, prompt) {
  const requestedRowCount = extractRequestedRowCount(prompt) || rows.length || 1;
  const rowCount = Math.min(requestedRowCount, 100);
  const seats = extractRequestedSeats(prompt) || 12;
  const benchSeats = extractBenchSeats(prompt);
  const zoneRanges = extractZoneRanges(prompt);
  let pmrRule = extractExclusivePmrRule(prompt);

  if (pmrRule && pmrRule.rowNumber > rowCount) {
    pmrRule = null;
  }

  const result = [];

  for (let i = 0; i < rowCount; i += 1) {
    const existing = rows[i] || {};

    const row = {
      label: getLabelFromIndex(i),
      seats,
      aisleEvery:
        Number.isInteger(existing.aisleEvery) &&
        existing.aisleEvery >= 0 &&
        existing.aisleEvery < seats
          ? existing.aisleEvery
          : Math.floor(seats / 2),
      zoneId: "standard",
      wheelchair: 0,
      seatOverrides: {},
    };

    const zoneMatch = zoneRanges.find(
      (z) => i + 1 >= z.start && i + 1 <= z.end,
    );

    if (zoneMatch) {
      row.zoneId = zoneMatch.zoneId;
    } else if (
      VALID_ZONE_IDS.includes(existing.zoneId) &&
      existing.zoneId !== "accessible" &&
      existing.zoneId !== "bench"
    ) {
      row.zoneId = existing.zoneId;
    }

    for (const [seatNumber, seatType] of Object.entries(
      existing.seatOverrides || {},
    )) {
      if (seatType !== "accessible") {
        row.seatOverrides[seatNumber] = seatType;
      }
    }

    benchSeats.forEach((benchSeat) => {
      if (benchSeat >= 1 && benchSeat <= seats) {
        row.seatOverrides[String(benchSeat)] = "bench";
      }
    });

    if (pmrRule && pmrRule.rowNumber === i + 1) {
      row.wheelchair = pmrRule.count;
      for (let s = 1; s <= pmrRule.count; s += 1) {
        if (s <= seats) {
          row.seatOverrides[String(s)] = "accessible";
        }
      }
    }

    result.push(row);
  }

  return result;
}

function sanitizeTemplate(parsed, prompt) {
  const defaults = inferDefaultsFromPrompt(prompt);

  const validatedRows = Array.isArray(parsed.rows)
    ? parsed.rows.map((row, index) => validateRow(row, index)).filter(Boolean)
    : [];

  const rows = applyPromptRules(validatedRows, prompt);

  const structures = Array.isArray(parsed.structures)
    ? parsed.structures
        .map((structure, index) => validateStructure(structure, index))
        .filter(Boolean)
    : [];

  const name = String(parsed.name || "").trim() || buildDefaultName(prompt);
  const subtitle =
    String(parsed.subtitle || "").trim() || buildDefaultSubtitle(prompt);
  const screenLabel =
    String(parsed.screenLabel || "").trim() || defaults.screenLabel;

  const ambience = VALID_AMBIENCE.includes(String(parsed.ambience || "").trim())
    ? String(parsed.ambience).trim()
    : defaults.ambience;

  const covered =
    typeof parsed.covered === "boolean" ? parsed.covered : defaults.covered;

  return {
    name,
    subtitle,
    screenLabel,
    ambience,
    covered,
    rows,
    structures,
  };
}

async function callOllama(prompt) {
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      stream: false,
      options: {
        temperature: 0.05,
        num_predict: 4096,
      },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama error ${response.status}: ${text}`);
  }

  return response.json();
}

async function generateVenueLayout(prompt) {
  const cleanPrompt = String(prompt || "").trim();

  if (!cleanPrompt) {
    throw new Error("Prompt is required");
  }

  console.log("AI prompt:", cleanPrompt);
  console.log("AI model:", OLLAMA_MODEL);

  const data = await callOllama(cleanPrompt);
  const content = data?.message?.content || "";

  console.log("OLLAMA RAW CONTENT:\n", content);

  const parsed = safeParseJson(content);
  const template = sanitizeTemplate(parsed, cleanPrompt);

  if (!Array.isArray(template.rows) || template.rows.length === 0) {
    throw new Error("Model did not return a valid rows array");
  }

  return template;
}

module.exports = {
  generateVenueLayout,
};
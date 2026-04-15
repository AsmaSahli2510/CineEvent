const Movie = require("../models/Movie");
const Event = require("../models/Event");

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
    const seatType = String(value || "")
      .toLowerCase()
      .trim();

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

  let zoneId = String(row.zoneId || "standard")
    .toLowerCase()
    .trim();
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
  const t = String(type || "")
    .toLowerCase()
    .trim();

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
  const side = String(structure.side || "center")
    .toLowerCase()
    .trim();
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

    if (pattern.source.includes("only row") && match[1] && rowNumber === null) {
      rowNumber = Number(match[1]);
    }

    if (match[2] && count === null) {
      count = Number(match[2]);
    }

    if (pattern.source.startsWith("exactly") && match[1] && match[2]) {
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
  if (
    p.includes("open air") ||
    p.includes("outdoor") ||
    p.includes("open sky")
  ) {
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
  if (p.includes("open air") || p.includes("outdoor"))
    return "Open Air Theater";
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
  const requestedRowCount =
    extractRequestedRowCount(prompt) || rows.length || 1;
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

async function callOllama(prompt, systemPrompt = SYSTEM_PROMPT) {
  const response = await fetch("http://127.0.0.1:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
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

// ============= MOVIE RECOMMENDATION AI =============

async function buildEventCatalog() {
  // Fetch all available events from database
  const events = await Event.find({ status: "published" })
    .sort({ date: -1 })
    .limit(50);

  // Build a formatted catalog for the AI to know what events exist
  let catalogText = "AVAILABLE EVENTS IN OUR DATABASE:\n\n";

  events.forEach((event, index) => {
    const title =
      event.movieDetails?.title ||
      event.festivalDetails?.festivalName ||
      "Untitled Event";
    const genres = event.movieDetails?.genre || event.category || "Event";
    const description =
      event.movieDetails?.description || event.description || "N/A";
    const eventDate = event.date
      ? new Date(event.date).toLocaleDateString()
      : "TBA";
    const location = event.venueDetails?.location || event.cinema || "Various";

    catalogText += `${index + 1}. "${title}"\n`;
    catalogText += `   Genres: ${Array.isArray(genres) ? genres.join(", ") : genres}\n`;
    catalogText += `   Date: ${eventDate}\n`;
    catalogText += `   Location: ${location}\n`;
    catalogText += `   Description: ${String(description).substring(0, 80)}...\n`;
    catalogText += `   Event Type: ${event.eventType || "Movie"}\n\n`;
  });

  return { events, catalogText };
}

function buildEventRecommendationPrompt(catalogText) {
  return `You are CinéMate, a friendly and intelligent event AI assistant. You're like a knowledgeable friend who helps people discover perfect cinema events.

CRITICAL RULES:
1. You can ONLY suggest events that are listed in the catalog
2. NEVER immediately recommend without understanding the user
3. Start conversations naturally - ask about their preferences, mood, availability
4. Only recommend when the user gives clear hints about what they want
5. Be conversational and engaging like ChatGPT/Claude - use follow-up questions
6. Reference events BY THEIR EXACT NAMES from the catalog
7. Never make up or hallucinate events - only use what's listed below
8. Keep responses natural and concise

${catalogText}

HOW TO INTERACT:
- User says "hey" or simple greeting: Greet them back naturally, ask what kind of event/mood they're looking for. Don't recommend yet.
- User describes a mood: Ask follow-up questions. "What genre usually works for that mood?" or "Any specific type of cinema experience?"
- User mentions a preference: Then check the catalog and recommend 1-2 matching events only when you have enough context.
- User asks directly: "Do you have action movies?" → Check catalog, recommend matching events.

EXAMPLE CONVERSATIONS:
User: "hey"
You: "Hey there! 👋 What brings you to the cinema today? Are you looking for something light and fun, or something more intense?"

User: "I'm feeling stressed"
You: "I get that. Sometimes a great movie can be the perfect escape. Are you in the mood for something that'll make you laugh, or something more immersive and dramatic?"

User: "something funny and uplifting"
You: "Perfect! I've got just the thing - [REAL EVENT FROM CATALOG] would be amazing for that. It's a fun, feel-good experience. Want to book a seat?"

User: "any action movies coming soon?"
You: "Absolutely! We have [ACTION EVENT]. It's coming up on [DATE]. Interested?"

Remember: Be smart. Understand the person first. Recommend second. Be conversational like a real friend.`;
}

// Extract budget from user input (e.g., "I have 20 TND", "budget is 50")
function extractBudget(userInput) {
  const input = String(userInput || "").toLowerCase();

  // Match patterns like "20 tnd", "tnd 20", "budget 20", "i have 20"
  const patterns = [
    /(\d+)\s*(?:tnd|dinars?)/i,
    /budget[:\s]+(\d+)/i,
    /(?:only\s+)?have\s+(\d+)/i,
    /afford\s+(\d+)/i,
    /(?:at\s+most|maximum|max)\s+(\d+)/i,
  ];

  for (const pattern of patterns) {
    const match = input.match(pattern);
    if (match && match[1]) {
      return Number(match[1]);
    }
  }

  return null;
}

// Format pricing display for AI
function formatPricingForAI(event) {
  const pricing = event.pricingDetails || {};
  let priceInfo = "";

  if (pricing.isFreeEvent) {
    priceInfo = "This is a FREE event!";
  } else if (pricing.pricingMode === "unique" && pricing.singlePrice) {
    priceInfo = `Ticket Price: ${pricing.singlePrice} ${pricing.currency || "TND"}`;
  } else if (pricing.categories && Object.keys(pricing.categories).length > 0) {
    priceInfo = "Seat Categories:\n";
    for (const [category, price] of Object.entries(pricing.categories)) {
      priceInfo += `  - ${category}: ${price} ${pricing.currency || "TND"}\n`;
    }
  }

  return priceInfo;
}

async function getMovieRecommendations(userInput, conversationHistory = []) {
  const cleanInput = String(userInput || "").trim();

  if (!cleanInput) {
    throw new Error("Tell me what's on your mind!");
  }

  console.log("Event AI - User input:", cleanInput);

  try {
    // Build catalog from database
    const { events, catalogText } = await buildEventCatalog();

    // Extract budget if user mentions it
    const userBudget = extractBudget(cleanInput);

    if (events.length === 0) {
      return {
        response:
          "Sorry, we don't have any events available at the moment. Check back soon!",
        recommendations: [],
      };
    }

    console.log("Catalog built with", events.length, "events");
    if (userBudget) {
      console.log("User budget detected:", userBudget, "TND");
    }

    // Format conversation history
    let conversationContext = "";
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.forEach((msg) => {
        const role = msg.role === "user" ? "User" : "CinéMate";
        conversationContext += `${role}: ${msg.content}\n`;
      });
    }

    const fullPrompt = conversationContext
      ? `${conversationContext}User: ${cleanInput}`
      : cleanInput;

    // Build pricing context if budget was mentioned
    let pricingContext = "";
    if (userBudget) {
      pricingContext = `\nUSER BUDGET INFORMATION:\n`;
      pricingContext += `- User has: ${userBudget} TND\n`;
      pricingContext += `- Suggest ONLY seat categories they can afford\n`;
      pricingContext += `- Be helpful: "With your budget of ${userBudget} TND, you can book a [CATEGORY] seat for [EVENT]"\n`;
      pricingContext += `- Show available seat categories and prices when recommending\n`;
    }

    // Get natural conversation response from AI with catalog context
    const systemPrompt =
      buildEventRecommendationPrompt(catalogText) + pricingContext;
    const data = await callOllama(fullPrompt, systemPrompt);
    const aiResponse = data?.message?.content || "";

    console.log("EVENT AI RESPONSE:\n", aiResponse);

    // Now extract which events from our catalog should be recommended WITH custom descriptions
    // First, create a numbered list for easier matching
    const eventsList = events
      .map((e, idx) => {
        const title =
          e.movieDetails?.title ||
          e.festivalDetails?.festivalName ||
          "Untitled";
        const genres = e.movieDetails?.genre || e.category || "Event";
        return `${idx + 1}. "${title}" (${Array.isArray(genres) ? genres.join(", ") : genres})`;
      })
      .join("\n");

    const extractionPrompt = `You are a cinema AI assistant. Based on this conversation and the catalog below, select the BEST matching events for the user.

Conversation:
${conversationContext}User: ${cleanInput}

${userBudget ? `User's Budget: ${userBudget} TND\nIMPORTANT: Only recommend movies where at least ONE seat category is affordable!` : ""}

AVAILABLE EVENTS (by number):
${eventsList}

Select 1-3 matching events from the list above and provide a creative description for each. Use the event NUMBER from the list. Respond ONLY with JSON:
{
  "recommendations": [
    {
      "eventIndex": 1,
      "title": "Event Title From List",
      "customDescription": "A creative, engaging 2-3 sentence description..."
    }
  ]
}

IF no events match the request, return empty: {"recommendations": []}`;

    let recommendedTitles = [];
    let customDescriptions = {};
    let recommendedIndices = [];

    try {
      const extractionData = await callOllama(
        extractionPrompt,
        "Return ONLY valid JSON with event recommendations",
      );
      const extractionContent = extractionData?.message?.content || "";
      console.log("EXTRACTION RAW:", extractionContent);

      try {
        const parsed = safeParseJson(extractionContent);
        if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
          parsed.recommendations.forEach((rec) => {
            if (rec.title) {
              recommendedTitles.push(rec.title);
              if (rec.eventIndex) {
                recommendedIndices.push(rec.eventIndex - 1); // Convert to 0-indexed
              }
              customDescriptions[rec.title.toLowerCase()] =
                rec.customDescription || "";
            }
          });
        }
      } catch (e) {
        console.log("Could not parse extraction JSON:", e.message);
      }
    } catch (error) {
      console.log("Extraction call failed:", error.message);
    }

    // Match recommended titles/indices to actual event objects from database
    let recommendations = [];

    if (recommendedTitles.length > 0 || recommendedIndices.length > 0) {
      // Try to match by index first (more reliable), then by title
      recommendations = events.filter((event, eventIndex) => {
        // Match by index
        if (recommendedIndices.includes(eventIndex)) {
          return true;
        }
        // Match by title as fallback
        const eventTitle =
          event.movieDetails?.title ||
          event.festivalDetails?.festivalName ||
          "Untitled";
        return recommendedTitles.some(
          (title) =>
            eventTitle?.toLowerCase().includes(title?.toLowerCase()) ||
            title?.toLowerCase().includes(eventTitle?.toLowerCase()),
        );
      });
    }

    // FALLBACK: If AI extraction failed, use keyword matching
    if (recommendations.length === 0) {
      const keywords = cleanInput.toLowerCase().split(/\s+/);
      const genreKeywords = [
        "drama",
        "thriller",
        "action",
        "comedy",
        "romance",
        "horror",
        "adventure",
        "documentary",
        "historical",
        "crime",
      ];
      const matchedGenres = genreKeywords.filter((g) => keywords.includes(g));

      if (matchedGenres.length > 0) {
        // Filter events by matching genres
        recommendations = events.filter((event) => {
          const eventGenres = (
            event.movieDetails?.genre ||
            event.category ||
            ""
          )
            .toString()
            .toLowerCase();
          return matchedGenres.some((genre) => eventGenres.includes(genre));
        });

        // If budget was mentioned, filter to affordable options
        if (userBudget) {
          recommendations = recommendations.filter((event) => {
            const pricing = event.pricingDetails || {};
            if (pricing.isFreeEvent) return true;
            if (pricing.singlePrice && pricing.singlePrice <= userBudget)
              return true;
            if (pricing.categories) {
              return Object.values(pricing.categories).some(
                (price) => price <= userBudget,
              );
            }
            return false;
          });
        }

        // Limit to top 3 recommendations
        recommendations = recommendations.slice(0, 3);

        // Generate custom descriptions for fallback recommendations
        for (const rec of recommendations) {
          const title =
            rec.movieDetails?.title ||
            rec.festivalDetails?.festivalName ||
            "Untitled";
          if (!customDescriptions[title.toLowerCase()]) {
            const genres = rec.movieDetails?.genre || rec.category || "Event";
            const genreStr = Array.isArray(genres) ? genres.join(", ") : genres;

            try {
              const descPrompt = `Create a short, creative 2-3 sentence description for this movie that makes it sound appealing:
Title: ${title}
Genres: ${genreStr}

Make it engaging and poetic, highlighting what makes this experience special. Just provide the description, no other text.`;

              const descData = await callOllama(
                descPrompt,
                "Create an engaging movie description",
              );
              const descContent = descData?.message?.content || "";
              if (descContent) {
                customDescriptions[title.toLowerCase()] = descContent.trim();
              }
            } catch (e) {
              console.log(
                "Could not generate description for " + title,
                e.message,
              );
            }
          }
        }
      }
    }

    // Build a SHORT conversational response (just the greeting/follow-up, not the full description)
    let conversationalResponse = aiResponse;

    // If we have recommendations, keep it shorter and let the cards do the talking
    if (recommendations.length > 0) {
      // Extract just the greeting/context part, not the full listing
      const lines = aiResponse.split("\n");
      let introText = "";
      for (let i = 0; i < lines.length; i++) {
        introText += lines[i] + "\n";
        // Stop before listing movies or detailed descriptions
        if (lines[i].match(/^[0-9]+\./)) {
          introText = introText.slice(0, -lines[i].length - 1); // Remove the list item
          break;
        }
      }
      conversationalResponse =
        introText.trim() ||
        aiResponse.split("\n").slice(0, 2).join("\n").trim();
    }

    return {
      response: conversationalResponse,
      recommendations: recommendations.map((e) => {
        const title =
          e.movieDetails?.title ||
          e.festivalDetails?.festivalName ||
          "Untitled Event";
        const genres = e.movieDetails?.genre || e.category || ["Event"];
        const date = e.date ? new Date(e.date).toLocaleDateString() : "TBA";
        const pricing = e.pricingDetails || {};

        // Use custom description from AI, fallback to database description
        const customDesc = customDescriptions[title.toLowerCase()];
        const description =
          customDesc || e.movieDetails?.description || e.description || "";

        return {
          id: e._id,
          title: title,
          description: description,
          genres: Array.isArray(genres) ? genres : [genres],
          director: e.movieDetails?.director || "N/A",
          date: date,
          location: e.venueDetails?.location || e.cinema || "TBA",
          eventType: e.eventType || "Movie",
          poster:
            e.movieDetails?.posterUrl ||
            e.movieDetails?.posterDataUrl ||
            e.festivalDetails?.posterUrl ||
            "",
          status: e.status,
          // Include pricing info for budget-aware recommendations
          pricing: {
            currency: pricing.currency || "TND",
            isFree: pricing.isFreeEvent || false,
            singlePrice: pricing.singlePrice || 0,
            categories: pricing.categories
              ? Object.fromEntries(pricing.categories)
              : {},
          },
        };
      }),
    };
  } catch (error) {
    console.error("Event recommendation error:", error);
    throw error;
  }
}

module.exports = {
  generateVenueLayout,
  getMovieRecommendations,
};

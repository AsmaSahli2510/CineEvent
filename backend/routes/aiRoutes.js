const express = require("express");
const { generateVenueLayout, getMovieRecommendations } = require("../controllers/aiController");

const router = express.Router();

/**
 * POST /api/ai/generate-layout
 * Generates a venue seating layout from natural language prompt
 * Body: { prompt: string }
 * Returns: { rows: Array<Row> }
 */
router.post("/generate-layout", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: "Prompt is required",
      });
    }

    console.log("AI Route: Received request with prompt");

    const layout = await generateVenueLayout(prompt);

    // Validate response has expected structure
    if (!layout || !Array.isArray(layout.rows)) {
      return res.status(500).json({
        error: "Invalid layout generated",
      });
    }

    console.log(`AI Route: Returning ${layout.rows.length} rows`);

    return res.json(layout);
  } catch (error) {
    console.error("AI Route Error:", error);

    // Always return valid structure, even on error
    return res.status(500).json({
      error: error.message || "Failed to generate layout",
      rows: [
        // Fallback row
        {
          label: "A",
          seats: 12,
          aisleEvery: 6,
          zoneId: "standard",
          wheelchair: 0,
        },
      ],
    });
  }
});

/**
 * POST /api/ai/movie-recommendations
 * Gets AI-powered movie recommendations based on natural conversation
 * Body: { userInput: string, conversationHistory: Array }
 * Returns: { response: string, recommendations: Array }
 */
router.post("/movie-recommendations", async (req, res) => {
  try {
    const { userInput, conversationHistory } = req.body;

    if (!userInput) {
      return res.status(400).json({
        error: "Tell me what's on your mind!",
      });
    }

    console.log("Movie Recommendation Route: Received request");

    const result = await getMovieRecommendations(userInput, conversationHistory || []);

    console.log(`Movie Recommendation Route: Returning ${result.recommendations.length} recommendations`);

    return res.json(result);
  } catch (error) {
    console.error("Movie Recommendation Route Error:", error);
    return res.status(500).json({
      error: error.message || "Something went wrong. Try again!",
      recommendations: [],
    });
  }
});

module.exports = router;

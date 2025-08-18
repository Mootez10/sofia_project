const express = require("express");

const router = express.Router();
const MSG = require("../constants/messages");
const Action = require("../models/action.model");

// GET all actions
router.get("/", async (req, res) => {
  try {
    const actions = await Action.find();
    res.json(actions);
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.error("getActions error:", err);
    }
    res.status(500).json({ message: MSG.FAILED_TO_LOAD_ACTIONS });
  }
});

module.exports = router;

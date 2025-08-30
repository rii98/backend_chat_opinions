// routes/user.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { User } from "../models/user.model.js";

const router = express.Router();

// Store public key (called when user logs in first time)
router.post("/storeKey", protectRoute, async (req, res) => {
  try {
    const { publicKey } = req.body;
    const user = await User.findOneAndUpdate(
      { clerkId: req.auth().userId },
      { publicKey },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Public key stored successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error storing public key" });
  }
});

// Get a user’s public key (for encrypting messages)
router.get("/:clerkId/publicKey", protectRoute, async (req, res) => {
  try {
    const { clerkId } = req.params;
    const user = await User.findOne({ clerkId });
    if (!user || !user.publicKey)
      return res.status(404).json({ message: "Public key not found" });

    res.json({ publicKey: user.publicKey });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching public key" });
  }
});

export default router;

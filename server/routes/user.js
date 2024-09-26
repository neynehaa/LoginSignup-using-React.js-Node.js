import express from "express";
import User from "../models/user.js";

const router = express.Router();

router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Error fetching user profile" });
  }
});

export default router;

const express = require("express");

const auth = require("../middleware/auth.middleware");

const Team = require("../models/team");
const cloudinary = require("../cloudinary");

const router = express.Router();

/* =========================
   CREATE TEAM
========================= */

router.post("/create", auth, async (req, res) => {

  try {

    const email = req.user.email.toLowerCase();

    const exists = await Team.findOne({ userEmail: email });

    if (exists) {
      return res.json({ success: false, message: "Ya tienes un equipo" });
    }

    const team = await Team.create({
      userEmail: email,
      name: req.body.name?.trim(),
      description: req.body.description || "",
      members: [
        {
          name: req.user.name,
          email,
          role: req.user.role || "Sin rol",
          isLeader: true
        }
      ]
    });

    res.json({ success: true, team });

  } catch (err) {
    res.status(500).json({ success: false });
  }
});

/* =========================
   GET TEAM
========================= */

router.get("/", auth, async (req, res) => {

  try {

    const email = req.user.email.toLowerCase();

    const team = await Team.findOne({
      $or: [
        { userEmail: email },
        { "members.email": email }
      ]
    });

    res.json({ team: team || null });

  } catch (err) {
    res.status(500).json({ error: "Error servidor" });
  }
});

/* =========================
   UPDATE TEAM
========================= */

router.put("/update", auth, async (req, res) => {

  try {

    const email = req.user.email.toLowerCase();

    let imageUrl = null;

    if (req.body.image) {
      const upload = await cloudinary.uploader.upload(req.body.image, {
        folder: "teams",
        transformation: [{ width: 500, height: 500, crop: "fill" }]
      });

      imageUrl = upload.secure_url;
    }

    const updated = await Team.findOneAndUpdate(
      { userEmail: email },
      {
        name: req.body.name?.trim(),
        description: req.body.description || "",
        ...(imageUrl && { image: imageUrl })
      },
      { new: true }
    );

    res.json({ message: "Equipo actualizado", team: updated });

  } catch (err) {
    res.status(500).json({ message: "Error servidor" });
  }
});

module.exports = router;
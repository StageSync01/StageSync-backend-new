const express = require("express");
const Invite = require("../models/invite");

const router = express.Router();

/* =========================
   CREATE INVITE
========================= */

router.post("/create", async (req, res) => {

  try {

    const token =
      Math.random().toString(36).substring(2, 10) +
      Date.now().toString(36);

    const invite = await Invite.create({
      teamId: req.body.teamId,
      token,
      createdAt: new Date()
    });

    const link =
      `${process.env.FRONTEND_URL}/frontend/invite.html?token=${token}`;

    res.json({ link, invite });

  } catch (err) {
    res.status(500).json({ message: "Error creando invitación" });
  }
});

module.exports = router;
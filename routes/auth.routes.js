const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

const startGoogleAuth = (mode) => (req, res, next) => {
  const redirect = req.query.redirect;

  if (!redirect) {
    return res.status(400).json({
      error: "Missing redirect URL"
    });
  }

  const state = encodeURIComponent(
    JSON.stringify({ redirect, mode })
  );

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state,
    prompt: "select_account"
  })(req, res, next);
};

router.get("/google/login", startGoogleAuth("login"));
router.get("/google/register", startGoogleAuth("register"));

/* =========================
   CALLBACK
========================= */

router.get("/google/callback", (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Passport error:", err);
      return res.redirect("stagesync1://auth?error=auth");
    }

    let redirect = "stagesync1://auth";

    try {
      if (req.query.state) {
        const parsed = JSON.parse(decodeURIComponent(req.query.state));
        redirect = parsed.redirect || redirect;
      }
    } catch (e) {
      console.log("❌ Error parsing state:", e);
    }

    if (!user) {
      const errorCode = info?.message || "auth";
      const separator = redirect.includes("?") ? "&" : "?";
      return res.redirect(`${redirect}${separator}error=${encodeURIComponent(errorCode)}`);
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const separator = redirect.includes("?") ? "&" : "?";
    const finalUrl = `${redirect}${separator}token=${encodeURIComponent(token)}`;

    console.log("🚀 FINAL URL:", finalUrl);

    return res.redirect(finalUrl);
  })(req, res, next);
});

module.exports = router;
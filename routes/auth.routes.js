const express = require("express");
const passport = require("passport");

const router = express.Router();

/* =========================
   GOOGLE LOGIN
========================= */

router.get("/google/login",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "login"
  })
);

router.get("/google/register",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: "register"
  })
);

/* =========================
   CALLBACK
========================= */

router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google`
  }),
  (req, res) => {
    return res.redirect(`${process.env.FRONTEND_URL}/inicio`);
  }
);

/* =========================
   ME
========================= */

router.get("/me", (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: "No auth" });
  }

  res.json(req.user);
});

module.exports = router;
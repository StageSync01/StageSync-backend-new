const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

/* =========================
   GOOGLE LOGIN
========================= */

router.get("/google/login", (req, res, next) => {
  // 🔥 La app DEBE mandar esto: stagesync1://auth
  const redirect = req.query.redirect;

  if (!redirect) {
    return res.status(400).json({
      error: "Missing redirect URL"
    });
  }

  // 🔐 Guardamos el redirect dentro de state
  const state = encodeURIComponent(
    JSON.stringify({ redirect })
  );

  passport.authenticate("google", {
    scope: ["profile", "email"],
    state
  })(req, res, next);
});

/* =========================
   CALLBACK
========================= */

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    // 🔥 IMPORTANTE: mismo scheme que tu app.json
    failureRedirect: "stagesync1://auth?error=auth"
  }),
  (req, res) => {

    console.log("👉 CALLBACK HIT");

    // 🔐 Validación
    if (!req.user) {
      return res.redirect("stagesync1://auth?error=no_user");
    }

    // 🔐 Crear token
    const token = jwt.sign(
      {
        id: req.user.id,
        email: req.user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    let redirect = null;

    // 🔍 Leer state de forma segura
    try {
      if (req.query.state) {
        const parsed = JSON.parse(
          decodeURIComponent(req.query.state)
        );
        redirect = parsed.redirect;
      }
    } catch (e) {
      console.log("❌ Error parsing state:", e);
    }

    // � Fallback si la app envía redirect directo en callback
    if (!redirect && req.query.redirect) {
      redirect = req.query.redirect;
    }

    // �🔥 Fallback producción
    if (!redirect) {
      redirect = "stagesync1://auth";
    }

    // 🔧 Construir URL correctamente
    const separator = redirect.includes("?") ? "&" : "?";
    const finalUrl = `${redirect}${separator}token=${token}`;

    console.log("🚀 FINAL URL:", finalUrl);

    // 🚀 Redirigir a la app
    return res.redirect(finalUrl);
  }
);

module.exports = router;
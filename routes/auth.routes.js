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
      { expiresIn: "30d" }  // 🔥 Aumentado de 7d a 30d
    );

    const separator = redirect.includes("?") ? "&" : "?";
    const finalUrl = `${redirect}${separator}token=${encodeURIComponent(token)}`;

    console.log("🚀 FINAL URL:", finalUrl);

    return res.redirect(finalUrl);
  })(req, res, next);
});

/* =========================
   REFRESH TOKEN
========================= */

router.post("/refresh-token", (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: "Token requerido"
      });
    }

    console.log("🔄 [Auth] Intentando refrescar token...");

    // Decodificar sin verificar para obtener los datos
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token aún válido, devolviendo el mismo");
      return res.json({ token });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        // Token expirado, vamos a decodificarlo sin verificar
        decoded = jwt.decode(token);
        
        if (!decoded) {
          return res.status(401).json({
            error: "Token inválido"
          });
        }

        console.log("🔄 Token expirado, generando nuevo...");

        const newToken = jwt.sign(
          {
            id: decoded.id,
            email: decoded.email
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );

        console.log("✅ Token renovado");

        res.json({
          token: newToken
        });
      } else {
        return res.status(401).json({
          error: "Token inválido"
        });
      }
    }
  } catch (error) {
    console.error("❌ Error renovando token:", error);
    res.status(500).json({
      error: "Error renovando token"
    });
  }
});

module.exports = router;
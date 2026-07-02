
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // 🔥 Debe coincidir EXACTAMENTE con Google Cloud Console
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        "https://stagesync-backend-new-production.up.railway.app/auth/google/callback",

      // 🔥 Necesario en Railway / proxies
      proxy: true,

      // 🔥 Necesario porque usas state
      passReqToCallback: true
    },

    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("🔐 [Passport] Procesando autenticación de Google...");

        if (!profile || !profile.id) {
          console.error("❌ [Passport] No profile from Google");
          return done(new Error("No profile from Google"), null);
        }

        const email = profile.emails?.[0]?.value;
        if (!email) {
          console.error("❌ [Passport] No email from Google");
          return done(new Error("No email from Google"), null);
        }

        console.log("🔐 [Passport] Email de Google:", email);
        console.log("🔐 [Passport] Display Name:", profile.displayName);

        let mode = "login";
        if (req.query.state) {
          try {
            const state = JSON.parse(decodeURIComponent(req.query.state));
            mode = state?.mode || "login";
            console.log("🔐 [Passport] Mode desde state:", mode);
          } catch (e) {
            console.log("❌ [Passport] Error parsing state:", e);
          }
        }

        console.log("🔐 [Passport] Buscando usuario con email:", email);

        let user = await User.findOne({ email });

        console.log("🔐 [Passport] Usuario encontrado:", !!user);

        if (mode === "login") {
          if (!user) {
            console.log("❌ [Passport] Login mode - usuario no existe");
            return done(null, false, { message: "user_not_found" });
          }

          if (!user.googleId) {
            user.googleId = profile.id;
            user.lastUpdated = new Date();
            await user.save();
            console.log("✅ [Passport] googleId actualizado");
          }

          console.log("✅ [Passport] Login exitoso para:", user.email);
          return done(null, user);
        }

        if (mode === "register") {
          if (user) {
            console.log("❌ [Passport] Register mode - usuario ya existe");
            return done(null, false, { message: "already_registered" });
          }

          console.log("🔐 [Passport] Creando nuevo usuario...");

          try {
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email,
              lastUpdated: new Date()
            });

            console.log("✅ [Passport] Nuevo usuario creado:", user.email);
            return done(null, user);
          } catch (createError) {
            console.error("❌ [Passport] Error creando usuario:", createError.message);
            return done(createError);
          }
        }

        console.log("❌ [Passport] Mode inválido:", mode);
        return done(null, false, { message: "invalid_mode" });
      } catch (error) {
        console.error("❌ [Passport] Error completo:", error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
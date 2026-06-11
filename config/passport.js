
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
        if (!profile || !profile.id) {
          return done(new Error("No profile from Google"), null);
        }

        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email from Google"), null);
        }

        let mode = "login";
        if (req.query.state) {
          try {
            const state = JSON.parse(decodeURIComponent(req.query.state));
            mode = state?.mode || "login";
          } catch (e) {
            console.log("❌ Error parsing state in passport:", e);
          }
        }

        let user = await User.findOne({ email });

        if (mode === "login") {
          if (!user) {
            return done(null, false, { message: "user_not_found" });
          }

          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }

          return done(null, user);
        }

        if (mode === "register") {
          if (user) {
            return done(null, false, { message: "already_registered" });
          }

          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email
          });
          return done(null, user);
        }

        return done(null, false, { message: "invalid_mode" });
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
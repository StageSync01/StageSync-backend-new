
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const User = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,

      // 🔥 Debe coincidir EXACTAMENTE con Google Cloud Console
      callbackURL: "https://stagesync-backend-new-production.up.railway.app/auth/google/callback",

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

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value || ""
          });
        }

        return done(null, user);

      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
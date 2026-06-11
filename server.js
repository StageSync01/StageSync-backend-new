require("dotenv").config();

console.log("🔥🔥🔥 NUEVO BUILD BACKEND 🔥🔥🔥");
console.log("🔐 CLIENT ID:", process.env.GOOGLE_CLIENT_ID);
console.log("🔐 CLIENT SECRET:", process.env.GOOGLE_CLIENT_SECRET);

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

// 🔥 SOLO inicializar passport (sin session)
require("./config/passport");

const app = express();

/* =========================
   MIDDLEWARE BASE
========================= */

app.use(cors({
  origin: true,
  credentials: true
}));

app.set("trust proxy", 1);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ❌ ELIMINAMOS express-session (no lo necesitas con JWT)

/* =========================
   PASSPORT
========================= */

app.use(passport.initialize());
// ❌ NO usar passport.session()

/* =========================
   DB
========================= */

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Mongo conectado"))
  .catch(err => console.log(err));

/* =========================
   ROUTES
========================= */

app.use("/auth", require("./routes/auth.routes"));
app.use("/user", require("./routes/user.routes"));
app.use("/team", require("./routes/team.routes"));
app.use("/invite", require("./routes/invite.routes"));

/* =========================
   SERVER
========================= */

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

// 🔥 ENDPOINT DE DEBUG - Verificar que el código está actualizado
app.get("/debug/auth", (req, res) => {
  res.json({
    status: "ok",
    message: "✅ Código actualizado - JWT authentication habilitada",
    timestamp: new Date().toISOString(),
    jwt_secret: process.env.JWT_SECRET ? "✅ Definida" : "❌ Falta JWT_SECRET en .env",
    mongo_uri: process.env.MONGO_URI ? "✅ Definida" : "❌ Falta MONGO_URI en .env"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on ${PORT}`);
});
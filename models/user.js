const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },

  role: {
    type: String,
    default: "Sin rol"
  },

  googleId: {
    type: String
  },

  // 🔥 NUEVOS CAMPOS PARA AUTO-GUARDADO
  settings: {
    darkMode: {
      type: Boolean,
      default: true
    },
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    language: {
      type: String,
      default: "es"
    }
  },

  selectedTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    default: null
  },

  preferences: {
    theme: {
      type: String,
      default: "dark"
    },
    notifications: {
      type: String,
      default: "all"
    }
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

// 🔥 Actualizar lastUpdated antes de guardar
userSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

module.exports = mongoose.model("User", userSchema);
const mongoose = require("mongoose");

const inviteSchema = new mongoose.Schema({

  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    required: true,
    index: true
  },

  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 60 * 24 * 7 // 🔥 expira en 7 días
  }

});

module.exports = mongoose.model("Invite", inviteSchema);
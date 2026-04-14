const mongoose = require("mongoose");

const teamMemberSchema = new mongoose.Schema({

  name: String,

  email: {
    type: String,
    lowercase: true,
    index: true
  },

  role: String,

  isLeader: {
    type: Boolean,
    default: false
  }

});

const teamSchema = new mongoose.Schema({

  userEmail: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },

  name: {
    type: String,
    trim: true
  },

  description: {
    type: String,
    default: ""
  },

  image: {
    type: String,
    default: null
  },

  members: [teamMemberSchema],

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Team", teamSchema);
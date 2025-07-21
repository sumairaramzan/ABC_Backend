const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  privacy: { type: String, required: true },
  size: { type: Number, default: 20 },
  language: { type: String, default: "en" },
  features: {
    timer: { type: Boolean, default: true },
    voice: { type: Boolean, default: false },
    text: { type: Boolean, default: true },
    whiteboard: { type: Boolean, default: false },
    files: { type: Boolean, default: false },
    camera: { type: Boolean, default: false }
  },
  timerSettings: {
    studyTime: { type: Number, default: 25 },
    breakTime: { type: Number, default: 5 }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", RoomSchema);

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Create Schema
const VideoSchema = new Schema({
  title: String,
  claps: Number,
  url: String,
  speakerName: String,
  speakerLocation: String,
});

module.exports = video = mongoose.model("video", VideoSchema);

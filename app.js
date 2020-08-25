const express = require("express");
const app = express();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

// console.log(dotenv.parsed);
// this gives the variables in the .env file in the json format
const Video = require("./VideoSchema");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");

const db = process.env.MONGODB_URI;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Mongo Db connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.render("pages/index");
});

app.get("/videos", (req, res) => {
  Video.find({})
    .sort({ claps: -1 })
    .exec((err, data) => {
      if (err) throw err;
      res.render("pages/videos", {
        data,
      });
    });
});

app.post("/videos", (req, res) => {
  let obj = JSON.parse(JSON.stringify(req.body));
  const newVideo = new Video({
    title: obj.title,
    claps: 0,
    url: obj.video,
    speakerName: obj.speakerName,
    speakerLocation: obj.speakerLocation,
  });

  newVideo.save().then(res.render("pages/thanks", { flag: "add" }));
});

app.post("/upvote/:id", (req, res) => {
  Video.updateOne({ _id: req.params.id }, { $inc: { claps: 1 } }).exec(
    (err, data) => {
      if (err) throw err;
      res.render("pages/thanks", { flag: "upvote" });
    }
  );
});

app.get("/leaderboard", (req, res) => {
  Video.find({})
    .sort({ claps: -1 })
    .exec((err, data) => {
      if (err) throw err;
      res.render("pages/leaderboard", {
        data,
      });
      // res.json(data);
    });
});

app.listen(PORT, (req, res) => console.log(`Server Started on ${PORT}`));

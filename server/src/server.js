const mongoose = require("mongoose");
const express = require("express");
var cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
var async = require('async');
// const Actor = require("./data");
// const Article = require("./data");
// const Location = require("./data");
const { Actor, ActorConnection, Article, Location } = require('./data');

const app = express();
app.use(cors());
const router = express.Router();
// mongoose.Promise = Promise;

const API_PORT = 3001;

// this is our MongoDB database
const dbRoute = "mongodb://localhost:27017/test_database";

// connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true }
);

let db = mongoose.connection;

db.once("open", () => console.log("connected to the database"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// ACTORS
// this is our get method
// this method fetches all available data in our database
router.get("/actors", (req, res) => {
  const limit = req.query.limit ? +req.query.limit : 200;
  console.log(limit);
  Actor.find()
    .populate('connections')
    .limit(limit)
    .exec()
    .then((actors) => {
      Actor.countDocuments().exec((err, actorCount) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data:{ actors, actorCount } })
      })
    })
    .catch((err) => {
      return res.json({ success: false, error: err });
    });
});

// router.get("/actors/:actorId", (req, res) => {
//   const { actorId } = req.params;
//   const actor = Actor.findOne({_id: actorId })
//     .populate('articleIDs')
//     .populate('locationIDs')
//     .populate('connections')
//     .exec((err, data) => {
//       if (err) return res.json({ success: false, error: err });
//       const actorConnections = data.connections;
//       const actorArry = [];
//       for (var [key, value] of actorConnections) {
//         actorArry.push(key);
//       }

//       const connectedActors = Actor.find()
//         .where('_id')
//         .in(actorArry)
//         .select(['name', 'actorType'])
//         .exec((err, connectedActors) => {
//           if (err) return res.json({ success: false, error: err });
//           return res.json({ success: true, data:{ actor: data, connectedActors  } })
//         })
//     })
// });

router.get("/actors/:actorId", (req, res) => {
  const { actorId } = req.params;
  const actor = Actor.findOne({_id: actorId })
    .populate('articleIDs')
    .populate('locationIDs')
    .populate('connections')
    .exec()
    .then((data) => {
      const actorConnections = data.connections;
      const actorArry = [];
      for (var [key, value] of actorConnections) {
        actorArry.push(key);
      }
      return { actorDetail: data, actorArry};
    }).then((data) => {
      const { actorArry, actorDetail } = data;
      const connectedActors = Actor.find()
        .where('_id')
        .in(actorArry)
        .select(['name', 'actorType'])
        .exec((err, connectedActors) => {
          if (err) return res.json({ success: false, error: err });
          return res.json({ success: true, data:{ actor: actorDetail, connectedActors } })
        });
    }).catch((err) => {
      return res.json({ success: false, error: err });
    });
});

router.get("/actors/:actorId/connections", (req, res) => {
  const { actorId } = req.params;
  ActorConnection
    .find({ actorIDs: mongoose.Types.ObjectId(actorId) })
    .populate('actorIDs', 'name')
    .populate('articleIDs', 'url')
    .populate('locationIDs')
    .exec((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
});

// ARTICLES

router.get("/articles", (req, res) => {
  Article.find().limit(20).exec((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

router.get("/articles/:articleId", (req, res) => {
  const { articleId } = req.params;
  Article.findOne({ _id: articleId })
    .populate('actorIDs')
    .populate('peopleIDs')
    .populate('orgIDs')
    .populate('locationIDs')
    .exec((err, data) => {
      if (err) return res.json({ success: false, error: err });
      return res.json({ success: true, data: data });
    });
});

// LOCATIONS

router.get("/locations", (req, res) => {
  Location.find().limit(20).exec((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});


// append /api for our http requests
app.use("/api", router);

var server = app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));

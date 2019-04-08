const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ActorSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: String,
    _a_name: String,
    actorType: String,
    locationID: String,
    articleIDs: Array
  },
  {collection: 'actor'}
);

// this will be our data base's data structure 
const ArticleSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
	url: String,
	actorIDs: Array,
	peopleIDs: Array,
	orgIDs: Array,
	locationIDs: Array,
	keywords: Array
  },
  {collection: 'article'}
);

const LocationSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
	name: String,
	latitude: Number,
	longitude: Number,
	type: String
  },
  {collection: 'location'}
);

// export the new Schema so we could modify it using Node.js
module.exports = {
	'Actor': mongoose.model("Actor", ActorSchema),
	'Article': mongoose.model("Article", ArticleSchema),
	'Location': mongoose.model("Location", LocationSchema)
}
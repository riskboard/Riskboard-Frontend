const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const ActorSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    name: String,
    _a_name: String,
    actorType: String,
    locationID: { type: Schema.Types.ObjectId, ref: 'Location' },
    articleIDs: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    connections: { 
      type: Map, 
      of: { type: Schema.Types.ObjectId, ref: 'ActorConnection'}
    }
  },
  { collection: 'actor' }
);

const ActorConnectionSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
    actorIDs: [{ type: Schema.Types.ObjectId, ref: 'Actor' }],
    strength: Number,
    articleIDs: { type: Schema.Types.ObjectId, ref: 'Article' },
    sentiment: String
  },
  { collection: 'actor_connection' }
);

// this will be our data base's data structure 
const ArticleSchema = new Schema(
  {
    _id: Schema.Types.ObjectId,
	url: String,
	actorIDs: [{ type: Schema.Types.ObjectId, ref: 'Actor' }],
	peopleIDs: [{ type: Schema.Types.ObjectId, ref: 'Actor' }],
	orgIDs: [{ type: Schema.Types.ObjectId, ref: 'Actor' }],
	locationIDs: [{ type: Schema.Types.ObjectId, ref: 'Location' }],
	keywords: [{ type: String }]
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
  { collection: 'location' }
);

// export the new Schema so we could modify it using Node.js
module.exports = {
	'Actor': mongoose.model("Actor", ActorSchema),
  'ActorConnection': mongoose.model("ActorConnection", ActorConnectionSchema),
	'Article': mongoose.model("Article", ArticleSchema),
	'Location': mongoose.model("Location", LocationSchema)
}
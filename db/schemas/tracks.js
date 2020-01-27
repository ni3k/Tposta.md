import { Schema } from 'mongoose';

const Tracks = new Schema({
  userId: Number,
  trackingNumber: String,
  trackInfo: String,
  lastUpdated: Date,
  lastEvent: String,
  username: String,
});

export default Tracks;

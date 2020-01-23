import { Schema } from 'mongoose';

const Tracks = new Schema({
  userId: Number,
  trackingNumber: String,
  trackInfo: String,
});

export default Tracks;

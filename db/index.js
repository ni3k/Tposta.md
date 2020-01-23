/* eslint-disable no-underscore-dangle */
import mongoose from 'mongoose';

const server = '127.0.0.1:27017';
const database = 'PTMD';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    mongoose.connect(`mongodb://${server}/${database}`, { useNewUrlParser: true, useUnifiedTopology: true })
      .then(() => {
        console.log('Database connection successful');
      })
      .catch((err) => {
        console.error('Database connection error', err);
      });
  }
}


export default (new Database());

import TGBot from 'node-telegram-bot-api';
import Track from '../../db/models/tracks';

require('dotenv').config();

// inherit tgbot functions
const bot = new TGBot(process.env.TG_BOT, { polling: true });

bot.startMessages = ['/start -> shows list of commands', '/track -> followed by tracking number (/track RP*****12)', '/untrack -> followed by tracking number (/untrack RP****32)'];


// set testing mode
const TEST_MODE = process.env.TEST;

bot.bulkSend = function (chatId, messages) {
  messages.forEach((ms) => {
    this.sendMessage(chatId, ms);
  });
};


bot.init = function () {
  this.onText(/\/start/, ({ chat: { id } }) => {
    this.bulkSend(id, this.startMessages);
  });

  this.onText(/\/list/, async ({ chat: { id } }) => {
    const list = await Track.find({ userId: id }, 'trackingNumber');

    if (list) {
      const oneMessage = list.map(({ trackingNumber }) => `You have registered: trackingNumber, to delete /delete_${trackingNumber}\n`).join('');
      this.sendMessage(id, oneMessage);
    } else {
      this.sendMessage(id, 'You have no tracking numbers registered');
    }
  });

  this.onText(/\/delete_(.+)/, async ({ chat: { id } }, [_, trackingNumber]) => {
    const data = await Track.findOneAndDelete({ trackingNumber, userId: id });
    if (data) {
      this.sendMessage(id, `removed ${trackingNumber}`);
    } else {
      this.sendMessage(id, `not found ${trackingNumber}`);
    }
  });

  this.onText(/\/getData (.+)/, async ({ chat: { id } }, match) => {
    const trackingNumber = match[1];
    const data = await Track.findOne({ trackingNumber, userId: id }, 'trackInfo');

    if (data) {
      const oneMessage = JSON.parse(data.trackInfo).map(({ date, event }) => `on date: ${date} with event: ${event},`).join('\n');

      this.sendMessage(id, oneMessage);
    } else {
      this.sendMessage(id, 'No registered data for this tracking number for you');
    }
  });

  this.onText(/\/track (.+)/, async ({ chat, from: { username } }, match) => {
    const trackingNumber = match[1];

    await Track.updateOne({ userId: chat.id, trackingNumber }, {
      trackingNumber,
      userId: chat.id,
      username,
      lastUpdated: new Date(),
      trackInfo: null,
      lastEvent: null,
    },
    {
      upsert: true,
    });

    this.sendMessage(chat.id, `Started tracking ${trackingNumber}, will stop if there are no updates in 2 weeks`);
  });

  if (TEST_MODE) {
    this.on('message', (msg) => {
      const chatId = msg.chat.id;
      console.log(msg);
      console.log('recieved message');
      // send a message to the chat acknowledging receipt of their message
      this.sendMessage(chatId, 'Received your message');
    });
  }
};

export default bot;

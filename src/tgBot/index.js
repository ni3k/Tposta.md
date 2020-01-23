import TGBot from 'node-telegram-bot-api';
import { saveData } from '../handleData';

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

  this.onText(/\/track (.+)/, async ({ chat }, match) => {
    const trackingNumber = match[1];

    const rsp = await saveData({ trackingNumber, userId: chat.id });

    if (rsp.error) {
      this.sendMessage(chat.id, JSON.stringify(rsp.error));
    } else {
      this.sendMessage(
        chat.id,
        `Started tracking ${trackingNumber}, will stop if there are no updates in 2 weeks`,
      );
      if (!rsp.data) {
        this.sendMessage(
          chat.id,
          'There is no registered data rn for this tracking number',
        );
        return;
      }
      const { event, date } = rsp.data.slice(-1)[0];
      this.sendMessage(chat.id, `Last event: ${event} registered on ${date}`);
      if (TEST_MODE) this.sendMessage(chat.id, JSON.stringify(rsp.data));
    }
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

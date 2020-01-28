/* eslint-disable no-new */
import TGBot from 'node-telegram-bot-api';
import Track from '../../db/models/tracks';
import BotController from './botController';

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

  // todo: second param extract from db/models;
  new BotController(bot, { Track });

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

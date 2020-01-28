/* eslint-disable class-methods-use-this */
import AbstractBot from './abstractBot';

class BotController extends AbstractBot {
  get commands() {
    return {
      'onText:start': 'start',
      'onText:list': 'list',
      'onText:delete_(.+)': 'delete',
      'onText:getData (.+)': 'getData',
      'onText:track (.+)': 'trackItem',
    };
  }

  start({ chat: { id } }) {
    this.bot.bulkSend(id, this.bot.startMessages);
  }

  async list({ chat: { id } }) {
    const list = await this.models.Track.find({ userId: id }, 'trackingNumber');

    if (list) {
      const oneMessage = list.map(({ trackingNumber }) => `You have registered: ${trackingNumber}, to delete /delete_${trackingNumber}\n`).join('');
      this.bot.sendMessage(id, oneMessage);
    } else {
      this.bot.sendMessage(id, 'You have no tracking numbers registered');
    }
  }

  // eslint-disable-next-line no-unused-vars
  async delete({ chat: { id } }, [_, trackingNumber]) {
    const data = await this.models.Track.findOneAndDelete({ trackingNumber, userId: id });
    if (data) {
      this.bot.sendMessage(id, `removed ${trackingNumber}`);
    } else {
      this.bot.sendMessage(id, `not found ${trackingNumber}`);
    }
  }

  async getData({ chat: { id } }, match) {
    const trackingNumber = match[1];
    const data = await this.models.Track.findOne({ trackingNumber, userId: id }, 'trackInfo');

    if (data) {
      const oneMessage = JSON.parse(data.trackInfo).map(({ date, event }) => `on date: ${date} with event: ${event},`).join('\n');

      this.bot.sendMessage(id, oneMessage);
    } else {
      this.bot.sendMessage(id, 'No registered data for this tracking number for you');
    }
  }

  async trackItem({ chat, from: { username } }, match) {
    const trackingNumber = match[1];

    await this.models.Track.updateOne({ userId: chat.id, trackingNumber }, {
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

    this.bot.sendMessage(chat.id, `Started tracking ${trackingNumber}, will stop if there are no updates in 2 weeks`);
  }
}

export default BotController;

/* eslint-disable class-methods-use-this */

class AbstractBot {
  constructor(bot, models) {
    if (new.target === AbstractBot) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
    if (bot === null) {
      throw new Error('Missing Bot');
    }
    if (models === null) {
      throw new Error('Missing models');
    }
    this.models = models;
    this.bot = bot;
    this.registerCommands();
  }

  get commands() {
    return {};
  }

  registerCommands() {
    const registeredCommands = this.commands;
    Object.keys(registeredCommands).forEach((command) => {
      const usedFunction = registeredCommands[command];
      const botArguments = command.split(':');
      const botListener = botArguments.length >= 1 ? botArguments[0] : 'onText';
      const botCommandToListen = botArguments.length >= 1 ? botArguments[1] : botArguments[0];
      this.bot[botListener](new RegExp(botCommandToListen), this[usedFunction].bind(this));
    });
  }
}

export default AbstractBot;

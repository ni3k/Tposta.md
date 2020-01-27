
import Bot from './src/tgBot';
import Daemon from './src/daemon';

// initialize mongoose
// eslint-disable-next-line no-unused-vars
import _DB from './db';

// init process vars
require('dotenv').config();

(async () => {
  Bot.init();
  Daemon.init();
})();

// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"db/schemas/tracks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

const Tracks = new _mongoose.Schema({
  userId: Number,
  trackingNumber: String,
  trackInfo: String
});
var _default = Tracks;
exports.default = _default;
},{}],"db/models/tracks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _tracks = _interopRequireDefault(require("../schemas/tracks"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Track = _mongoose.default.model('Track', _tracks.default);

var _default = Track;
exports.default = _default;
},{"../schemas/tracks":"db/schemas/tracks.js"}],"src/handleData/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.saveData = exports.deleteData = exports.addOrUpdateData = exports.getTrackInfo = void 0;

var cheerio = _interopRequireWildcard(require("cheerio"));

var _axios = _interopRequireDefault(require("axios"));

var _tracks = _interopRequireDefault(require("../../db/models/tracks"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const getTrackInfo = async trackNumber => {
  const {
    data
  } = await _axios.default.get(`http://posta.md/ro/tracking?id=${trackNumber}`);
  const $ = cheerio.load(data);
  const dataRows = $(".row");
  const events = [];
  dataRows.each(function () {
    const date = $(this).children(".tracking-result-header-date").text();
    const event = $(this).children(".tracking-result-header-event").text();
    events.push({
      date,
      event
    });
  });
  return events;
};

exports.getTrackInfo = getTrackInfo;

const addOrUpdateData = async ({
  data,
  userId,
  trackingNumber
}) => {
  return _tracks.default.updateOne({
    userId,
    trackingNumber
  }, {
    trackingNumber,
    userId,
    trackInfo: JSON.stringify(data)
  }, {
    upsert: true,
    setDefaultsOnInsert: true
  });
};

exports.addOrUpdateData = addOrUpdateData;

const deleteData = async ({
  userId,
  trackingNumber
}) => {
  return _tracks.default.deleteOne({
    userId,
    trackingNumber
  });
};

exports.deleteData = deleteData;

const saveData = async ({
  userId,
  trackingNumber
}) => {
  const data = await getTrackInfo(trackingNumber);

  try {
    await addOrUpdateData({
      data,
      userId,
      trackingNumber
    });
    return {
      data,
      error: null
    };
  } catch (error) {
    return {
      data: null,
      error
    };
  }
};

exports.saveData = saveData;
},{"../../db/models/tracks":"db/models/tracks.js"}],"src/tgBot/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _nodeTelegramBotApi = _interopRequireDefault(require("node-telegram-bot-api"));

var _handleData = require("../handleData");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const bot = {};
const TEST_MODE = process.env.TEST;

bot.init = function () {
  const tgBot = new _nodeTelegramBotApi.default(process.env.TG_BOT, {
    polling: true
  });
  tgBot.onText(/\/start/, ({
    chat: {
      id
    }
  }) => {
    tgBot.sendMessage(id, '/start -> shows list of commands');
    tgBot.sendMessage(id, '/track -> followed by tracking number (/track RP*****12)');
    tgBot.sendMessage(id, '/untrack -> followed by tracking number (/untrack RP****32)');
  });
  tgBot.onText(/\/track (.+)/, async ({
    chat
  }, match) => {
    const trackingNumber = match[1];
    const rsp = await (0, _handleData.saveData)({
      trackingNumber,
      userId: chat.id
    });

    if (rsp.error) {
      tgBot.sendMessage(chat.id, JSON.stringify(rsp.error));
    } else {
      tgBot.sendMessage(chat.id, `Started tracking ${trackingNumber}, will stop if there are no updates in 2 weeks`);

      if (!rsp.data) {
        tgBot.sendMessage(chat.id, "There is no registered data rn for this tracking number");
        return;
      }

      const {
        event,
        date
      } = rsp.data.slice(-1)[0];
      tgBot.sendMessage(chat.id, `Last event: ${event} registered on ${date}`);
      if (TEST_MODE) tgBot.sendMessage(chat.id, JSON.stringify(rsp.data));
    }
  });
  tgBot.on('message', msg => {
    const chatId = msg.chat.id; // console.log(msg);
    // console.log('recieved message');
    // send a message to the chat acknowledging receipt of their message

    tgBot.sendMessage(chatId, 'Received your message');
  });
};

var _default = bot;
exports.default = _default;
},{"../handleData":"src/handleData/index.js"}],"db/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = '127.0.0.1:27017';
const database = 'PTMD';

class Database {
  constructor() {
    this._connect();
  }

  _connect() {
    _mongoose.default.connect(`mongodb://${server}/${database}`).then(() => {
      console.log('Database connection successful');
    }).catch(err => {
      console.error('Database connection error');
    });
  }

}

var _default = new Database();

exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _handleData = require("./src/handleData");

var _tgBot = _interopRequireDefault(require("./src/tgBot"));

var _db = _interopRequireDefault(require("./db"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// initialize mongoose
// init process vars
require('dotenv').config();

(async () => {
  // const data = await getTrackInfo('RG910688822BE')
  // console.log(data);
  // const rs = await deleteData({ userId: 2, trackingNumber: 'RG910688822BE' });
  // console.log(rs);
  _tgBot.default.init();
})();
},{"./src/handleData":"src/handleData/index.js","./src/tgBot":"src/tgBot/index.js","./db":"db/index.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map
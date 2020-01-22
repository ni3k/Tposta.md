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
})({"db/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sqlite = _interopRequireDefault(require("sqlite3"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const dbConn = _sqlite.default.verbose();

const dbConnection = new dbConn.Database('./data.db', err => {
  if (err) {
    console.log(err.message);
  }

  console.log('Connected');
});
var _default = dbConnection;
exports.default = _default;
},{}],"src/handleData/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.lastEntries = exports.addOrUpdateData = exports.getTrackInfo = void 0;

var cheerio = _interopRequireWildcard(require("cheerio"));

var _axios = _interopRequireDefault(require("axios"));

var _db = _interopRequireDefault(require("../../db"));

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
  const sql = `CASE EXISTS ( select * from TRACKS )`;
  console.log(sql);

  _db.default.run(sql, err => {
    console.log(err);
  });
};

exports.addOrUpdateData = addOrUpdateData;

const lastEntries = async () => {
  _db.default.all("select * from TRACKS where user_id='1' AND trackingNumber='RP877761813CN'", [], (err, rows) => {
    console.log(rows);
  });
};

exports.lastEntries = lastEntries;
},{"../../db":"db/index.js"}],"db/create.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTable = void 0;

var _index = _interopRequireDefault(require("./index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const createTable = () => {
  _index.default.run('CREATE TABLE TRACKS("user_id" INTEGER, trackingNumber varchar(256), "trackinfo" nvarchar(1000), "id" INTEGER PRIMARY KEY AUTOINCREMENT)', err => {
    console.log(err);
  });

  _index.default.close();
};

exports.createTable = createTable;
},{"./index":"db/index.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _handleData = require("./src/handleData");

var _create = require("./db/create");

(async () => {
  // createTable();
  const data = await (0, _handleData.getTrackInfo)('RP877761813CN');
  console.log(data);
  (0, _handleData.addOrUpdateData)({
    userId: 1,
    trackingNumber: 'RP877761813CN',
    data
  }); // lastEntries();

  console.log('da');
})();
},{"./src/handleData":"src/handleData/index.js","./db/create":"db/create.js"}]},{},["index.js"], null)
//# sourceMappingURL=/index.js.map
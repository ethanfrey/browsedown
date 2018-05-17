"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const abstract_leveldown_1 = require("abstract-leveldown");
const idb_wrapper_1 = __importDefault(require("idb-wrapper"));
class BrowseDown extends abstract_leveldown_1.AbstractLevelDOWN {
    _open(opts, callback) { }
    _close(callback) { }
    _get(key, options, callback) { }
    _put(key, value, options, callback) { }
    _del(key, options, callback) { }
}
exports.BrowseDown = BrowseDown;
function makeDB(name, onStoreReady) {
    return new idb_wrapper_1.default({ storeName: name }, onStoreReady);
}
exports.makeDB = makeDB;
//# sourceMappingURL=index.js.map
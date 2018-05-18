"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var iterator_1 = require("./iterator");
exports.Iterator = iterator_1.Iterator;
var store_1 = require("./store");
exports.BrowseDown = store_1.BrowseDown;
var idb_wrapper_1 = __importDefault(require("idb-wrapper"));
function makeDB(name, onStoreReady) {
    return new idb_wrapper_1.default({ storeName: name }, onStoreReady);
}
exports.makeDB = makeDB;
//# sourceMappingURL=index.js.map
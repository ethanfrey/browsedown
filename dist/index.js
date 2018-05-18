"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _1 = require(".");
var iterator_1 = require("./iterator");
exports.Iterator = iterator_1.Iterator;
var store_1 = require("./store");
exports.BrowseDown = store_1.BrowseDown;
function browsedown(name) {
    return new _1.BrowseDown(name);
}
exports.browsedown = browsedown;
//# sourceMappingURL=index.js.map
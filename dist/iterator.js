"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_leveldown_1 = require("abstract-leveldown");
var Iterator = (function (_super) {
    __extends(Iterator, _super);
    function Iterator(idb, options) {
        var _this = _super.call(this, null) || this;
        _this.stop = false;
        _this.results = [];
        var opts = _this.convertOptions(options);
        idb.iterate(_this.onItem.bind(_this), opts);
        return _this;
    }
    Iterator.prototype._next = function (callback) {
        var item = this.results.shift();
        if (!item) {
            this.end(this.finish.bind(this));
            process.nextTick(callback, new Error("Hit end of iterator"));
        }
        else {
            process.nextTick(callback, null, item.key, item.value);
        }
    };
    Iterator.prototype._end = function (callback) {
        this.stop = true;
        process.nextTick(callback);
    };
    Iterator.prototype.onItem = function (value, cursor) {
        if (this.stop || !value) {
            return;
        }
        var pair = { key: cursor.key, value: value };
        this.results.push(pair);
    };
    Iterator.prototype.finish = function () {
        this.stop = true;
    };
    Iterator.prototype.convertOptions = function (options) {
        return {
            onEnd: this.finish.bind(this)
        };
    };
    return Iterator;
}(abstract_leveldown_1.AbstractIterator));
exports.Iterator = Iterator;
//# sourceMappingURL=iterator.js.map
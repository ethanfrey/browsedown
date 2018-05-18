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
var types_1 = require("./types");
var Iterator = (function (_super) {
    __extends(Iterator, _super);
    function Iterator(idb, options) {
        var _this = _super.call(this, null) || this;
        _this.stop = false;
        _this.results = [];
        _this.callback = null;
        _this.opts = _this.convertOptions(idb, options || {});
        _this.idb = idb;
        _this.cleanKey = options.keyAsBuffer !== false;
        _this.cleanValue = options.valueAsBuffer !== false;
        _this.idb.iterate(_this.onItem.bind(_this), _this.opts);
        return _this;
    }
    Iterator.prototype._next = function (callback) {
        var waiting = this.results.shift();
        if (waiting) {
            process.nextTick(callback, undefined, waiting.key, waiting.value);
            return;
        }
        if (this.stop) {
            process.nextTick(callback);
        }
        this.callback = callback;
    };
    Iterator.prototype._end = function (callback) {
        this.stop = true;
        this.callback = null;
        process.nextTick(callback);
    };
    Iterator.prototype.onItem = function (value, cursor) {
        var clean = types_1.cleanResult();
        var pair = {
            key: this.cleanKey ? clean(cursor.key) : cursor.key,
            value: this.cleanValue ? clean(cursor.value) : cursor.value
        };
        if (!this.callback) {
            this.results.push(pair);
            cursor.continue();
            return;
        }
        if (this.stop || !value) {
            return this.callback();
        }
        var cb = this.callback;
        this.callback = null;
        cb(undefined, pair.key, pair.value);
        cursor.continue();
    };
    Iterator.prototype.finish = function () {
        this.stop = true;
        if (this.callback) {
            this.callback();
            this.callback = null;
        }
    };
    Iterator.prototype.convertOptions = function (idb, opts) {
        var _this = this;
        var result = {
            autoContinue: false,
            limit: opts.limit,
            onEnd: this.finish.bind(this),
            onError: function () {
                _this.finish();
            },
            order: opts.reverse ? "DESC" : "ASC"
        };
        if (opts.gt || opts.gte || opts.lt || opts.lte) {
            var rangeOpts = {
                excludeLower: !!opts.gt,
                excludeUpper: !!opts.lt,
                lower: opts.gte || opts.gt,
                upper: opts.lte || opts.lt
            };
            result.keyRange = idb.makeKeyRange(rangeOpts);
        }
        return result;
    };
    return Iterator;
}(abstract_leveldown_1.AbstractIterator));
exports.Iterator = Iterator;
//# sourceMappingURL=iterator.js.map
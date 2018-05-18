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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var abstract_leveldown_1 = require("abstract-leveldown");
var idb_wrapper_1 = __importDefault(require("idb-wrapper"));
var iterator_1 = require("./iterator");
var BrowseDown = (function (_super) {
    __extends(BrowseDown, _super);
    function BrowseDown(name) {
        var _this = _super.call(this, name) || this;
        _this.idb = null;
        return _this;
    }
    BrowseDown.prototype._open = function (opts, callback) {
        var options = {
            autoIncrement: false,
            keyPath: null,
            onError: function (err) { return callback && callback(err); },
            onStoreReady: function () { return callback && callback(); },
            storeName: this.location
        };
        this.idb = new idb_wrapper_1.default(options);
    };
    BrowseDown.prototype._close = function (callback) {
        if (this.idb != null) {
            this.idb.db.close();
            this.idb = null;
        }
        callback();
    };
    BrowseDown.prototype._get = function (key, options, callback) {
        if (this.idb == null) {
            return callback(new Error("Database not open"));
        }
        var cleanResult = function (value) {
            if (value === undefined) {
                return callback(new Error("NotFound"));
            }
            var asBuffer = true;
            if (options.raw || options.asBuffer === false) {
                asBuffer = false;
            }
            var bufValue = value;
            if (asBuffer) {
                bufValue =
                    value instanceof Uint8Array
                        ? Buffer.from(value.buffer)
                        : Buffer.from(String(value));
            }
            return callback(null, bufValue, key);
        };
        this.idb.get(key, cleanResult, callback);
    };
    BrowseDown.prototype._put = function (key, value, options, callback) {
        if (this.idb == null) {
            return callback(new Error("Database not open"));
        }
        var obj = this.convertEncoding(key, value, options);
        this.idb.put(obj.key, obj.value, function () { return callback(); }, callback);
    };
    BrowseDown.prototype._del = function (key, options, callback) {
        if (this.idb == null) {
            return callback(new Error("Database not open"));
        }
        this.idb.remove(key, callback, callback);
    };
    BrowseDown.prototype._iterator = function (options) {
        if (this.idb == null) {
            throw new Error("Database not open");
        }
        return new iterator_1.Iterator(this.idb, options);
    };
    BrowseDown.prototype.convertEncoding = function (key, value, options) {
        if (options.raw) {
            return { key: key, value: value };
        }
        var valEnc = options.valueEncoding;
        var myVal = value;
        if (value) {
            var stringed = value.toString();
            if (stringed === "NaN") {
                myVal = "NaN";
            }
            else if (valEnc !== "binary" && typeof value !== "object") {
                myVal = stringed;
            }
        }
        return { key: key, value: myVal };
    };
    return BrowseDown;
}(abstract_leveldown_1.AbstractLevelDOWN));
exports.BrowseDown = BrowseDown;
//# sourceMappingURL=store.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanResult = function (opts) {
    if (opts === void 0) { opts = {}; }
    return function (value) {
        var asBuffer = true;
        if (opts.raw || opts.asBuffer === false) {
            asBuffer = false;
        }
        var bufValue = value;
        if (asBuffer) {
            bufValue =
                value instanceof Uint8Array
                    ? Buffer.from(value.buffer)
                    : Buffer.from(String(value));
        }
        return bufValue;
    };
};
//# sourceMappingURL=types.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resistance = void 0;
var Resistance;
(function (Resistance) {
    Resistance[Resistance["WEAK"] = 2] = "WEAK";
    Resistance[Resistance["NORMAL"] = 1] = "NORMAL";
    Resistance[Resistance["STRONG"] = 0.5] = "STRONG";
    Resistance[Resistance["IMMUNE"] = 0] = "IMMUNE";
})(Resistance = exports.Resistance || (exports.Resistance = {}));
exports.default = Resistance;

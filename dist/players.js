"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar2 = exports.Arbok = exports.Haunter = exports.Golbat = exports.Gengar1 = exports.Weedle = void 0;
const Move = require("./moves");
const type_1 = require("./type");
exports.Weedle = {
    Types: [type_1.default.Bug, type_1.default.Poison],
    Level: 100,
    AttackPower: { Normal: 140, Special: 110 },
    DefenseStat: { Normal: 130, Special: 110 },
    MaxHealth: 255,
    SpeedStat: 170,
    Moves: [Move.PoisonSting],
    CriticalDamagePct: 50 / 512,
    superPotionsLeft: 0,
};
exports.Gengar1 = {
    Types: [type_1.default.Ghost, type_1.default.Poison],
    Level: 56,
    AttackPower: { Normal: 87, Special: 159 },
    DefenseStat: { Normal: 81, Special: 159 },
    MaxHealth: 142,
    SpeedStat: 137,
    Moves: [Move.ConfuseRay, Move.NightShade, Move.Hypnosis, Move.DreamEater],
    CriticalDamagePct: 110 / 512,
    superPotionsLeft: Infinity,
};
exports.Golbat = {
    Types: [type_1.default.Poison, type_1.default.Flying],
    Level: 56,
    AttackPower: { Normal: 104, Special: 97 },
    DefenseStat: { Normal: 92, Special: 97 },
    MaxHealth: 158,
    SpeedStat: 114,
    Moves: [Move.Supersonic, Move.ConfuseRay, Move.WingAttack, Move.Haze],
    CriticalDamagePct: 90 / 512,
    superPotionsLeft: Infinity,
};
exports.Haunter = {
    Types: [type_1.default.Ghost, type_1.default.Poison],
    Level: 55,
    AttackPower: { Normal: 69, Special: 140 },
    DefenseStat: { Normal: 63, Special: 140 },
    MaxHealth: 123,
    SpeedStat: 118,
    Moves: [Move.ConfuseRay, Move.NightShade, Move.Hypnosis, Move.DreamEater],
    CriticalDamagePct: 95 / 512,
    superPotionsLeft: Infinity,
};
exports.Arbok = {
    Types: [type_1.default.Poison],
    Level: 58,
    AttackPower: { Normal: 114, Special: 89 },
    DefenseStat: { Normal: 94, Special: 89 },
    MaxHealth: 146,
    SpeedStat: 107,
    Moves: [Move.Bite, Move.Glare, Move.Screech, Move.Acid],
    CriticalDamagePct: 80 / 512,
    superPotionsLeft: Infinity,
};
exports.Gengar2 = {
    Types: [type_1.default.Ghost, type_1.default.Poison],
    Level: 60,
    AttackPower: { Normal: 93, Special: 170 },
    DefenseStat: { Normal: 86, Special: 170 },
    MaxHealth: 151,
    SpeedStat: 146,
    Moves: [Move.ConfuseRay, Move.NightShade, Move.Toxic, Move.DreamEater],
    CriticalDamagePct: 110 / 512,
    superPotionsLeft: Infinity,
};

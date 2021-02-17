"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resistances = void 0;
const type_1 = require("./type");
const resistance_1 = require("./resistance");
const { never, Electric, Fighting, Ground, Fire, Ice, Water, Normal, Dragon, Psychic, Poison, Flying, Ghost, Grass, Rock, Bug, } = type_1.default;
const { WEAK, STRONG, IMMUNE } = resistance_1.default;
exports.Resistances = {
    /*
    [defending type (belonging to the defending player)] : {
      [attacking type (belonging to the move)]: Defending player's resistance to the attack
    },
  */
    [never]: {},
    [Normal]: { [Fighting]: WEAK, [Ghost]: IMMUNE },
    [Fighting]: {
        [Flying]: WEAK,
        [Psychic]: WEAK,
        [Rock]: STRONG,
        [Bug]: STRONG,
    },
    [Flying]: {
        [Rock]: WEAK,
        [Electric]: WEAK,
        [Ice]: WEAK,
        [Fighting]: STRONG,
        [Bug]: STRONG,
        [Grass]: STRONG,
        [Ground]: IMMUNE,
    },
    [Poison]: {
        [Psychic]: WEAK,
        [Bug]: WEAK,
        [Ground]: WEAK,
        [Fighting]: STRONG,
        [Poison]: STRONG,
        [Grass]: STRONG,
    },
    [Ground]: {
        [Water]: WEAK,
        [Grass]: WEAK,
        [Ice]: WEAK,
        [Rock]: STRONG,
        [Poison]: STRONG,
        [Electric]: IMMUNE,
    },
    [Rock]: {
        [Fighting]: WEAK,
        [Ground]: WEAK,
        [Water]: WEAK,
        [Grass]: WEAK,
        [Normal]: STRONG,
        [Flying]: STRONG,
        [Poison]: STRONG,
        [Fire]: STRONG,
    },
    [Bug]: {
        [Flying]: WEAK,
        [Poison]: WEAK,
        [Rock]: WEAK,
        [Fire]: WEAK,
        [Fighting]: STRONG,
        [Ground]: STRONG,
        [Grass]: STRONG,
    },
    [Ghost]: {
        [Ghost]: WEAK,
        [Poison]: STRONG,
        [Bug]: STRONG,
        [Normal]: IMMUNE,
        [Fighting]: IMMUNE,
    },
    [Fire]: {
        [Ground]: WEAK,
        [Rock]: WEAK,
        [Water]: WEAK,
        [Bug]: STRONG,
        [Fire]: STRONG,
        [Grass]: STRONG,
    },
    [Water]: {
        [Grass]: WEAK,
        [Electric]: WEAK,
        [Fire]: STRONG,
        [Water]: STRONG,
        [Ice]: STRONG,
    },
    [Grass]: {
        [Flying]: WEAK,
        [Poison]: WEAK,
        [Bug]: WEAK,
        [Fire]: WEAK,
        [Ice]: WEAK,
        [Ground]: STRONG,
        [Water]: STRONG,
        [Grass]: STRONG,
        [Electric]: STRONG,
    },
    [Electric]: { [Ground]: WEAK, [Flying]: STRONG, [Electric]: STRONG },
    [Psychic]: { [Bug]: WEAK, [Psychic]: STRONG, [Fighting]: STRONG },
    [Ice]: { [Fighting]: WEAK, [Rock]: WEAK, [Fire]: WEAK, [Ice]: STRONG },
    [Dragon]: {
        [Ice]: WEAK,
        [Dragon]: WEAK,
        [Fire]: STRONG,
        [Water]: STRONG,
        [Grass]: STRONG,
        [Electric]: STRONG,
    },
};
exports.default = exports.Resistances;

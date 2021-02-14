"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resistances = void 0;
const type_1 = require("./type");
const { never, Electric, Fighting, Ground, Fire, Ice, Water, Normal, Dragon, Psychic, Poison, Flying, Ghost, Grass, Rock, Bug, } = type_1.default;
exports.Resistances = {
    /*
    [defending type (belonging to defending player)] : {
      weakTo: [the defender will receive more damage when attacked by these types],
      strongTo: [the defender will receive less damage when attacked by these types],
      immuneTo: [the defender will receive no damage when attacked by these types],
    },
  */
    [never]: {},
    [Normal]: { weakTo: [Fighting], strongTo: [], immuneTo: [Ghost] },
    [Fighting]: { weakTo: [Flying, Psychic], strongTo: [Rock, Bug] },
    [Flying]: {
        weakTo: [Rock, Electric, Ice],
        strongTo: [Fighting, Bug, Grass],
        immuneTo: [Ground],
    },
    [Poison]: {
        weakTo: [Psychic, Bug, Ground],
        strongTo: [Fighting, Poison, Grass],
    },
    [Ground]: {
        weakTo: [Water, Grass, Ice],
        strongTo: [Rock, Poison],
        immuneTo: [Electric],
    },
    [Rock]: {
        weakTo: [Fighting, Ground, Water, Grass],
        strongTo: [Normal, Flying, Poison, Fire],
    },
    [Bug]: {
        weakTo: [Flying, Poison, Rock, Fire],
        strongTo: [Fighting, Ground, Grass],
    },
    [Ghost]: {
        weakTo: [Ghost],
        strongTo: [Poison, Bug],
        immuneTo: [Normal, Fighting],
    },
    [Fire]: { weakTo: [Ground, Rock, Water], strongTo: [Bug, Fire, Grass] },
    [Water]: { weakTo: [Grass, Electric], strongTo: [Fire, Water, Ice] },
    [Grass]: {
        weakTo: [Flying, Poison, Bug, Fire, Ice],
        strongTo: [Ground, Water, Grass, Electric],
    },
    [Electric]: { weakTo: [Ground], strongTo: [Flying, Electric] },
    [Psychic]: { weakTo: [Bug], strongTo: [Psychic, Fighting] },
    [Ice]: { weakTo: [Fighting, Rock, Fire], strongTo: [Ice] },
    [Dragon]: {
        weakTo: [Ice, Dragon],
        strongTo: [Fire, Water, Grass, Electric],
    },
};
exports.default = exports.Resistances;

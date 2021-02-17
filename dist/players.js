"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gengar2 = exports.Arbok = exports.Haunter = exports.Golbat = exports.Gengar1 = exports.Weedle = void 0;
const Move = require("./moves");
const player_1 = require("./player");
const type_1 = require("./type");
class Weedle extends player_1.default {
    constructor() {
        super(...arguments);
        this.Types = [type_1.default.Bug, type_1.default.Poison];
        this.Level = 100;
        this.AttackPower = { Normal: 140, Special: 110 };
        this.DefenseStat = { Normal: 130, Special: 110 };
        this.MaxHealth = 255;
        this.health = 255;
        this.SpeedStat = 170;
        this.Moves = [Move.PoisonSting];
        this.CriticalDamagePct = 50 / 512;
        this.superPotionsLeft = 0;
    }
}
exports.Weedle = Weedle;
class Gengar1 extends player_1.default {
    constructor() {
        super(...arguments);
        this.Types = [type_1.default.Ghost, type_1.default.Poison];
        this.Level = 56;
        this.AttackPower = { Normal: 87, Special: 159 };
        this.DefenseStat = { Normal: 81, Special: 159 };
        this.MaxHealth = 142;
        this.health = 142;
        this.SpeedStat = 137;
        this.Moves = [Move.ConfuseRay, Move.NightShade, Move.Hypnosis, Move.DreamEater];
        this.CriticalDamagePct = 110 / 512;
        this.superPotionsLeft = Infinity;
    }
}
exports.Gengar1 = Gengar1;
class Golbat extends player_1.default {
    constructor() {
        super(...arguments);
        this.Types = [type_1.default.Poison, type_1.default.Flying];
        this.Level = 56;
        this.AttackPower = { Normal: 104, Special: 97 };
        this.DefenseStat = { Normal: 92, Special: 97 };
        this.MaxHealth = 158;
        this.health = 158;
        this.SpeedStat = 114;
        this.Moves = [Move.Supersonic, Move.ConfuseRay, Move.WingAttack, Move.Haze];
        this.CriticalDamagePct = 90 / 512;
        this.superPotionsLeft = Infinity;
    }
}
exports.Golbat = Golbat;
class Haunter extends player_1.default {
    constructor() {
        super(...arguments);
        this.Types = [type_1.default.Ghost, type_1.default.Poison];
        this.Level = 55;
        this.AttackPower = { Normal: 69, Special: 140 };
        this.DefenseStat = { Normal: 63, Special: 140 };
        this.MaxHealth = 123;
        this.health = 123;
        this.SpeedStat = 118;
        this.Moves = [Move.ConfuseRay, Move.NightShade, Move.Hypnosis, Move.DreamEater];
        this.CriticalDamagePct = 95 / 512;
        this.superPotionsLeft = Infinity;
    }
}
exports.Haunter = Haunter;
class Arbok extends player_1.default {
    constructor() {
        super(...arguments);
        this.Types = [type_1.default.Poison];
        this.Level = 58;
        this.AttackPower = { Normal: 114, Special: 89 };
        this.DefenseStat = { Normal: 94, Special: 89 };
        this.MaxHealth = 146;
        this.health = 146;
        this.SpeedStat = 107;
        this.Moves = [Move.Bite, Move.Glare, Move.Screech, Move.Acid];
        this.CriticalDamagePct = 80 / 512;
        this.superPotionsLeft = Infinity;
    }
}
exports.Arbok = Arbok;
class Gengar2 extends player_1.default {
    constructor() {
        super(...arguments);
        this.Types = [type_1.default.Ghost, type_1.default.Poison];
        this.Level = 60;
        this.AttackPower = { Normal: 93, Special: 170 };
        this.DefenseStat = { Normal: 86, Special: 170 };
        this.MaxHealth = 151;
        this.health = 151;
        this.SpeedStat = 146;
        this.Moves = [Move.ConfuseRay, Move.NightShade, Move.Toxic, Move.DreamEater];
        this.CriticalDamagePct = 110 / 512;
        this.superPotionsLeft = Infinity;
    }
}
exports.Gengar2 = Gengar2;

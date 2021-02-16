"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Haze = exports.Toxic = exports.PoisonSting = exports.Glare = exports.Screech = exports.Supersonic = exports.Hypnosis = exports.Acid = exports.Bite = exports.WingAttack = exports.DreamEater = exports.NightShade = exports.ConfuseRay = void 0;
const type_1 = require("./type");
exports.ConfuseRay = {
    AttackStat: 0,
    Type: type_1.default.Ghost,
    isSpecial: false,
    execute: (actor, recipient, random) => {
        if (random() < 0.75)
            recipient.confuse(actor);
        return true;
    },
};
exports.NightShade = {
    AttackStat: 0,
    Type: type_1.default.Ghost,
    isSpecial: false,
    execute: (actor, recipient) => recipient.receiveDamage(actor.Level),
};
exports.DreamEater = {
    AttackStat: 100,
    Type: type_1.default.Psychic,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (recipient.sleepingTurnsLeft && random() < 255 / 256)
            return recipient.receiveDamagingMove(exports.DreamEater, actor);
        return true;
    },
};
exports.WingAttack = {
    AttackStat: 35,
    Type: type_1.default.Flying,
    isSpecial: false,
    execute: (actor, recipient, random) => {
        if (random() < 255 / 256)
            return recipient.receiveDamagingMove(exports.WingAttack, actor);
        return true;
    },
};
exports.Bite = {
    AttackStat: 60,
    Type: type_1.default.Normal,
    isSpecial: false,
    execute: (actor, recipient, random) => {
        if (random() < 255 / 256)
            return recipient.receiveDamagingMove(exports.Bite, actor);
        return true;
    },
};
exports.Acid = {
    AttackStat: 40,
    Type: type_1.default.Poison,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (random() < 255 / 256) {
            if (random() < 0.332) {
                recipient.adjustStage(-1, "AttackStage", "Normal");
            }
            return recipient.receiveDamagingMove(exports.Acid, actor);
        }
        return true;
    },
};
exports.Hypnosis = {
    AttackStat: 0,
    Type: type_1.default.Psychic,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (random() < 0.6)
            recipient.makeSleep();
        return true;
    },
};
exports.Supersonic = {
    AttackStat: 0,
    Type: type_1.default.Normal,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (random() < 0.55)
            recipient.confuse(actor);
        return true;
    },
};
exports.Screech = {
    AttackStat: 0,
    Type: type_1.default.Normal,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (random() < 0.85) {
            recipient.adjustStage(-2, "AttackStage", "Normal");
        }
        return true;
    },
};
exports.Glare = {
    AttackStat: 0,
    Type: type_1.default.Normal,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (random() < 0.75)
            recipient.paralyze();
        return true;
    },
};
exports.PoisonSting = {
    AttackStat: 15,
    Type: type_1.default.Poison,
    isSpecial: false,
    execute: (actor, recipient, random) => {
        if (random() < 255 / 256) {
            if (random() < 0.2) {
                recipient.poison();
            }
            return recipient.receiveDamagingMove(exports.PoisonSting, actor);
        }
        return true;
    },
};
exports.Toxic = {
    AttackStat: 0,
    Type: type_1.default.Poison,
    isSpecial: false,
    execute: (actor, recipient, random) => {
        if (random() < 0.85)
            recipient.poison();
        return true;
    },
};
exports.Haze = {
    AttackStat: 0,
    Type: type_1.default.Ice,
    isSpecial: true,
    execute: (actor, recipient, random) => {
        if (random() < 255 / 256) {
            recipient.unConfuse();
            actor.forceResetStages();
            recipient.forceResetStages();
            actor.waiveParalysisSpeedEffect();
            recipient.waiveParalysisSpeedEffect();
        }
        return true;
    },
};

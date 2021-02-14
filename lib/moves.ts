import Type from "./type";
import { Move } from "./move";

export const ConfuseRay: Move = {
  AttackStat: 0,
  Type: Type.Ghost,
  isSpecial: false,
  execute: (actor, recipient, random) => {
    if (random() < 0.75) recipient.confuse(actor);
    return true;
  },
};
export const NightShade: Move = {
  AttackStat: 0,
  Type: Type.Ghost,
  isSpecial: false,
  execute: (actor, recipient) => recipient.receiveDamage(actor.Level),
};
export const DreamEater: Move = {
  AttackStat: 100,
  Type: Type.Psychic,
  isSpecial: true,
  execute: (actor, recipient, random) => {
    if (recipient.sleepingTurnsLeft && random() < 255 / 256)
      return recipient.receiveDamagingMove(DreamEater, actor);
    return true;
  },
};
export const WingAttack: Move = {
  AttackStat: 35,
  Type: Type.Flying,
  isSpecial: false,
  execute: (actor, recipient, random) => {
    if (random() < 255 / 256)
      return recipient.receiveDamagingMove(WingAttack, actor);
    return true;
  },
};
export const Bite: Move = {
  AttackStat: 60,
  Type: Type.Normal,
  isSpecial: false,
  execute: (actor, recipient, random) => {
    if (random() < 255 / 256) return recipient.receiveDamagingMove(Bite, actor);
    return true;
  },
};
export const Acid: Move = {
  AttackStat: 40,
  Type: Type.Poison,
  isSpecial: true,
  execute: (actor, recipient, random) => {
    if (random() < 255 / 256) {
      if (random() < 0.332) {
        recipient.adjustStage(-1, "AttackStage", "Normal");
      }
      return recipient.receiveDamagingMove(Acid, actor);
    }
    return true;
  },
};
export const Hypnosis: Move = {
  AttackStat: 0,
  Type: Type.Psychic,
  isSpecial: true,
  execute: (actor, recipient, random) => {
    if (random() < 0.6) recipient.makeSleep();
    return true;
  },
};
export const Supersonic: Move = {
  AttackStat: 0,
  Type: Type.Normal,
  isSpecial: true,
  execute: (actor, recipient, random) => {
    if (random() < 0.55) recipient.confuse(actor);
    return true;
  },
};
export const Screech: Move = {
  AttackStat: 0,
  Type: Type.Normal,
  isSpecial: true,
  execute: (actor, recipient, random) => {
    if (random() < 0.85) {
      recipient.adjustStage(-2, "AttackStage", "Normal");
    }
    return true;
  },
};
export const Glare: Move = {
  AttackStat: 0,
  Type: Type.Normal,
  isSpecial: true,
  execute: (actor, recipient, random) => {
    if (random() < 0.75) recipient.paralyze();
    return true;
  },
};
export const PoisonSting: Move = {
  AttackStat: 15,
  Type: Type.Poison,
  isSpecial: false,
  execute: (actor, recipient, random) => {
    if (random() < 255 / 256) {
      if (random() < 0.2) {
        recipient.poison();
      }
      return recipient.receiveDamagingMove(PoisonSting, actor);
    }
    return true;
  },
};
export const Toxic: Move = {
  AttackStat: 0,
  Type: Type.Poison,
  isSpecial: false,
  execute: (actor, recipient, random) => {
    if (random() < 0.85) recipient.poison();
    return true;
  },
};
export const Haze: Move = {
  AttackStat: 0,
  Type: Type.Ice,
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

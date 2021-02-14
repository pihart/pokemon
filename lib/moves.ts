import Type from "./type";
import { Move } from "./move";

const Moves: { [index: string]: Move } = {
  ConfuseRay: {
    AttackStat: 0,
    Type: Type.Ghost,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 0.75) recipient.confuse(actor);
      return true;
    },
  },
  NightShade: {
    AttackStat: 0,
    Type: Type.Ghost,
    isSpecial: false,
    execute: (actor, recipient) => recipient.receiveDamage(actor.Level),
  },
  DreamEater: {
    AttackStat: 100,
    Type: Type.Psychic,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (recipient.sleepingTurnsLeft && Math.random() < 255 / 256)
        return recipient.receiveDamagingMove(Moves.DreamEater, actor);
      return true;
    },
  },
  WingAttack: {
    AttackStat: 35,
    Type: Type.Flying,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256)
        return recipient.receiveDamagingMove(Moves.WingAttack, actor);
      return true;
    },
  },
  Bite: {
    AttackStat: 60,
    Type: Type.Normal,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256)
        return recipient.receiveDamagingMove(Moves.Bite, actor);
      return true;
    },
  },
  Acid: {
    AttackStat: 40,
    Type: Type.Poison,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256) {
        if (Math.random() < 0.332) {
          recipient.adjustStage(-1, "AttackStage", "Normal");
        }
        return recipient.receiveDamagingMove(Moves.Acid, actor);
      }
      return true;
    },
  },
  Hypnosis: {
    AttackStat: 0,
    Type: Type.Psychic,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.6) recipient.makeSleep();
      return true;
    },
  },
  Supersonic: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.55) recipient.confuse(actor);
      return true;
    },
  },
  Screech: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.85) {
        recipient.adjustStage(-2, "AttackStage", "Normal");
      }
      return true;
    },
  },
  Glare: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.75) recipient.paralyze();
      return true;
    },
  },
  PoisonSting: {
    AttackStat: 15,
    Type: Type.Poison,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256) {
        if (Math.random() < 0.2) {
          recipient.poison();
        }
        return recipient.receiveDamagingMove(Moves.PoisonSting, actor);
      }
      return true;
    },
  },
  Toxic: {
    AttackStat: 0,
    Type: Type.Poison,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 0.85) recipient.poison();
      return true;
    },
  },
};

export default Moves;

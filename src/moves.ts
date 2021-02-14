import Type from "./type";
import { Move } from "./move";

const Moves: { [index: string]: Move } = {
  ConfuseRay: {
    AttackStat: 0,
    Type: Type.Ghost,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 0.75) recipient.confuse(actor);
    },
  },
  NightShade: {
    AttackStat: 0,
    Type: Type.Ghost,
    isSpecial: false,
    execute: (actor, recipient) => {
      recipient.receiveDamage(actor.Level);
    },
  },
  DreamEater: {
    AttackStat: 100,
    Type: Type.Psychic,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (recipient.sleepingTurnsLeft && Math.random() < 255 / 256)
        recipient.receiveDamagingMove(Moves.DreamEater, actor);
    },
  },
  WingAttack: {
    AttackStat: 35,
    Type: Type.Flying,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256)
        recipient.receiveDamagingMove(Moves.WingAttack, actor);
    },
  },
  Bite: {
    AttackStat: 60,
    Type: Type.Normal,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256)
        recipient.receiveDamagingMove(Moves.Bite, actor);
    },
  },
  Acid: {
    AttackStat: 40,
    Type: Type.Poison,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256) {
        recipient.receiveDamagingMove(Moves.Acid, actor);
        if (Math.random() < 0.332) {
          recipient.adjustStage(-1, "AttackStage", "Normal");
        }
      }
    },
  },
  Hypnosis: {
    AttackStat: 0,
    Type: Type.Psychic,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.6) recipient.makeSleep();
    },
  },
  Supersonic: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.55) recipient.confuse(actor);
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
    },
  },
  Glare: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (actor, recipient) => {
      if (Math.random() < 0.75) recipient.paralyze();
    },
  },
  PoisonSting: {
    AttackStat: 15,
    Type: Type.Poison,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 255 / 256) {
        recipient.receiveDamagingMove(Moves.PoisonSting, actor);
        if (Math.random() < 0.2) {
          recipient.poison();
        }
      }
    },
  },
  Toxic: {
    AttackStat: 0,
    Type: Type.Poison,
    isSpecial: false,
    execute: (actor, recipient) => {
      if (Math.random() < 0.85) recipient.poison();
    },
  },
};

export default Moves;

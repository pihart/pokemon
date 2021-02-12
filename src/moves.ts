import Type from "./type";
import Player from "./player";

export interface MoveLike {
  AttackStat: number;
  Type: Type;
  isSpecial: boolean;
}

export interface Move extends MoveLike {
  execute: (doer: Player, recipient: Player) => void;
}

const Moves: { [index: string]: Move } = {
  ConfuseRay: {
    AttackStat: 0,
    Type: Type.Ghost,
    isSpecial: false,
    execute: (doer, recipient) => {
      if (Math.random() < 0.75) recipient.confuse(doer);
    },
  },
  NightShade: {
    AttackStat: 0,
    Type: Type.Ghost,
    isSpecial: false,
    execute: (doer, recipient) => {
      recipient.receiveDamage(doer.Level);
    },
  },
  DreamEater: {
    AttackStat: 100,
    Type: Type.Psychic,
    isSpecial: true,
    execute: (doer, recipient) => {
      if (recipient.sleepingTurnsLeft && Math.random() < 255 / 256)
        recipient.receiveDamagingMove(Moves.DreamEater, doer);
    },
  },
  WingAttack: {
    AttackStat: 35,
    Type: Type.Flying,
    isSpecial: false,
    execute: (doer, recipient) => {
      if (Math.random() < 255 / 256)
        recipient.receiveDamagingMove(Moves.WingAttack, doer);
    },
  },
  Bite: {
    AttackStat: 60,
    Type: Type.Normal,
    isSpecial: false,
    execute: (doer, recipient) => {
      if (Math.random() < 255 / 256)
        recipient.receiveDamagingMove(Moves.Bite, doer);
    },
  },
  Acid: {
    AttackStat: 40,
    Type: Type.Poison,
    isSpecial: true,
    execute: (doer, recipient) => {
      if (Math.random() < 255 / 256) {
        recipient.receiveDamagingMove(Moves.Acid, doer);
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
    execute: (doer, recipient) => {
      if (Math.random() < 0.6) recipient.makeSleep();
    },
  },
  Supersonic: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (doer, recipient) => {
      if (Math.random() < 0.55) recipient.confuse(doer);
    },
  },
  Screech: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (doer, recipient) => {
      if (Math.random() < 0.85) {
        recipient.adjustStage(-2, "AttackStage", "Normal");
      }
    },
  },
  Glare: {
    AttackStat: 0,
    Type: Type.Normal,
    isSpecial: true,
    execute: (doer, recipient) => {
      if (Math.random() < 0.75) recipient.paralyze();
    },
  },
  PoisonSting: {
    AttackStat: 15,
    Type: Type.Poison,
    isSpecial: false,
    execute: (doer, recipient) => {
      if (Math.random() < 255 / 256) {
        recipient.receiveDamagingMove(Moves.PoisonSting, doer);
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
    execute: (doer, recipient) => {
      if (Math.random() < 0.85) recipient.poison();
    },
  },
};

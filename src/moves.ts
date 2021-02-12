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

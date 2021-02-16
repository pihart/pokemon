import Type from "./type";
import Player from "./player";

export interface MoveLike {
  AttackStat: number;
  Type: Type;
  isSpecial: boolean;
}

export interface Move extends MoveLike {
  /**
   * @param actor Person who deals the move
   * @param recipient Opponent of {@param actor}
   * @return Whether the recipient is alive
   */
  execute: (actor: Player, recipient: Player, random: () => number) => boolean;
}

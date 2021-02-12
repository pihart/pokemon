import { Move, MoveLike } from "./moves";
import Type from "./type";

/*interface Condition {
  turnsLeft: number;
  /!**
   * Take player, do action
   * @return Whether to continue move
   *!/
  execute: Predicate<Player>;
}*/

/*class Confusion implements Condition {
  turnsLeft: number;

  constructor(private doer: Player) {
    this.turnsLeft = Math.floor(RNG(1, 5));
  }

  execute = (receiver: Player) => {
    receiver.doDamage(
      calcDamage(
        {
          Type: Type.never,
          execute(doer: Player, recipient: Player): void {},
          AttackStat: 40,
          isSpecial: false,
        },
        doer,
        receiver
      )
    );
    return false;
  };
}*/

export default class Player {
  private health: number;

  constructor(
    private readonly Types: Type[],
    private readonly Level: number,
    private readonly AttackPower: (isSpecial: boolean) => number,
    private readonly DefenseStat: (isSpecial: boolean) => number,
    private readonly Resistance: number,
    private readonly MaxHealth: number,
    private readonly Moves: Move[]
  ) {
    this.health = this.MaxHealth;
  }

  // conditions: Condition[];
  private confusion?: {
    turnsLeft: number;
    doer: Player;
  };
  private sleepingTurnsLeft = 0;
  private poisoned = false;

  /**
   * @return Whether still alive
   */
  receiveDamagingMove = (move: MoveLike, doer: Player) =>
    this.receiveDamage(this.calcDamage(move, doer));

  /**
   * @return Whether still alive
   */
  receiveDamage = (damage: number) => {
    this.health -= damage;
    return this.health > 0;
  };

  /**
   * @return Whether still alive
   */
  private calcDamage = (move: MoveLike, doer: Player) => {
    const STAB = doer.Types.includes(move.Type) ? 1.5 : 1;
    return (
      (((((doer.Level * (2 / 5) + 2) *
        move.AttackStat *
        doer.AttackPower(move.isSpecial)) /
        this.DefenseStat(move.isSpecial) /
        50 +
        2) *
        STAB) /
        this.Resistance) *
      RNG(0.85, 1)
    );
  };

  /**
   * @return Whether still alive
   */
  playTurn = (opponent: Player): boolean => {
    if (this.sleepingTurnsLeft) {
      console.log("Sleeping");
      this.sleepingTurnsLeft--;
      return true;
    }

    if (this.confusion?.turnsLeft) {
      console.log("Confused");
      this.confusion.turnsLeft--;
      if (Math.random() < 0.5) {
        console.log("Doing confusion damage and skipping");
        return this.receiveDamagingMove(
          { AttackStat: 40, isSpecial: false, Type: Type.never },
          this.confusion.doer
        );
      }
      console.log("Confusion safe");
    }

    if (this.health < this.MaxHealth / 4 && Math.random() < 108 / 256) {
      this.receiveDamage(-60);
    } else {
      this.Moves[Math.floor(RNG(0, this.Moves.length))].execute(this, opponent);
    }

    if (this.poisoned) {
      console.log("Poisoned");
      return this.receiveDamage(this.MaxHealth / 16);
    }

    return this.receiveDamage(0);
  };

  confuse = (doer: Player) => {
    if (this.confusion?.turnsLeft) return;

    this.confusion = {
      doer,
      turnsLeft: Math.floor(RNG(1, 5)),
    };
  };

  makeSleep = () => {
    if (this.sleepingTurnsLeft || this.poisoned) return;

    this.sleepingTurnsLeft = Math.floor(RNG(1, 8));
  };

  poison = () => {
    if (this.sleepingTurnsLeft || this.poisoned) return;

    this.poisoned = true;
  };
}

const RNG = (a: number, b: number) => Math.random() * (b - a) + a;

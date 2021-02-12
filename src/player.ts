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

type NormalSpecial<T = number> = { Normal: T; Special: T };

export default class Player {
  private health: number;
  private AttackStage: NormalSpecial = { Normal: 0, Special: 0 };
  private DefenseStage: NormalSpecial = { Normal: 0, Special: 0 };

  constructor(
    private readonly Types: Type[],
    public readonly Level: number,
    private readonly AttackPower: NormalSpecial,
    private readonly DefenseStat: NormalSpecial,
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
  public sleepingTurnsLeft = 0;
  private poisoned = false;
  private paralyzed = false;

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
    let AttackPower: number;
    let AttackStage: number;
    let DefenseStat: number;
    let DefenseStage: number;

    if (move.isSpecial) {
      AttackPower = doer.AttackPower.Special;
      AttackStage = doer.AttackStage.Special;
      DefenseStat = this.DefenseStat.Special;
      DefenseStage = this.DefenseStage.Special;
    } else {
      AttackPower = doer.AttackPower.Normal;
      AttackStage = doer.AttackStage.Normal;
      DefenseStat = this.DefenseStat.Normal;
      DefenseStage = this.DefenseStage.Normal;
    }
    const AttackPowerScaled = AttackPower * Player.getMultiplier(AttackStage);
    const DefenseStatScaled = DefenseStat * Player.getMultiplier(DefenseStage);
    return (
      (((((doer.Level * (2 / 5) + 2) * move.AttackStat * AttackPowerScaled) /
        DefenseStatScaled /
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
      return this.receiveDamage(0);
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

    if (this.paralyzed && Math.random() < 0.25) {
      return this.receiveDamage(0);
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
    if (this.sleepingTurnsLeft || this.poisoned || this.paralyzed) return;

    this.sleepingTurnsLeft = Math.floor(RNG(1, 8));
  };

  poison = () => {
    if (this.sleepingTurnsLeft || this.poisoned || this.paralyzed) return;

    this.poisoned = true;
  };

  paralyze = () => {
    if (this.sleepingTurnsLeft || this.poisoned || this.paralyzed) return;

    this.poisoned = true;
  };

  adjustStage = (
    difference: number,
    stageAttr: "AttackStage" | "DefenseStage",
    type: "Normal" | "Special"
  ) => {
    this[stageAttr][type] = Math.min(
      6,
      Math.max(-6, this[stageAttr][type] + difference)
    );
  };

  /**
   * Do the following computation:
   * ```js
   * if (stage < 0) return 1 / this.getMultiplier(-stage);
   * switch (stage) {
      case 0:
        return 1;
      case 1:
        return 1.5;
      case 2:
        return 2;
      case 3:
        return 2.5;
      case 4:
        return 3;
      case 5:
        return 3.5;
      case 6:
        return 4;
    }
   * ```
   * @param stage Between -6 and 6
   * @private
   */
  private static getMultiplier(stage: number): number {
    if (stage < 0) return 1 / this.getMultiplier(-stage);
    return stage / 2 + 1;
  }
}

const RNG = (a: number, b: number) => Math.random() * (b - a) + a;

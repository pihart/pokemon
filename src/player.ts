import { Move, MoveLike } from "./moves";
import Type from "./type";

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
    private readonly Moves: Move[],
    private readonly CriticalDamagePct: number,
    private healthMercyLeft: number
  ) {
    this.health = this.MaxHealth;
  }

  private confusion?: {
    turnsLeft: number;
    actor: Player;
  };
  public sleepingTurnsLeft = 0;
  private poisoned = false;
  private paralyzed = false;

  /**
   * @return Whether still alive
   */
  receiveDamagingMove = (move: MoveLike, actor: Player) =>
    this.receiveDamage(
      Math.random() < this.CriticalDamagePct
        ? this.calcCriticalDamage(move, actor)
        : this.calcDamage(move, actor)
    );

  /**
   * @return Whether still alive
   */
  receiveDamage = (damage: number) => {
    this.health = Math.min(this.MaxHealth, Math.max(0, this.health - damage));
    return this.health > 0;
  };

  private calcDamage = (move: MoveLike, actor: Player) => {
    /**
     * Same Type Attack Bonus
     *
     * If the Player has the same type as the move being used,
     * they get a 50% damage bonus
     */
    const STAB = actor.Types.includes(move.Type) ? 1.5 : 1;
    let AttackPower: number;
    let AttackStage: number;
    let DefenseStat: number;
    let DefenseStage: number;

    if (move.isSpecial) {
      AttackPower = actor.AttackPower.Special;
      AttackStage = actor.AttackStage.Special;
      DefenseStat = this.DefenseStat.Special;
      DefenseStage = this.DefenseStage.Special;
    } else {
      AttackPower = actor.AttackPower.Normal;
      AttackStage = actor.AttackStage.Normal;
      DefenseStat = this.DefenseStat.Normal;
      DefenseStage = this.DefenseStage.Normal;
    }
    const AttackPowerScaled = AttackPower * Player.getMultiplier(AttackStage);
    const DefenseStatScaled = DefenseStat * Player.getMultiplier(DefenseStage);
    return (
      (((((actor.Level * (2 / 5) + 2) * move.AttackStat * AttackPowerScaled) /
        DefenseStatScaled /
        50 +
        2) *
        STAB) /
        this.Resistance) *
      RNG(0.85, 1)
    );
  };

  private calcCriticalDamage = (move: MoveLike, actor: Player) => {
    const STAB = actor.Types.includes(move.Type) ? 1.5 : 1;

    return (
      (((2 * actor.Level + 5) / (actor.Level + 5)) *
        (((((((2 * actor.Level) / 5 + 2) *
          move.AttackStat *
          actor.AttackPower[move.isSpecial ? "Special" : "Normal"]) /
          this.DefenseStat[move.isSpecial ? "Special" : "Normal"] /
          50 +
          2) *
          STAB) /
          this.Resistance) *
          RNG(85, 100))) /
      100
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
          this.confusion.actor
        );
      }
      console.log("Confusion safe");
    }

    if (this.paralyzed && Math.random() < 0.25) {
      return this.receiveDamage(0);
    }

    if (
      this.health < this.MaxHealth / 4 &&
      this.healthMercyLeft &&
      Math.random() < 108 / 256
    ) {
      this.receiveDamage(-60);
      this.healthMercyLeft--;
    } else {
      this.Moves[Math.floor(RNG(0, this.Moves.length))].execute(this, opponent);
    }

    if (this.poisoned) {
      console.log("Poisoned");
      return this.receiveDamage(this.MaxHealth / 16);
    }

    return this.receiveDamage(0);
  };

  confuse = (actor: Player) => {
    if (this.confusion?.turnsLeft) return;

    this.confusion = {
      actor,
      turnsLeft: Math.floor(RNG(1, 5)),
    };
  };

  /**
   * Whether any in the condition group consisting of sleep, paralysis, poisoning is active.
   *
   * Because only one of these can be active at any given time,
   * and it is a lock, not an override
   */
  private sleepParalysisPoisonGroup = () =>
    this.sleepingTurnsLeft || this.poisoned || this.paralyzed;

  makeSleep = () => {
    if (this.sleepParalysisPoisonGroup()) return;

    this.sleepingTurnsLeft = Math.floor(RNG(1, 8));
  };

  poison = () => {
    if (this.sleepParalysisPoisonGroup()) return;

    this.poisoned = true;
  };

  paralyze = () => {
    if (this.sleepParalysisPoisonGroup()) return;

    this.paralyzed = true;
  };

  clearAllStatus = () => {
    this.confusion = undefined;
    this.sleepingTurnsLeft = 0;
    this.poisoned = false;
    this.paralyzed = false;
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

import { Assert, CustomError } from "@mehra/ts";

import { Move, MoveLike } from "./move";
import Type from "./type";
import Resistances from "./resistances";

type NormalSpecial<T = number> = { Normal: T; Special: T };

class PlayerAlreadyDeadException extends CustomError {}

export interface PlayerOptions {
  Types: Type[];
  Level: number;
  AttackPower: NormalSpecial;
  DefenseStat: NormalSpecial;
  SpeedStat: number;
  MaxHealth: number;
  Moves: Move[];
  CriticalDamagePct: number;
  superPotionsLeft: number;
}

export default class Player {
  private health: number;
  private AttackStage: NormalSpecial = { Normal: 0, Special: 0 };
  private DefenseStage: NormalSpecial = { Normal: 0, Special: 0 };
  private stageBoostCounter: number;
  private paralysisSpeedEffectWaived = false;

  private readonly Types: Type[];
  public readonly Level: number;
  private readonly AttackPower: NormalSpecial;
  private readonly DefenseStat: NormalSpecial;
  private readonly SpeedStat: number;
  private readonly MaxHealth: number;
  private readonly Moves: Move[];
  private readonly CriticalDamagePct: number;
  private superPotionsLeft: number;

  constructor(
    {
      AttackPower,
      CriticalDamagePct,
      DefenseStat,
      Level,
      MaxHealth,
      Moves,
      SpeedStat,
      superPotionsLeft,
      Types,
    }: PlayerOptions,
    private readonly isHuman: boolean,
    private random: () => number
  ) {
    this.AttackPower = AttackPower;
    this.CriticalDamagePct = CriticalDamagePct;
    this.DefenseStat = DefenseStat;
    this.SpeedStat = SpeedStat;
    this.MaxHealth = MaxHealth;
    this.Moves = Moves;
    this.superPotionsLeft = superPotionsLeft;
    this.Types = Types;
    this.Level = Level;

    this.health = this.MaxHealth;
    this.stageBoostCounter = +isHuman;
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
  receiveDamagingMove = (move: MoveLike, actor: Player) => {
    // console.log(move);
    return this.receiveDamage(
      this.random() < this.CriticalDamagePct
        ? this.calcCriticalDamage(move, actor)
        : this.calcDamage(move, actor)
    );
  };

  /**
   * @return Whether still alive
   */
  receiveDamage = (damage: number) => {
    this.health = Math.min(
      this.MaxHealth,
      Math.max(0, this.health - Math.floor(damage))
    );
    // console.log({
    //   damage: Math.floor(damage),
    //   isHuman: this.isHuman,
    //   healthAfter: this.health,
    // });
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

    const AttackPowerScaled =
      AttackPower *
      actor.getStageBoostBonus() *
      Player.getMultiplier(AttackStage);
    const DefenseStatScaled =
      DefenseStat *
      this.getStageBoostBonus() *
      Player.getMultiplier(DefenseStage);

    return (
      (((actor.Level * (2 / 5) + 2) * move.AttackStat * AttackPowerScaled) /
        DefenseStatScaled /
        50 +
        2) *
      STAB *
      this.getWeakness(move.Type) *
      this.RNG(0.85, 1)
    );
  };

  private calcCriticalDamage = (move: MoveLike, actor: Player) => {
    const STAB = actor.Types.includes(move.Type) ? 1.5 : 1;

    return (
      (((2 * actor.Level + 5) / (actor.Level + 5)) *
        (((((2 * actor.Level) / 5 + 2) *
          move.AttackStat *
          actor.AttackPower[move.isSpecial ? "Special" : "Normal"]) /
          this.DefenseStat[move.isSpecial ? "Special" : "Normal"] /
          50 +
          2) *
          STAB *
          this.getWeakness(move.Type) *
          this.RNG(85, 100))) /
      100
    );
  };

  private getWeakness = (attackingType: Type) =>
    this.Types.map((defendingType) => {
      if (Resistances[defendingType].weakTo?.includes(attackingType)) return 2;
      if (Resistances[defendingType].strongTo?.includes(attackingType))
        return 1 / 2;
      if (Resistances[defendingType].immuneTo?.includes(attackingType))
        return 0;
      return 1;
    }).reduce((a, b) => a * b);

  private getStageBoostBonus = () => (9 / 8) ** this.stageBoostCounter;

  getSpeed = () =>
    this.SpeedStat *
    this.getStageBoostBonus() *
    (this.paralyzed && !this.paralysisSpeedEffectWaived ? 1 / 4 : 1);

  /**
   * @param takeSuperPotion
   * Whether the die indicates to take the super potion.
   * It actually happening depends on the current state of the player.
   * @param opponent
   */
  playTurn = (
    takeSuperPotion: boolean,
    opponent: Player
  ):
    | { thisAlive: true; opponentAlive: boolean }
    | { thisAlive: false; opponentAlive: true } => {
    Assert(this.receiveDamage(0), PlayerAlreadyDeadException);

    if (
      takeSuperPotion &&
      this.health < this.MaxHealth / 4 &&
      this.superPotionsLeft
    ) {
      this.receiveDamage(-60);
      this.superPotionsLeft--;
      return { thisAlive: true, opponentAlive: true };
    }

    if (this.sleepingTurnsLeft) {
      // console.log("Sleeping");
      this.sleepingTurnsLeft--;
      return { thisAlive: true, opponentAlive: true };
    }

    if (this.confusion?.turnsLeft) {
      // console.log("Confused", { turnsLeft: this.confusion.turnsLeft });
      this.confusion.turnsLeft--;
      if (this.random() < 0.5) {
        // console.log("Doing confusion damage and ending turn");
        return {
          opponentAlive: true,
          thisAlive: this.receiveDamagingMove(
            { AttackStat: 40, isSpecial: false, Type: Type.never },
            this.confusion.actor
          ),
        };
      }
      // console.log("Confusion safe");
    }

    if (this.paralyzed && this.random() < 0.25) {
      return { thisAlive: true, opponentAlive: true };
    }

    const chosenMove = Math.floor(this.RNG(0, this.Moves.length));
    // console.log("Attempting move", chosenMove, { isHuman: this.isHuman });
    if (!this.Moves[chosenMove].execute(this, opponent, this.random))
      return {
        thisAlive: true,
        opponentAlive: false,
      };

    if (this.poisoned) {
      // console.log("Poisoned");
      return {
        thisAlive: this.receiveDamage(this.MaxHealth / 16),
        opponentAlive: true,
      };
    }

    return { thisAlive: true, opponentAlive: true };
  };

  confuse = (actor: Player) => {
    if (this.confusion?.turnsLeft) return;

    this.confusion = {
      actor,
      turnsLeft: Math.floor(this.RNG(1, 5)),
    };
  };

  unConfuse = () => {
    this.confusion = undefined;
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

    this.sleepingTurnsLeft = Math.floor(this.RNG(1, 8));
  };

  poison = () => {
    if (this.Types.includes(Type.Poison) || this.sleepParalysisPoisonGroup())
      return;

    this.poisoned = true;
  };

  paralyze = () => {
    if (this.sleepParalysisPoisonGroup()) return;

    this.paralyzed = true;
  };

  waiveParalysisSpeedEffect = () => {
    this.paralysisSpeedEffectWaived = true;
  };

  deParalyze = () => {
    this.paralyzed = false;
    this.paralysisSpeedEffectWaived = false;
  };

  adjustStage = (
    difference: number,
    stageAttr: "AttackStage" | "DefenseStage",
    type: "Normal" | "Special"
  ) => {
    if (this.isHuman) this.stageBoostCounter++;
    this[stageAttr][type] = Math.min(
      6,
      Math.max(-6, this[stageAttr][type] + difference)
    );
  };

  forceResetStages = () => {
    this.AttackStage.Normal = 0;
    this.AttackStage.Special = 0;
    this.DefenseStage.Normal = 0;
    this.DefenseStage.Special = 0;

    this.stageBoostCounter = 0;
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

  private RNG = (a: number, b: number) => this.random() * (b - a) + a;
}

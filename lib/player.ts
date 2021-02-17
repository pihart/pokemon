import { Move, MoveLike } from "./move";
import Type from "./type";
import Resistances from "./resistances";
import Resistance from "./resistance";

type NormalSpecial<T = number> = { Normal: T; Special: T };

export default abstract class Player {
  protected abstract health: number;
  private AttackStage: NormalSpecial = { Normal: 0, Special: 0 };
  private DefenseStage: NormalSpecial = { Normal: 0, Special: 0 };
  private stageBoostCounter: number;
  private paralysisSpeedEffectWaived = false;

  protected abstract readonly Types: Type[];
  abstract readonly Level: number;
  protected abstract readonly AttackPower: NormalSpecial;
  protected abstract readonly DefenseStat: NormalSpecial;
  protected abstract readonly SpeedStat: number;
  protected abstract readonly MaxHealth: number;
  protected abstract readonly Moves: Move[];
  protected abstract readonly CriticalDamagePct: number;
  protected abstract superPotionsLeft: number;

  protected constructor(
    private readonly isHuman: boolean,
    private readonly random: () => number,
    private readonly log?: (...data: any[]) => void
  ) {
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
    this.log?.("Receiving move", move, "from", actor);
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
    const damageInt = Math.floor(damage);

    this.log?.("Taking damage of", damageInt, "rounded from", damage);
    this.log?.("Current health:", this.health, "of max health", this.MaxHealth);

    this.health = Math.min(
      this.MaxHealth,
      Math.max(0, this.health - damageInt)
    );

    this.log?.("Health is now", this.health);

    return this.health > 0;
  };

  private calcDamage = (move: MoveLike, actor: Player) => {
    this.log?.("Damage is noncritical");
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
    this.log?.("Damage is critical");

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
    this.Types.map(
      (defendingType) =>
        Resistances[defendingType]?.[attackingType] ?? Resistance.NORMAL
    ).reduce((a, b) => a * b);

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
    this.log?.("Playing turn", { takeSuperPotion, opponent });

    if (
      takeSuperPotion &&
      this.health < this.MaxHealth / 4 &&
      this.superPotionsLeft
    ) {
      this.log?.("Taking super potion");
      this.receiveDamage(-60);
      this.superPotionsLeft--;
      this.log?.("Ending turn", "superPotionsLeft:", this.superPotionsLeft);
      return { thisAlive: true, opponentAlive: true };
    }

    if (this.sleepingTurnsLeft) {
      this.log?.("Sleeping");
      this.sleepingTurnsLeft--;
      this.log?.("Ending turn", "sleepingTurnsLeft:", this.sleepingTurnsLeft);
      return { thisAlive: true, opponentAlive: true };
    }

    if (this.confusion?.turnsLeft) {
      this.log?.("Confused");
      this.confusion.turnsLeft--;
      this.log?.("confusionTurnsLeft:", this.confusion.turnsLeft);
      if (this.random() < 0.5) {
        this.log?.("Doing confusion damage and ending turn");
        return {
          opponentAlive: true,
          thisAlive: this.receiveDamagingMove(
            { AttackStat: 40, isSpecial: false, Type: Type.never },
            this.confusion.actor
          ),
        };
      }
      this.log?.("Confusion did not work; continuing");
    }

    if (this.paralyzed) {
      this.log?.("Paralyzed");
      if (this.random() < 0.25) {
        this.log?.("Ending turn due to paralysis");
        return { thisAlive: true, opponentAlive: true };
      }
      this.log?.("Paralysis did not work; continuing");
    }

    const chosenMove = Math.floor(this.RNG(0, this.Moves.length));
    this.log?.("Attempting to play move", chosenMove);
    if (!this.Moves[chosenMove].execute(this, opponent, this.random)) {
      this.log?.("Move killed opponent");
      return {
        thisAlive: true,
        opponentAlive: false,
      };
    }

    if (this.poisoned) {
      this.log?.("Poisoned; taking damage of 1/16 max");
      return {
        thisAlive: this.receiveDamage(this.MaxHealth / 16),
        opponentAlive: true,
      };
    }

    return { thisAlive: true, opponentAlive: true };
  };

  confuse = (actor: Player) => {
    this.log?.("Getting confused by player", actor);

    if (this.confusion?.turnsLeft) {
      this.log?.("Already confused; cancelling");
      return;
    }

    const turnsLeft = Math.floor(this.RNG(1, 5));

    this.confusion = {
      actor,
      turnsLeft,
    };

    this.log?.("Confused for", turnsLeft, "turns");
  };

  unConfuse = () => {
    this.log?.("Removing confusion");
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
    this.log?.("Being told to sleep");

    if (this.sleepParalysisPoisonGroup()) {
      this.log?.("Already affected by condition in group; cancelling");
      return;
    }

    this.sleepingTurnsLeft = Math.floor(this.RNG(1, 8));
    this.log?.("Sleeping for", this.sleepingTurnsLeft, "turns");
  };

  poison = () => {
    this.log?.("Getting poisoned");

    if (this.Types.includes(Type.Poison)) {
      this.log?.("Am poison type; cannot get poisoned; cancelling");
      return;
    }
    if (this.sleepParalysisPoisonGroup()) {
      this.log?.("Already affected by condition in group; cancelling");
      return;
    }

    this.poisoned = true;
    this.log?.("Am now poisoned");
  };

  paralyze = () => {
    this.log?.("Getting paralyzed");

    if (this.sleepParalysisPoisonGroup()) {
      this.log?.("Already affected by condition in group; cancelling");
      return;
    }

    this.paralyzed = true;
    this.log?.("Am now paralyzed");
  };

  waiveParalysisSpeedEffect = () => {
    this.log?.("Waiving paralysis speed effect");
    this.paralysisSpeedEffectWaived = true;
  };

  deParalyze = () => {
    this.log?.("Removing paralysis and paralysis speed waiver (if it exists)");

    this.paralyzed = false;
    this.paralysisSpeedEffectWaived = false;
  };

  adjustStage = (
    difference: number,
    stageAttr: "AttackStage" | "DefenseStage",
    type: "Normal" | "Special"
  ) => {
    const previousStage = this[stageAttr][type];
    const newStage = Math.min(6, Math.max(-6, previousStage + difference));

    this.log?.(
      "Changing stage",
      stageAttr,
      "of type",
      type,
      "by",
      difference,
      "from",
      previousStage,
      "to",
      newStage
    );

    this[stageAttr][type] = newStage;

    if (this.isHuman) {
      this.stageBoostCounter++;
      this.log?.(
        "Am human; incrementing stageBoostCounter to",
        this.stageBoostCounter
      );
    }
  };

  forceResetStages = () => {
    this.log?.("Force resetting all stages and stage boost counter");

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

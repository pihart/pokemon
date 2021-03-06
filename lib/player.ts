import { Move, MoveLike } from "./move";
import Type from "./type";
import Resistances from "./resistances";
import Resistance from "./resistance";
import { PlayerLogger } from "./logger";

type NormalSpecial<T = number> = { Normal: T; Special: T };

/**
 * Player-specific constants
 */
export interface PlayerOptions {
  Types: Type[];
  Level: number;
  AttackPower: NormalSpecial;
  DefenseStat: NormalSpecial;
  SpeedStat: number;
  MaxHealth: number;
  Moves: Move[];
  CriticalDamagePct: number;
  SuperPotionsLimit: number;
}

export default class Player {
  /* Player-specific constants (PlayerOptions) */
  protected readonly Types: Type[];
  readonly Level: number;
  protected readonly AttackPower: NormalSpecial;
  protected readonly DefenseStat: NormalSpecial;
  protected readonly SpeedStat: number;
  protected readonly MaxHealth: number;
  protected readonly Moves: Move[];
  protected readonly CriticalDamagePct: number;
  protected readonly SuperPotionsLimit: number;

  /* Runtime-mutable stats/data */
  private AttackStage!: NormalSpecial;
  private DefenseStage!: NormalSpecial;
  private paralysisSpeedEffectWaived!: boolean;
  private stageBoostCounter!: number;
  private health!: number;
  private superPotionsLeft!: number;

  /* Runtime-mutable states ("conditions") */
  /**
   * If defined, encodes the state of the current confusion.
   * If undefined, no confusion is active.
   * @private
   */
  private confusion?: {
    turnsLeft: number;
    actor: Player;
  };
  /**
   * Determines the number of turns for which sleep remains active.
   */
  public sleepingTurnsLeft!: number;
  /**
   * Determines whether poisoned.
   *
   * Does not have any term limits.
   * @private
   */
  private poisoned!: boolean;
  /**
   * Determines whether paralyzed.
   *
   * Does not have any term limits.
   * @private
   */
  private paralyzed!: boolean;

  /* Debugging dependencies */
  private random!: () => number;
  private logger?: Partial<PlayerLogger>;

  constructor(
    {
      Types,
      Level,
      AttackPower,
      DefenseStat,
      SpeedStat,
      MaxHealth,
      Moves,
      CriticalDamagePct,
      SuperPotionsLimit,
    }: PlayerOptions,
    private readonly isHuman: boolean,
    random: () => number,
    logger?: Partial<PlayerLogger>
  ) {
    this.Types = Types;
    this.Level = Level;
    this.AttackPower = AttackPower;
    this.DefenseStat = DefenseStat;
    this.SpeedStat = SpeedStat;
    this.MaxHealth = MaxHealth;
    this.Moves = Moves;
    this.CriticalDamagePct = CriticalDamagePct;
    this.SuperPotionsLimit = SuperPotionsLimit;

    this.reset(random, logger);
  }

  reset(random: () => number, logger?: Partial<PlayerLogger>) {
    this.logger?.Resetting?.();
    this.logger?.LogSession?.("Ending");

    this.random = random;
    this.logger = logger;
    this.logger?.LogSession?.("Using new");

    this.health = this.MaxHealth;
    this.AttackStage = { Normal: 0, Special: 0 };
    this.DefenseStage = { Normal: 0, Special: 0 };
    this.paralysisSpeedEffectWaived = false;
    this.stageBoostCounter = +this.isHuman;
    this.superPotionsLeft = this.SuperPotionsLimit;

    this.confusion = undefined;
    this.sleepingTurnsLeft = 0;
    this.poisoned = false;
    this.paralyzed = false;
  }

  /**
   * @return Whether still alive
   */
  receiveDamagingMove(move: MoveLike, actor: Player) {
    this.logger?.ReceivingMove?.(move, actor);
    return this.receiveDamage(
      this.random() < this.CriticalDamagePct
        ? this.calcCriticalDamage(move, actor)
        : this.calcDamage(move, actor)
    );
  }

  /**
   * @return Whether still alive
   */
  receiveDamage(damage: number) {
    const damageInt = Math.floor(damage);

    this.logger?.Health?.(this.health, this.MaxHealth);
    this.logger?.TakingDamage?.(damageInt, damage);

    this.health = Math.min(
      this.MaxHealth,
      Math.max(0, this.health - damageInt)
    );

    this.logger?.Health?.(this.health, this.MaxHealth);

    return this.health > 0;
  }

  private calcDamage = (move: MoveLike, actor: Player) => {
    this.logger?.DamageType?.("noncritical");
    return this.baseDamage(move, actor, true);
  };

  private calcCriticalDamage = (move: MoveLike, actor: Player) => {
    this.logger?.DamageType?.("critical");
    return (
      ((2 * actor.Level + 5) / (actor.Level + 5)) *
      this.baseDamage(move, actor, false)
    );
  };

  /**
   * A non-deterministic multiplicative constant for use in damage calculations
   */
  private baseDamage = (move: MoveLike, actor: Player, scale: boolean) => {
    /**
     * Same Type Attack Bonus
     *
     * If the Player has the same type as the move being used,
     * they get a 50% damage bonus.
     */
    const STAB = actor.Types.includes(move.Type) ? 1.5 : 1;

    const {
      DefenseStage,
      DefenseStat,
      AttackStage,
      AttackPower,
    } = this.baseAttackDefense(move, actor);

    return (
      (((actor.Level * (2 / 5) + 2) *
        move.AttackStat *
        (AttackPower *
          (scale
            ? actor.getStageBoostBonus() * Player.getMultiplier(AttackStage)
            : 1))) /
        (DefenseStat *
          (scale
            ? this.getStageBoostBonus() * Player.getMultiplier(DefenseStage)
            : 1)) /
        50 +
        2) *
      STAB *
      this.getWeakness(move.Type) *
      this.RNG(0.85, 1)
    );
  };

  /**
   * Something to do with power of an attack
   *
   * Gives appropriate constants based on whether the move is special.
   * Does not factor in bonuses.
   */
  private baseAttackDefense = (move: MoveLike, actor: Player) => {
    if (move.isSpecial) {
      return {
        AttackPower: actor.AttackPower.Special,
        AttackStage: actor.AttackStage.Special,
        DefenseStat: this.DefenseStat.Special,
        DefenseStage: this.DefenseStage.Special,
      };
    }
    return {
      AttackPower: actor.AttackPower.Normal,
      AttackStage: actor.AttackStage.Normal,
      DefenseStat: this.DefenseStat.Normal,
      DefenseStage: this.DefenseStage.Normal,
    };
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
  playTurn(
    takeSuperPotion: boolean,
    opponent: Player
  ):
    | { thisAlive: true; opponentAlive: boolean }
    | { thisAlive: false; opponentAlive: true } {
    this.logger?.PlayingTurn?.({ takeSuperPotion, opponent });

    if (
      takeSuperPotion &&
      this.health < this.MaxHealth / 4 &&
      this.superPotionsLeft
    ) {
      this.logger?.TakingSuperPotion?.();
      this.receiveDamage(-60);
      this.superPotionsLeft--;
      this.logger?.QuantityRemaining?.("Super potions", this.superPotionsLeft);
      return { thisAlive: true, opponentAlive: true };
    }

    if (this.sleepingTurnsLeft) {
      this.logger?.State?.("Sleeping");
      this.sleepingTurnsLeft--;
      this.logger?.QuantityRemaining?.(
        "Sleeping Turns",
        this.sleepingTurnsLeft
      );
      return { thisAlive: true, opponentAlive: true };
    }

    if (this.confusion?.turnsLeft) {
      this.logger?.State?.("Confused");
      this.confusion.turnsLeft--;
      this.logger?.QuantityRemaining?.(
        "Confusion turns",
        this.confusion.turnsLeft
      );
      if (this.random() < 0.5) {
        this.logger?.EffectSuccess?.("Confusion", "successful");
        return {
          opponentAlive: true,
          thisAlive: this.receiveDamagingMove(
            { AttackStat: 40, isSpecial: false, Type: Type.never },
            this.confusion.actor
          ),
        };
      }
      this.logger?.EffectSuccess?.("Confusion", "unsuccessful");
    }

    if (this.paralyzed) {
      this.logger?.State?.("Paralyzed");
      if (this.random() < 0.25) {
        this.logger?.EffectSuccess?.("Paralysis", "successful");
        return { thisAlive: true, opponentAlive: true };
      }
      this.logger?.EffectSuccess?.("Paralysis", "unsuccessful");
    }

    const chosenMoveIndex = Math.floor(this.RNG(0, this.Moves.length));
    const chosenMove = this.Moves[chosenMoveIndex];

    this.logger?.PlayingMove?.(chosenMoveIndex, chosenMove);

    if (!chosenMove.execute(this, opponent, this.random)) {
      this.logger?.MoveKilledOpponent?.();
      return {
        thisAlive: true,
        opponentAlive: false,
      };
    }

    if (this.poisoned) {
      this.logger?.State?.("Poisoned", "taking damage of 1/16 max");
      return {
        thisAlive: this.receiveDamage(this.MaxHealth / 16),
        opponentAlive: true,
      };
    }

    return { thisAlive: true, opponentAlive: true };
  }

  confuse(actor: Player) {
    this.logger?.GettingCondition?.("confusion", actor);

    if (this.confusion?.turnsLeft) {
      this.logger?.CancelCondition?.("Already confused");
      return;
    }

    const turnsLeft = Math.floor(this.RNG(1, 5));

    this.confusion = {
      actor,
      turnsLeft,
    };

    this.logger?.QuantityRemaining?.("Confusion turns", turnsLeft);
  }

  unConfuse() {
    this.logger?.RemovingCondition?.("confusion");
    this.confusion = undefined;
  }

  /**
   * Whether any in the condition group consisting of sleep, paralysis, poisoning is active.
   *
   * Because only one of these can be active at any given time,
   * and it is a lock, not an override
   */
  private sleepParalysisPoisonGroup = () =>
    this.sleepingTurnsLeft || this.poisoned || this.paralyzed;

  makeSleep() {
    this.logger?.GettingCondition?.("sleep");

    if (this.sleepParalysisPoisonGroup()) {
      this.logger?.CancelCondition?.("Already affected by condition in group");
      return;
    }

    this.sleepingTurnsLeft = Math.floor(this.RNG(1, 8));

    this.logger?.QuantityRemaining?.("Sleeping Turns", this.sleepingTurnsLeft);
  }

  poison() {
    this.logger?.GettingCondition?.("poison");

    if (this.Types.includes(Type.Poison)) {
      this.logger?.CancelCondition?.("Am poison type; cannot get poisoned");
      return;
    }
    if (this.sleepParalysisPoisonGroup()) {
      this.logger?.CancelCondition?.("Already affected by condition in group");
      return;
    }

    this.poisoned = true;
  }

  paralyze() {
    this.logger?.GettingCondition?.("paralysis");

    if (this.sleepParalysisPoisonGroup()) {
      this.logger?.CancelCondition?.("Already affected by condition in group");
      return;
    }

    this.paralyzed = true;
  }

  waiveParalysisSpeedEffect() {
    this.logger?.WaivingParalysisSpeedEffect?.();
    this.paralysisSpeedEffectWaived = true;
  }

  deParalyze() {
    this.logger?.RemovingCondition?.("paralysis and paralysis speed waiver");

    this.paralyzed = false;
    this.paralysisSpeedEffectWaived = false;
  }

  adjustStage(
    difference: number,
    stageAttr: "AttackStage" | "DefenseStage",
    type: "Normal" | "Special"
  ) {
    const previousStage = this[stageAttr][type];
    const newStage = Math.min(6, Math.max(-6, previousStage + difference));

    this.logger?.ChangingStage?.(
      stageAttr,
      type,
      difference,
      previousStage,
      newStage
    );

    this[stageAttr][type] = newStage;

    if (this.isHuman) {
      this.stageBoostCounter++;
      this.logger?.IncrementingStageBoostCounter?.(this.stageBoostCounter);
    }
  }

  forceResetStages() {
    this.logger?.ForceResettingStagesAndStageBoostCounter?.();

    this.AttackStage.Normal = 0;
    this.AttackStage.Special = 0;
    this.DefenseStage.Normal = 0;
    this.DefenseStage.Special = 0;

    this.stageBoostCounter = 0;
  }

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
  private static getMultiplier = (stage: number): number => {
    if (stage < 0) return 1 / Player.getMultiplier(-stage);
    return stage / 2 + 1;
  };

  private RNG = (a: number, b: number) => this.random() * (b - a) + a;
}

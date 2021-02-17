import { Move, MoveLike } from "./move";
import Type from "./type";
declare type NormalSpecial<T = number> = {
    Normal: T;
    Special: T;
};
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
    private readonly isHuman;
    private readonly random;
    private readonly log?;
    private health;
    private AttackStage;
    private DefenseStage;
    private stageBoostCounter;
    private paralysisSpeedEffectWaived;
    private readonly Types;
    readonly Level: number;
    private readonly AttackPower;
    private readonly DefenseStat;
    private readonly SpeedStat;
    private readonly MaxHealth;
    private readonly Moves;
    private readonly CriticalDamagePct;
    private superPotionsLeft;
    constructor({ AttackPower, CriticalDamagePct, DefenseStat, Level, MaxHealth, Moves, SpeedStat, superPotionsLeft, Types, }: PlayerOptions, isHuman: boolean, random: () => number, log?: ((...data: any[]) => void) | undefined);
    private confusion?;
    sleepingTurnsLeft: number;
    private poisoned;
    private paralyzed;
    /**
     * @return Whether still alive
     */
    receiveDamagingMove: (move: MoveLike, actor: Player) => boolean;
    /**
     * @return Whether still alive
     */
    receiveDamage: (damage: number) => boolean;
    private calcDamage;
    private calcCriticalDamage;
    private getWeakness;
    private getStageBoostBonus;
    getSpeed: () => number;
    /**
     * @param takeSuperPotion
     * Whether the die indicates to take the super potion.
     * It actually happening depends on the current state of the player.
     * @param opponent
     */
    playTurn: (takeSuperPotion: boolean, opponent: Player) => {
        thisAlive: true;
        opponentAlive: boolean;
    } | {
        thisAlive: false;
        opponentAlive: true;
    };
    confuse: (actor: Player) => void;
    unConfuse: () => void;
    /**
     * Whether any in the condition group consisting of sleep, paralysis, poisoning is active.
     *
     * Because only one of these can be active at any given time,
     * and it is a lock, not an override
     */
    private sleepParalysisPoisonGroup;
    makeSleep: () => void;
    poison: () => void;
    paralyze: () => void;
    waiveParalysisSpeedEffect: () => void;
    deParalyze: () => void;
    adjustStage: (difference: number, stageAttr: "AttackStage" | "DefenseStage", type: "Normal" | "Special") => void;
    forceResetStages: () => void;
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
    private static getMultiplier;
    private RNG;
}
export {};

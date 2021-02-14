"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_1 = require("@mehra/ts");
const type_1 = require("./type");
const resistances_1 = require("./resistances");
class PlayerAlreadyDeadException extends ts_1.CustomError {
}
class Player {
    constructor({ AttackPower, CriticalDamagePct, DefenseStat, Level, MaxHealth, Moves, SpeedStat, superPotionsLeft, Types, }, isHuman, random) {
        this.isHuman = isHuman;
        this.random = random;
        this.AttackStage = { Normal: 0, Special: 0 };
        this.DefenseStage = { Normal: 0, Special: 0 };
        this.paralysisSpeedEffectWaived = false;
        this.sleepingTurnsLeft = 0;
        this.poisoned = false;
        this.paralyzed = false;
        /**
         * @return Whether still alive
         */
        this.receiveDamagingMove = (move, actor) => {
            // console.log(move);
            return this.receiveDamage(this.random() < this.CriticalDamagePct
                ? this.calcCriticalDamage(move, actor)
                : this.calcDamage(move, actor));
        };
        /**
         * @return Whether still alive
         */
        this.receiveDamage = (damage) => {
            this.health = Math.min(this.MaxHealth, Math.max(0, this.health - Math.floor(damage)));
            // console.log({
            //   damage: Math.floor(damage),
            //   isHuman: this.isHuman,
            //   healthAfter: this.health,
            // });
            return this.health > 0;
        };
        this.calcDamage = (move, actor) => {
            /**
             * Same Type Attack Bonus
             *
             * If the Player has the same type as the move being used,
             * they get a 50% damage bonus
             */
            const STAB = actor.Types.includes(move.Type) ? 1.5 : 1;
            let AttackPower;
            let AttackStage;
            let DefenseStat;
            let DefenseStage;
            if (move.isSpecial) {
                AttackPower = actor.AttackPower.Special;
                AttackStage = actor.AttackStage.Special;
                DefenseStat = this.DefenseStat.Special;
                DefenseStage = this.DefenseStage.Special;
            }
            else {
                AttackPower = actor.AttackPower.Normal;
                AttackStage = actor.AttackStage.Normal;
                DefenseStat = this.DefenseStat.Normal;
                DefenseStage = this.DefenseStage.Normal;
            }
            const AttackPowerScaled = AttackPower *
                actor.getStageBoostBonus() *
                Player.getMultiplier(AttackStage);
            const DefenseStatScaled = DefenseStat *
                this.getStageBoostBonus() *
                Player.getMultiplier(DefenseStage);
            return ((((actor.Level * (2 / 5) + 2) * move.AttackStat * AttackPowerScaled) /
                DefenseStatScaled /
                50 +
                2) *
                STAB *
                this.getWeakness(move.Type) *
                this.RNG(0.85, 1));
        };
        this.calcCriticalDamage = (move, actor) => {
            const STAB = actor.Types.includes(move.Type) ? 1.5 : 1;
            return ((((2 * actor.Level + 5) / (actor.Level + 5)) *
                (((((2 * actor.Level) / 5 + 2) *
                    move.AttackStat *
                    actor.AttackPower[move.isSpecial ? "Special" : "Normal"]) /
                    this.DefenseStat[move.isSpecial ? "Special" : "Normal"] /
                    50 +
                    2) *
                    STAB *
                    this.getWeakness(move.Type) *
                    this.RNG(85, 100))) /
                100);
        };
        this.getWeakness = (attackingType) => this.Types.map((defendingType) => {
            var _a, _b, _c;
            if ((_a = resistances_1.default[defendingType].weakTo) === null || _a === void 0 ? void 0 : _a.includes(attackingType))
                return 2;
            if ((_b = resistances_1.default[defendingType].strongTo) === null || _b === void 0 ? void 0 : _b.includes(attackingType))
                return 1 / 2;
            if ((_c = resistances_1.default[defendingType].immuneTo) === null || _c === void 0 ? void 0 : _c.includes(attackingType))
                return 0;
            return 1;
        }).reduce((a, b) => a * b);
        this.getStageBoostBonus = () => (9 / 8) ** this.stageBoostCounter;
        this.getSpeed = () => this.SpeedStat *
            this.getStageBoostBonus() *
            (this.paralyzed && !this.paralysisSpeedEffectWaived ? 1 / 4 : 1);
        /**
         * @param takeSuperPotion
         * Whether the die indicates to take the super potion.
         * It actually happening depends on the current state of the player.
         * @param opponent
         */
        this.playTurn = (takeSuperPotion, opponent) => {
            var _a;
            ts_1.Assert(this.receiveDamage(0), PlayerAlreadyDeadException);
            if (takeSuperPotion &&
                this.health < this.MaxHealth / 4 &&
                this.superPotionsLeft) {
                this.receiveDamage(-60);
                this.superPotionsLeft--;
                return { thisAlive: true, opponentAlive: true };
            }
            if (this.sleepingTurnsLeft) {
                // console.log("Sleeping");
                this.sleepingTurnsLeft--;
                return { thisAlive: true, opponentAlive: true };
            }
            if ((_a = this.confusion) === null || _a === void 0 ? void 0 : _a.turnsLeft) {
                // console.log("Confused", { turnsLeft: this.confusion.turnsLeft });
                this.confusion.turnsLeft--;
                if (this.random() < 0.5) {
                    // console.log("Doing confusion damage and ending turn");
                    return {
                        opponentAlive: true,
                        thisAlive: this.receiveDamagingMove({ AttackStat: 40, isSpecial: false, Type: type_1.default.never }, this.confusion.actor),
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
        this.confuse = (actor) => {
            var _a;
            if ((_a = this.confusion) === null || _a === void 0 ? void 0 : _a.turnsLeft)
                return;
            this.confusion = {
                actor,
                turnsLeft: Math.floor(this.RNG(1, 5)),
            };
        };
        this.unConfuse = () => {
            this.confusion = undefined;
        };
        /**
         * Whether any in the condition group consisting of sleep, paralysis, poisoning is active.
         *
         * Because only one of these can be active at any given time,
         * and it is a lock, not an override
         */
        this.sleepParalysisPoisonGroup = () => this.sleepingTurnsLeft || this.poisoned || this.paralyzed;
        this.makeSleep = () => {
            if (this.sleepParalysisPoisonGroup())
                return;
            this.sleepingTurnsLeft = Math.floor(this.RNG(1, 8));
        };
        this.poison = () => {
            if (this.Types.includes(type_1.default.Poison) || this.sleepParalysisPoisonGroup())
                return;
            this.poisoned = true;
        };
        this.paralyze = () => {
            if (this.sleepParalysisPoisonGroup())
                return;
            this.paralyzed = true;
        };
        this.waiveParalysisSpeedEffect = () => {
            this.paralysisSpeedEffectWaived = true;
        };
        this.deParalyze = () => {
            this.paralyzed = false;
            this.paralysisSpeedEffectWaived = false;
        };
        this.adjustStage = (difference, stageAttr, type) => {
            if (this.isHuman)
                this.stageBoostCounter++;
            this[stageAttr][type] = Math.min(6, Math.max(-6, this[stageAttr][type] + difference));
        };
        this.forceResetStages = () => {
            this.AttackStage.Normal = 0;
            this.AttackStage.Special = 0;
            this.DefenseStage.Normal = 0;
            this.DefenseStage.Special = 0;
            this.stageBoostCounter = 0;
        };
        this.RNG = (a, b) => this.random() * (b - a) + a;
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
    static getMultiplier(stage) {
        if (stage < 0)
            return 1 / this.getMultiplier(-stage);
        return stage / 2 + 1;
    }
}
exports.default = Player;

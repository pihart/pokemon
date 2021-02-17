"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_1 = require("./type");
const resistances_1 = require("./resistances");
const resistance_1 = require("./resistance");
class Player {
    constructor({ AttackPower, CriticalDamagePct, DefenseStat, Level, MaxHealth, Moves, SpeedStat, superPotionsLeft, Types, }, isHuman, random, log) {
        this.isHuman = isHuman;
        this.random = random;
        this.log = log;
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
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Receiving move", move, "from", actor);
            return this.receiveDamage(this.random() < this.CriticalDamagePct
                ? this.calcCriticalDamage(move, actor)
                : this.calcDamage(move, actor));
        };
        /**
         * @return Whether still alive
         */
        this.receiveDamage = (damage) => {
            var _a, _b, _c;
            const damageInt = Math.floor(damage);
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Taking damage of", damageInt, "rounded from", damage);
            (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, "Current health:", this.health, "of max health", this.MaxHealth);
            this.health = Math.min(this.MaxHealth, Math.max(0, this.health - damageInt));
            (_c = this.log) === null || _c === void 0 ? void 0 : _c.call(this, "Health is now", this.health);
            return this.health > 0;
        };
        this.calcDamage = (move, actor) => {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Damage is noncritical");
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
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Damage is critical");
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
        this.getWeakness = (attackingType) => this.Types.map((defendingType) => { var _a, _b; return (_b = (_a = resistances_1.default[defendingType]) === null || _a === void 0 ? void 0 : _a[attackingType]) !== null && _b !== void 0 ? _b : resistance_1.default.NORMAL; }).reduce((a, b) => a * b);
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
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Playing turn", { takeSuperPotion, opponent });
            if (takeSuperPotion &&
                this.health < this.MaxHealth / 4 &&
                this.superPotionsLeft) {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, "Taking super potion");
                this.receiveDamage(-60);
                this.superPotionsLeft--;
                (_c = this.log) === null || _c === void 0 ? void 0 : _c.call(this, "Ending turn", "superPotionsLeft:", this.superPotionsLeft);
                return { thisAlive: true, opponentAlive: true };
            }
            if (this.sleepingTurnsLeft) {
                (_d = this.log) === null || _d === void 0 ? void 0 : _d.call(this, "Sleeping");
                this.sleepingTurnsLeft--;
                (_e = this.log) === null || _e === void 0 ? void 0 : _e.call(this, "Ending turn", "sleepingTurnsLeft:", this.sleepingTurnsLeft);
                return { thisAlive: true, opponentAlive: true };
            }
            if ((_f = this.confusion) === null || _f === void 0 ? void 0 : _f.turnsLeft) {
                (_g = this.log) === null || _g === void 0 ? void 0 : _g.call(this, "Confused");
                this.confusion.turnsLeft--;
                (_h = this.log) === null || _h === void 0 ? void 0 : _h.call(this, "confusionTurnsLeft:", this.confusion.turnsLeft);
                if (this.random() < 0.5) {
                    (_j = this.log) === null || _j === void 0 ? void 0 : _j.call(this, "Doing confusion damage and ending turn");
                    return {
                        opponentAlive: true,
                        thisAlive: this.receiveDamagingMove({ AttackStat: 40, isSpecial: false, Type: type_1.default.never }, this.confusion.actor),
                    };
                }
                (_k = this.log) === null || _k === void 0 ? void 0 : _k.call(this, "Confusion did not work; continuing");
            }
            if (this.paralyzed) {
                (_l = this.log) === null || _l === void 0 ? void 0 : _l.call(this, "Paralyzed");
                if (this.random() < 0.25) {
                    (_m = this.log) === null || _m === void 0 ? void 0 : _m.call(this, "Ending turn due to paralysis");
                    return { thisAlive: true, opponentAlive: true };
                }
                (_o = this.log) === null || _o === void 0 ? void 0 : _o.call(this, "Paralysis did not work; continuing");
            }
            const chosenMove = Math.floor(this.RNG(0, this.Moves.length));
            (_p = this.log) === null || _p === void 0 ? void 0 : _p.call(this, "Attempting to play move", chosenMove);
            if (!this.Moves[chosenMove].execute(this, opponent, this.random)) {
                (_q = this.log) === null || _q === void 0 ? void 0 : _q.call(this, "Move killed opponent");
                return {
                    thisAlive: true,
                    opponentAlive: false,
                };
            }
            if (this.poisoned) {
                (_r = this.log) === null || _r === void 0 ? void 0 : _r.call(this, "Poisoned; taking damage of 1/16 max");
                return {
                    thisAlive: this.receiveDamage(this.MaxHealth / 16),
                    opponentAlive: true,
                };
            }
            return { thisAlive: true, opponentAlive: true };
        };
        this.confuse = (actor) => {
            var _a, _b, _c, _d;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Getting confused by player", actor);
            if ((_b = this.confusion) === null || _b === void 0 ? void 0 : _b.turnsLeft) {
                (_c = this.log) === null || _c === void 0 ? void 0 : _c.call(this, "Already confused; cancelling");
                return;
            }
            const turnsLeft = Math.floor(this.RNG(1, 5));
            this.confusion = {
                actor,
                turnsLeft,
            };
            (_d = this.log) === null || _d === void 0 ? void 0 : _d.call(this, "Confused for", turnsLeft, "turns");
        };
        this.unConfuse = () => {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Removing confusion");
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
            var _a, _b, _c;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Being told to sleep");
            if (this.sleepParalysisPoisonGroup()) {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, "Already affected by condition in group; cancelling");
                return;
            }
            this.sleepingTurnsLeft = Math.floor(this.RNG(1, 8));
            (_c = this.log) === null || _c === void 0 ? void 0 : _c.call(this, "Sleeping for", this.sleepingTurnsLeft, "turns");
        };
        this.poison = () => {
            var _a, _b, _c, _d;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Getting poisoned");
            if (this.Types.includes(type_1.default.Poison)) {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, "Am poison type; cannot get poisoned; cancelling");
                return;
            }
            if (this.sleepParalysisPoisonGroup()) {
                (_c = this.log) === null || _c === void 0 ? void 0 : _c.call(this, "Already affected by condition in group; cancelling");
                return;
            }
            this.poisoned = true;
            (_d = this.log) === null || _d === void 0 ? void 0 : _d.call(this, "Am now poisoned");
        };
        this.paralyze = () => {
            var _a, _b, _c;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Getting paralyzed");
            if (this.sleepParalysisPoisonGroup()) {
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, "Already affected by condition in group; cancelling");
                return;
            }
            this.paralyzed = true;
            (_c = this.log) === null || _c === void 0 ? void 0 : _c.call(this, "Am now paralyzed");
        };
        this.waiveParalysisSpeedEffect = () => {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Waiving paralysis speed effect");
            this.paralysisSpeedEffectWaived = true;
        };
        this.deParalyze = () => {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Removing paralysis and paralysis speed waiver (if it exists)");
            this.paralyzed = false;
            this.paralysisSpeedEffectWaived = false;
        };
        this.adjustStage = (difference, stageAttr, type) => {
            var _a, _b;
            const previousStage = this[stageAttr][type];
            const newStage = Math.min(6, Math.max(-6, previousStage + difference));
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Changing stage", stageAttr, "of type", type, "by", difference, "from", previousStage, "to", newStage);
            this[stageAttr][type] = newStage;
            if (this.isHuman) {
                this.stageBoostCounter++;
                (_b = this.log) === null || _b === void 0 ? void 0 : _b.call(this, "Am human; incrementing stageBoostCounter to", this.stageBoostCounter);
            }
        };
        this.forceResetStages = () => {
            var _a;
            (_a = this.log) === null || _a === void 0 ? void 0 : _a.call(this, "Force resetting all stages and stage boost counter");
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

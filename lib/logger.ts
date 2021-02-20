import Player from "./player";
import { Move, MoveLike } from "./move";

/**
 * A standard logging function, like `console.log`.
 */
export interface Log {
  (message: string, ...data: any): void;
  (...data: any[]): void;
}

interface Logger {
  LogSession(action: "Ending" | "Using new"): void;
}

/**
 * An intentioned logger specific to game orchestrator of this application.
 */
export interface GameLogger extends Logger {
  Winner(team: "A" | "B"): void;
  GameMode(mode: "round" | "until winner"): void;
  Speeds(speeds: { a: number; b: number }): void;
  PlayingFirst(team: "A" | "B"): void;
  RoundWinner(winner: "first" | "second" | "none", AFirst: boolean): void;
}

export interface TeamLogger extends Logger {
  PlayingTurnAgainst(player: Player): void;

  DieRollValue(value: number): void;

  /**
   * To indicate that a swap is occurring.
   * @param swapType Whether following existing swap or creating a new one
   * @param oldIndex Index of starting player
   * @param newIndex Index of ending player
   * @warn Indices do not necessarily represent the original order of players as elements are removed from the array.
   */
  SwappingPlayer(
    swapType: "Following existing" | "Creating new",
    oldIndex: number,
    newIndex: number
  ): void;

  Death(party: "Opponent" | "Own player"): void;

  /**
   * @param message Take this parameter so that meaning of the log is clear at the call site.
   */
  EndingTurn(message: "No deaths"): void;

  TerminatingPlayer(index: number, value: Player): void;

  RemainingPlayers(players: Player[]): void;
}

export interface PlayerLogger extends Logger {
  Resetting(): void;
  ReceivingMove(move: MoveLike, opponent: Player): void;
  Health(current: number, max: number): void;
  TakingDamage(rounded: number, preRound: number): void;
  DamageType(type: "critical" | "noncritical"): void;
  PlayingTurn(options: { takeSuperPotion: boolean; opponent: Player }): void;
  TakingSuperPotion(): void;
  State(state: "Sleeping" | "Confused" | "Paralyzed"): void;
  State(state: "Poisoned", message: "taking damage of 1/16 max"): void;
  EffectSuccess(
    effect: "Confusion" | "Paralysis",
    status: "successful" | "unsuccessful"
  ): void;
  QuantityRemaining(
    type: "Super potions" | "Confusion turns" | "Sleeping Turns",
    quantity: number
  ): void;
  PlayingMove(index: number, move: Move): void;
  MoveKilledOpponent(): void;
  GettingCondition(condition: "sleep" | "paralysis" | "poison"): void;
  GettingCondition(condition: "confusion", actor: Player): void;
  CancelCondition(
    reason:
      | "Already confused"
      | "Already affected by condition in group"
      | "Am poison type; cannot get poisoned"
  ): void;
  RemovingCondition(
    condition: "confusion" | "paralysis and paralysis speed waiver"
  ): void;
  WaivingParalysisSpeedEffect(): void;
  ChangingStage(
    stage: "AttackStage" | "DefenseStage",
    type: "Normal" | "Special",
    difference: number,
    from: number,
    to: number
  ): void;
  IncrementingStageBoostCounter(valueAfter: number): void;
  ForceResettingStagesAndStageBoostCounter(): void;
}

/**
 * Adds descriptions to the intentions and then logs them to a specified Log
 */
export class DescriptiveLogger implements GameLogger, TeamLogger, PlayerLogger {
  constructor(private log: Log) {}

  /* Common */
  LogSession(action: string) {
    this.log(`${action} log session`);
  }

  /* Game */
  Winner(winner: string) {
    this.log(`Winner is Team ${winner}`);
  }

  GameMode(mode: string) {
    this.log(`Playing ${mode}`);
  }

  Speeds(speeds: { a: number; b: number }) {
    this.log("Speeds:", speeds);
  }

  PlayingFirst(team: string) {
    this.log(`Team ${team} plays first`);
  }

  RoundWinner(winner: string, AFirst: boolean) {
    this.log("Round winner:", winner, { AFirst });
  }

  /* Team */
  PlayingTurnAgainst(player: Player) {
    this.log("Playing turn against", player);
  }

  DieRollValue(value: number) {
    this.log("Die roll value is", value);
  }

  SwappingPlayer(swapType: string, oldIndex: number, newIndex: number) {
    this.log("Swapping, un-confusing current");
    this.log(`${swapType} swap: replacing`, oldIndex, "with", newIndex);
  }

  Death(party: string) {
    this.log(`${party} has died`);
  }

  EndingTurn(message: string) {
    this.log(`${message}; ending turn`);
  }

  TerminatingPlayer(index: number, value: Player) {
    this.log("Active player with index", index, "and value", value, "has died");
  }

  RemainingPlayers(players: Player[]) {
    this.log("Remaining players:", players);
  }

  /* Player */
  Resetting() {
    this.log("Resetting");
  }

  ReceivingMove(move: MoveLike, opponent: Player) {
    this.log("Receiving move", move, "from", opponent);
  }

  Health(current: number, max: number) {
    this.log("Health is", current, "of", max);
  }

  TakingDamage(rounded: number, preRound: number) {
    this.log("Taking damage of", rounded, "rounded from", preRound);
  }

  DamageType(type: "critical" | "noncritical") {
    this.log(`Damage is ${type}`);
  }

  PlayingTurn(options: { takeSuperPotion: boolean; opponent: Player }) {
    this.log("Playing turn", options);
  }

  TakingSuperPotion() {
    this.log("Taking super potion");
  }

  State(state: string, message = "") {
    this.log(`${state}${message ? `; ${message}` : ""}`);
  }

  EffectSuccess(effect: string, status: string) {
    this.log(`${effect} was ${status}`);
  }

  QuantityRemaining(type: string, quantity: number) {
    this.log(`${type} left:`, quantity);
  }

  PlayingMove(index: number, move: Move) {
    this.log("Attempting to play move", index, move);
  }

  MoveKilledOpponent() {
    this.log("Move killed opponent");
  }

  GettingCondition(condition: string, actor?: Player) {
    this.log(`Getting ${condition}${actor ? " from" : ""}`, actor);
  }

  CancelCondition(reason: string) {
    this.log(`${reason}; cancelling`);
  }

  RemovingCondition(condition: string) {
    this.log(`Removing ${condition}`);
  }

  WaivingParalysisSpeedEffect() {
    this.log("Waiving paralysis speed effect");
  }

  ChangingStage(
    stage: string,
    type: string,
    difference: number,
    from: number,
    to: number
  ) {
    this.log(
      "Changing stage",
      stage,
      "of type",
      type,
      "by",
      difference,
      "from",
      from,
      "to",
      to
    );
  }
  IncrementingStageBoostCounter(valueAfter: number) {
    this.log("Am human; incrementing stageBoostCounter to", valueAfter);
  }

  ForceResettingStagesAndStageBoostCounter() {
    this.log("Force resetting all stages and stage boost counter");
  }
}

import { GameLogger, Player, PlayerLogger, TeamLogger } from "../dist/lib";
import { Move, MoveLike } from "../dist/lib/move";

export default class TestingLogger
  implements GameLogger, TeamLogger, PlayerLogger {
  log: { [index: string]: any[] }[] = [];

  private record(action: string, ...data: any[]) {
    this.log.push({
      [action]: data,
    });
  }

  CancelCondition(
    reason:
      | "Already confused"
      | "Already affected by condition in group"
      | "Am poison type; cannot get poisoned"
  ): void {
    this.record("CancelCondition", reason);
  }

  ChangingStage(
    stage: "AttackStage" | "DefenseStage",
    type: "Normal" | "Special",
    difference: number,
    from: number,
    to: number
  ): void {
    this.record("ChangingStage", stage, type, difference, from, to);
  }

  DamageType(type: "critical" | "noncritical"): void {
    this.record("DamageType", type);
  }

  Death(party: "Opponent" | "Own player"): void {
    this.record("Death", party);
  }

  DieRollValue(value: number): void {
    this.record("DieRollValue", value);
  }

  EffectSuccess(
    effect: "Confusion" | "Paralysis",
    status: "successful" | "unsuccessful"
  ): void {
    this.record("EffectSuccess", effect, status);
  }

  EndingTurn(message: "No deaths"): void {
    this.record("EndingTurn", message);
  }

  ForceResettingStagesAndStageBoostCounter(): void {
    this.record("ForceResettingStagesAndStageBoostCounter");
  }

  GameMode(mode: "round" | "until winner"): void {
    this.record("GameMode");
  }

  GettingCondition(condition: "sleep" | "paralysis" | "poison"): void;
  GettingCondition(condition: "confusion", actor: Player): void;
  GettingCondition(
    condition: "sleep" | "paralysis" | "poison" | "confusion",
    actor?: Player
  ): void {
    this.record("GettingCondition", condition, { ...actor });
  }

  Health(current: number, max: number): void {
    this.record("Health", current, max);
  }

  IncrementingStageBoostCounter(valueAfter: number): void {
    this.record("IncrementingStageBoostCounter", valueAfter);
  }

  LogSession(action: "Ending" | "Using new"): void {
    this.record("LogSession", action);
  }

  MoveKilledOpponent(): void {
    this.record("MoveKilledOpponent");
  }

  PlayingFirst(team: "A" | "B"): void {
    this.record("PlayingFirst", team);
  }

  PlayingMove(index: number, move: Move): void {
    this.record("PlayingMove", index, { ...move });
  }

  PlayingTurn({
    takeSuperPotion,
    opponent,
  }: {
    takeSuperPotion: boolean;
    opponent: Player;
  }): void {
    this.record("PlayingTurn", takeSuperPotion, { ...opponent });
  }

  PlayingTurnAgainst(player: Player): void {
    this.record("PlayingTurnAgainst", { ...player });
  }

  QuantityRemaining(
    type: "Super potions" | "Confusion turns" | "Sleeping Turns",
    quantity: number
  ): void {
    this.record("QuantityRemaining", type, quantity);
  }

  ReceivingMove(move: MoveLike, opponent: Player): void {
    this.record("ReceivingMove", { ...move }, { ...opponent });
  }

  RemainingPlayers(players: Player[]): void {
    this.record(
      "RemainingPlayers",
      players.map((player) => ({ ...player }))
    );
  }

  RemovingCondition(
    condition: "confusion" | "paralysis and paralysis speed waiver"
  ): void {
    this.record("RemovingCondition", condition);
  }

  Resetting(): void {
    this.record("Resetting");
  }

  RoundWinner(winner: "first" | "second" | "none", AFirst: boolean): void {
    this.record("RoundWinner", winner, AFirst);
  }

  Speeds(speeds: { a: number; b: number }): void {
    this.record("Speeds", speeds);
  }

  State(state: "Sleeping" | "Confused" | "Paralyzed"): void;
  State(state: "Poisoned", message: "taking damage of 1/16 max"): void;
  State(
    state: "Sleeping" | "Confused" | "Paralyzed" | "Poisoned",
    message?: "taking damage of 1/16 max"
  ): void {
    this.record("State", state, message);
  }

  SwappingPlayer(
    swapType: "Following existing" | "Creating new",
    oldIndex: number,
    newIndex: number
  ): void {
    this.record("SwappingPlayer", oldIndex, newIndex);
  }

  TakingDamage(rounded: number, preRound: number): void {
    this.record("TakingDamage", rounded, preRound);
  }

  TakingSuperPotion(): void {
    this.record("TakingSuperPotion");
  }

  TerminatingPlayer(index: number, value: Player): void {
    this.record("TerminatingPlayer", index, { ...value });
  }

  WaivingParalysisSpeedEffect(): void {
    this.record("WaivingParalysisSpeedEffect");
  }

  Winner(team: "A" | "B"): void {
    this.record("Winner", team);
  }
}

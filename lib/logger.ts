import Player from "./player";

type Team = "A" | "B";
type TeamFn = (team: Team) => void;

/**
 * A standard logging function, like `console.log`.
 */
export interface Log {
  (message: string, ...data: any): void;
  (...data: any[]): void;
}

/**
 * An intentioned logger specific to game orchestrator of this application.
 */
export interface GameLogger {
  Winner: TeamFn;
  GameMode: (mode: "round" | "until winner") => void;
  Speeds: (speeds: { a: number; b: number }) => void;
  PlayingFirst: TeamFn;
  RoundWinner: (winner: "first" | "second" | "none", AFirst: boolean) => void;
}

export interface TeamLogger {
  PlayingTurnAgainst: (player: Player) => void;

  DieRollValue: (value: number) => void;

  /**
   * To indicate that a swap is occurring.
   * @param swapType Whether following existing swap or creating a new one
   * @param oldIndex Index of starting player
   * @param newIndex Index of ending player
   * @warn Indices do not necessarily represent the original order of players as elements are removed from the array.
   */
  SwappingPlayer: (
    swapType: "Following existing" | "Creating new",
    oldIndex: number,
    newIndex: number
  ) => void;

  Death: (party: "Opponent" | "Own player") => void;

  /**
   * @param message Take this parameter so that meaning of the log is clear at the call site.
   */
  EndingTurn: (message: "No deaths") => void;

  TerminatingPlayer: (index: number, value: Player) => void;

  RemainingPlayers: (players: Player[]) => void;
}

/**
 * Adds descriptions to the intentions and then logs them to a specified Log
 */
export class DescriptiveLogger implements GameLogger, TeamLogger {
  constructor(private log: Log) {}

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
}

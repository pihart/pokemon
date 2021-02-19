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
 * An intentioned logger specific to this application.
 */
export interface Logger {
  Winner: TeamFn;
  GameMode: (mode: "round" | "until winner") => void;
  Speeds: (speeds: { a: number; b: number }) => void;
  PlaysFirst: TeamFn;
  RoundWinner: (winner: "first" | "second" | "none", AFirst: boolean) => void;
}

/**
 * Adds descriptions to the intentions and then logs them to a specified Log
 */
export class DescriptiveLogger implements Logger {
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

  PlaysFirst(team: string) {
    this.log(`Team ${team} plays first`);
  }

  RoundWinner(winner: string, AFirst: boolean) {
    this.log("Round winner:", winner, { AFirst });
  }
}

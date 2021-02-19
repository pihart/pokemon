import Team from "./team";
import { Logger } from "./logger";

export default class Game {
  public randomLog: number[] = [];

  constructor(
    private readonly teamA: Team,
    private readonly teamB: Team,
    private readonly random: () => number,
    private readonly logger?: Partial<Logger>
  ) {}

  /**
   * @return Whether Team A wins
   */
  play(): boolean {
    this.logger?.GameMode?.("until winner");
    let AWins;
    while (AWins === undefined) {
      AWins = this.playRound();
    }
    this.logger?.Winner?.(AWins ? "A" : "B");
    return AWins;
  }

  /**
   * @return Whether Team A wins
   */
  playRound(): boolean | void {
    this.logger?.GameMode?.("round");

    const { teamA: A, teamB: B } = this;

    const a = A.getSpeed();
    const b = B.getSpeed();
    this.logger?.Speeds?.({ a, b });

    const AFirst = a === b ? this.random() < 0.5 : a > b;
    this.logger?.PlaysFirst?.(AFirst ? "A" : "B");

    const teamOrder: [Team, Team] = AFirst ? [A, B] : [B, A];

    const winner = Game.playRoundGivenTeamOrder(...teamOrder);
    this.logger?.RoundWinner?.(winner ?? "none", AFirst);

    if (winner === "first") return AFirst;
    if (winner === "second") return !AFirst;
  }

  /**
   * @return The winner, if any
   */
  private static playRoundGivenTeamOrder(
    first: Team,
    second: Team
  ): "first" | "second" | undefined {
    const turn1 = first.playTurn(second);

    if (!turn1.thisActive) return "second";
    if (!turn1.opponentActive) return "first";

    const turn2 = second.playTurn(first);

    if (!turn2.thisActive) return "first";
    if (!turn2.opponentActive) return "second";

    return;
  }
}

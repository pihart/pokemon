import Team from "./team";

export default class Game {
  public randomLog: number[] = [];

  constructor(
    private readonly teamA: Team,
    private readonly teamB: Team,
    private readonly random: () => number,
    private readonly log?: (...data: any[]) => void
  ) {}

  /**
   * @return Whether Team A wins
   */
  play(): boolean {
    this.log?.("Playing until winner");
    let AWins;
    while (AWins === undefined) {
      AWins = this.playRound();
    }
    this.log?.("Winner is", AWins ? "Team A" : "Team B");
    return AWins;
  }

  /**
   * @return Whether Team A wins
   */
  playRound(): boolean | void {
    this.log?.("Playing round");

    const { teamA: A, teamB: B } = this;

    const a = A.getSpeed();
    const b = B.getSpeed();
    this.log?.("Speeds:", { a, b });

    const AFirst = a === b ? this.random() < 0.5 : a > b;
    this.log?.("A plays first?", AFirst);

    const teamOrder: [Team, Team] = AFirst ? [A, B] : [B, A];

    const winner = Game.playRoundGivenTeamOrder(...teamOrder);
    this.log?.("Round winner:", winner ?? "none", { AFirst });

    if (winner === "first") return AFirst;
    if (winner === "second") return !AFirst;
  }

  /**
   * @return The winner, if any
   */
  private static playRoundGivenTeamOrder(
    first: Team,
    second: Team
  ): "first" | "second" | void {
    const turn1 = first.playTurn(second);

    if (!turn1.thisActive) return "second";
    if (!turn1.opponentActive) return "first";

    const turn2 = second.playTurn(first);

    if (!turn2.thisActive) return "first";
    if (!turn2.opponentActive) return "second";
  }
}

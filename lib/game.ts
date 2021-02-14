import Team from "./team";

class Game {
  constructor(private teamA: Team, private teamB: Team) {}

  /**
   * @return Whether Team A wins
   */
  private playRound(): boolean | void {
    const { teamA: A, teamB: B } = this;

    const a = A.getSpeed();
    const b = B.getSpeed();

    const AFirst = a === b ? Math.random() < 0.5 : a > b;

    const teamOrder: [Team, Team] = AFirst ? [A, B] : [B, A];

    const winner = Game.playRoundGivenTeamOrder(...teamOrder);
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

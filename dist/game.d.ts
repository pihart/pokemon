import Team from "./team";
export default class Game {
    private teamA;
    private teamB;
    constructor(teamA: Team, teamB: Team);
    /**
     * @return Whether Team A wins
     */
    play(): boolean;
    /**
     * @return Whether Team A wins
     */
    private playRound;
    /**
     * @return The winner, if any
     */
    private static playRoundGivenTeamOrder;
}

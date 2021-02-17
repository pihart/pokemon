import Team from "./team";
export default class Game {
    private teamA;
    private teamB;
    private random;
    randomLog: number[];
    constructor(teamA: Team, teamB: Team, random: () => number);
    /**
     * @return Whether Team A wins
     */
    play(): boolean;
    /**
     * @return Whether Team A wins
     */
    playRound(): boolean | void;
    /**
     * @return The winner, if any
     */
    private static playRoundGivenTeamOrder;
}

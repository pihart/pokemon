"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Game {
    constructor(teamA, teamB, random) {
        this.teamA = teamA;
        this.teamB = teamB;
        this.random = random;
        this.randomLog = [];
    }
    /**
     * @return Whether Team A wins
     */
    play() {
        let AWins;
        while (AWins === undefined) {
            AWins = this.playRound();
        }
        return AWins;
    }
    /**
     * @return Whether Team A wins
     */
    playRound() {
        const { teamA: A, teamB: B } = this;
        const a = A.getSpeed();
        const b = B.getSpeed();
        const AFirst = a === b ? this.random() < 0.5 : a > b;
        const teamOrder = AFirst ? [A, B] : [B, A];
        const winner = Game.playRoundGivenTeamOrder(...teamOrder);
        if (winner === "first")
            return AFirst;
        if (winner === "second")
            return !AFirst;
    }
    /**
     * @return The winner, if any
     */
    static playRoundGivenTeamOrder(first, second) {
        const turn1 = first.playTurn(second);
        if (!turn1.thisActive)
            return "second";
        if (!turn1.opponentActive)
            return "first";
        const turn2 = second.playTurn(first);
        if (!turn2.thisActive)
            return "first";
        if (!turn2.opponentActive)
            return "second";
    }
}
exports.default = Game;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_1 = require("@mehra/ts");
class Team {
    constructor(players) {
        this.players = players;
        this.currentPlayer = 0;
        this.getSpeed = () => this.getCurrentPlayer().getSpeed();
        this.getCurrentPlayer = () => this.players[this.currentPlayer];
    }
    playTurn(opponentTeam) {
        const die = Math.floor(Math.random() * 256);
        // Swap
        if (this.players.length >= 2 && die < 20) {
            this.getCurrentPlayer().unConfuse();
            // If part of swapped pair, swap along the pair
            if (this.swappedPlayer !== undefined) {
                const current = this.currentPlayer;
                this.currentPlayer = this.swappedPlayer;
                this.swappedPlayer = current;
            }
            else {
                this.swappedPlayer = this.currentPlayer;
                this.currentPlayer++;
                this.currentPlayer %= this.players.length;
            }
            return { opponentActive: true, thisActive: true };
        }
        const { opponentAlive, thisAlive } = this.getCurrentPlayer().playTurn(die < 128, opponentTeam.getCurrentPlayer());
        if (!opponentAlive)
            return {
                opponentActive: opponentTeam.terminatePlayer(),
                thisActive: true,
            };
        if (!thisAlive)
            return {
                opponentActive: true,
                thisActive: this.terminatePlayer(),
            };
        return { opponentActive: true, thisActive: true };
    }
    /**
     * Apply when current player is dead
     * @return
     * Whether the game is still active;
     * i.e. whether there is another teammate who is alive
     */
    terminatePlayer() {
        ts_1.Assert(!this.getCurrentPlayer().receiveDamage(0));
        // Delete the current player from the array
        this.players.splice(this.currentPlayer, 1);
        if (!this.players.length)
            return false;
        if (this.swappedPlayer !== undefined) {
            // Subtract 1 if you shifted the indices by deleting the current player
            let offset = this.swappedPlayer > this.currentPlayer ? 1 : 0;
            this.currentPlayer = this.swappedPlayer - offset;
            this.swappedPlayer = undefined;
        }
        this.currentPlayer %= this.players.length;
        return true;
    }
}
exports.default = Team;

import { NonEmptyArray } from "@mehra/ts";
import Player from "./player";
export default class Team {
    private readonly players;
    private random;
    private currentPlayer;
    /**
     * The index of the player that the current player is swapped with, if any.
     *
     * There is only ever one swapped pair;
     * a member of a swapped pair dying means that neither member of the pair is swapped anymore.
     * This also means that there can be no background swapped pairs:
     * if the active player is not in a swapped pair, then nobody else is either.
     */
    private swappedPlayer?;
    constructor(players: NonEmptyArray<Player>, random: () => number);
    getSpeed: () => number;
    getCurrentPlayer: () => Player;
    playTurn(opponentTeam: Team): {
        thisActive: true;
        opponentActive: boolean;
    } | {
        thisActive: false;
        opponentActive: true;
    };
    /**
     * Apply when current player is dead
     * @return
     * Whether the game is still active;
     * i.e. whether there is another teammate who is alive
     */
    private terminatePlayer;
}

import { Assert, NonEmptyArray } from "@mehra/ts";
import Player from "./player";

export default class Team {
  private currentPlayer = 0;
  /**
   * The index of the player that the current player is swapped with, if any.
   *
   * There is only ever one swapped pair;
   * a member of a swapped pair dying means that neither member of the pair is swapped anymore.
   * This also means that there can be no background swapped pairs:
   * if the active player is not in a swapped pair, then nobody else is either.
   */
  private swappedPlayer?: number;

  constructor(private readonly players: NonEmptyArray<Player>) {}

  getSpeed = () => this.getCurrentPlayer().getSpeed();

  getCurrentPlayer = (): Player => this.players[this.currentPlayer];

  /**
   * @return Whether any team member is alive
   */
  playTurn(opponentTeam: Team): boolean {
    const die = Math.floor(Math.random() * 256);

    // Swap
    if (this.players.length >= 2 && die < 20) {
      // If part of swapped pair, swap along the pair
      if (this.swappedPlayer !== undefined) {
        const current = this.currentPlayer;
        this.currentPlayer = this.swappedPlayer;
        this.swappedPlayer = current;
      } else {
        this.swappedPlayer = this.currentPlayer;
        this.currentPlayer++;
        this.currentPlayer %= this.players.length;
      }
      return true;
    }

    const { opponentAlive, thisAlive } = this.getCurrentPlayer().playTurn(
      die < 128,
      opponentTeam.getCurrentPlayer()
    );

    if (!opponentAlive) return opponentTeam.terminatePlayer();
    if (!thisAlive) return this.terminatePlayer();

    return true;
  }

  /**
   * Apply when current player is dead
   * @return
   * Whether the game is still active;
   * i.e. whether there is another teammate who is alive
   */
  private terminatePlayer() {
    Assert(!this.getCurrentPlayer().receiveDamage(0));

    // Delete the current player from the array
    this.players.splice(this.currentPlayer, 1);

    if (this.swappedPlayer !== undefined) {
      // Subtract 1 if you shifted the indices by deleting the current player
      let offset = this.swappedPlayer > this.currentPlayer ? 1 : 0;
      this.currentPlayer = this.swappedPlayer - offset;

      this.swappedPlayer = undefined;

      // swapped player is always alive, by definition
      return true;
    }

    this.currentPlayer %= this.players.length;
    return this.players.length >= 0;
  }
}

import { NonEmptyArray } from "@mehra/ts";
import Player from "./player";

class Team {
  public currentPlayer = 0;
  /**
   * The index of the player that the current player is swapped with, if any.
   *
   * There is only ever one swapped pair;
   * a member of a swapped pair dying means that neither member of the pair is swapped anymore.
   * This also means that there can be no background swapped pairs:
   * if the active player is not in a swapped pair, then nobody else is either.
   */
  private swappedPlayer?: number;

  constructor(private readonly players: Readonly<NonEmptyArray<Player>>) {}

  /**
   * @return Whether any team member is alive
   */
  playTurn(opponent: Player): boolean {
    const die = Math.floor(Math.random() * 256);

    // Test swap
    if (die < 20) {
      // If part of swapped pair, swap along the pair
      if (this.swappedPlayer !== undefined) {
        const current = this.currentPlayer;
        this.currentPlayer = this.swappedPlayer;
        this.swappedPlayer = current;
      }

      // swap some other way

      return true;
    }

    if (!this.players[this.currentPlayer].playTurn(die < 128, opponent))
      return this.terminatePlayer();

    return true;
  }

  /**
   * @return Whether the game is still active
   */
  private terminatePlayer() {
    if (this.swappedPlayer !== undefined) {
      this.currentPlayer = this.swappedPlayer;
      this.swappedPlayer = undefined;
      // swapped player is always alive, by definition
      return true;
    }

    const { length } = this.players;

    for (let offset = 1; offset < length; offset++) {
      const index = (this.currentPlayer + offset) % length;
      if (this.players[index].receiveDamage(0)) {
        this.currentPlayer = index;
        return true;
      }
    }

    return false;
  }
}

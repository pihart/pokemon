import { NonEmptyArray } from "@mehra/ts";
import Player from "./player";

class Team {
  public currentPlayer = 0;

  constructor(private readonly players: Readonly<NonEmptyArray<Player>>) {}

  /**
   * @return Whether any team member is alive
   */
  playTurn(opponent: Player): boolean {
    const result = this.players[this.currentPlayer].playTurnBeforeSwap();

    if (!result.isAlive) {
      return this.terminatePlayer();
    }

    if (result.turnEnded) {
      return true;
    }

    // Test swap
    if (Math.random() < 20 / 256) {
    }

    if (!this.players[this.currentPlayer].playTurnAfterSwap(opponent))
      return this.terminatePlayer();

    return true;
  }

  /**
   * @return Whether the game is still active
   */
  private terminatePlayer() {
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

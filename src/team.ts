import { NonEmptyArray } from "@mehra/ts";
import Player from "./player";

class Team {
  public currentPlayer = 0;

  constructor(private readonly players: NonEmptyArray<Player>) {}

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
    this.players.splice(this.currentPlayer, 1);
    this.currentPlayer %= this.players.length;
    return this.players.length >= 0;
  }
}

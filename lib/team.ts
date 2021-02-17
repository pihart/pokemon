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

  constructor(
    private readonly players: NonEmptyArray<Player>,
    private readonly random: () => number,
    private readonly log?: (...data: any[]) => void
  ) {}

  getSpeed = () => this.getCurrentPlayer().getSpeed();

  getCurrentPlayer = (): Player => this.players[this.currentPlayer];

  playTurn(
    opponentTeam: Team
  ):
    | { thisActive: true; opponentActive: boolean }
    | { thisActive: false; opponentActive: true } {
    this.log?.("Playing turn with player", this.getCurrentPlayer());

    const die = Math.floor(this.random() * 256);
    this.log?.("Die is", 256);

    // Swap
    if (this.players.length >= 2 && die < 20) {
      this.log?.("Swapping, un-confusing current");
      this.getCurrentPlayer().unConfuse();
      // If part of swapped pair, swap along the pair
      if (this.swappedPlayer !== undefined) {
        const current = this.currentPlayer;
        this.currentPlayer = this.swappedPlayer;
        this.log?.(
          "Following existing swap: replacing",
          current,
          "with",
          this.currentPlayer
        );
        this.swappedPlayer = current;
      } else {
        this.swappedPlayer = this.currentPlayer;
        this.currentPlayer++;
        this.currentPlayer %= this.players.length;
        this.log?.(
          "Creating new swap: replacing",
          this.swappedPlayer,
          "with",
          this.currentPlayer
        );
      }
      return { opponentActive: true, thisActive: true };
    }

    const { opponentAlive, thisAlive } = this.getCurrentPlayer().playTurn(
      die < 128,
      opponentTeam.getCurrentPlayer()
    );

    if (!opponentAlive) {
      this.log?.("Opponent has died");
      return {
        opponentActive: opponentTeam.terminatePlayer(),
        thisActive: true,
      };
    }
    if (!thisAlive) {
      this.log?.("Own player has died");
      return {
        opponentActive: true,
        thisActive: this.terminatePlayer(),
      };
    }

    this.log?.("No deaths; ending turn");

    return { opponentActive: true, thisActive: true };
  }

  /**
   * Apply when current player is dead
   * @return
   * Whether the game is still active;
   * i.e. whether there is another teammate who is alive
   */
  private terminatePlayer() {
    Assert(!this.getCurrentPlayer().receiveDamage(0));
    this.log?.(
      "Active player with index",
      this.currentPlayer,
      "and value",
      this.getCurrentPlayer(),
      "has died"
    );

    // Delete the current player from the array
    this.players.splice(this.currentPlayer, 1);

    this.log?.("Remaining players:", this.players);

    if (!this.players.length) return false;

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

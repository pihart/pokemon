import { Assert, NonEmptyArray } from "@mehra/ts";
import { TeamLogger } from "./logger";
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
    private readonly logger?: Partial<TeamLogger>
  ) {}

  getSpeed = () => this.getCurrentPlayer().getSpeed();

  getCurrentPlayer = (): Player => this.players[this.currentPlayer];

  playTurn(
    opponentTeam: Team
  ):
    | { thisActive: true; opponentActive: boolean }
    | { thisActive: false; opponentActive: true } {
    this.logger?.PlayingTurnAgainst?.(this.getCurrentPlayer());

    const die = Math.floor(this.random() * 256);
    this.logger?.DieRollValue?.(die);

    // Swap
    if (this.players.length >= 2 && die < 20) {
      this.getCurrentPlayer().unConfuse();
      // If part of swapped pair, swap along the pair
      if (this.swappedPlayer !== undefined) {
        const current = this.currentPlayer;
        this.currentPlayer = this.swappedPlayer;
        this.logger?.SwappingPlayer?.(
          "Following existing",
          current,
          this.currentPlayer
        );
        this.swappedPlayer = current;
      } else {
        this.swappedPlayer = this.currentPlayer;
        this.currentPlayer++;
        this.currentPlayer %= this.players.length;
        this.logger?.SwappingPlayer?.(
          "Creating new",
          this.swappedPlayer,
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
      this.logger?.Death?.("Opponent");
      return {
        opponentActive: opponentTeam.terminatePlayer(),
        thisActive: true,
      };
    }
    if (!thisAlive) {
      this.logger?.Death?.("Own player");
      return {
        opponentActive: true,
        thisActive: this.terminatePlayer(),
      };
    }

    this.logger?.EndingTurn?.("No deaths");

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
    this.logger?.TerminatingPlayer?.(
      this.currentPlayer,
      this.getCurrentPlayer()
    );

    // Delete the current player from the array
    this.players.splice(this.currentPlayer, 1);

    this.logger?.RemainingPlayers?.(this.players);

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

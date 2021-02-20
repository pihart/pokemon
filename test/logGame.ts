import { createPlayer, PlaybackRandom } from "../script";
import TestingLogger from "./logger";
import { Game, Player, Players, Team } from "../lib";
import { NonEmptyArray } from "@mehra/ts";

export const getLogFromRandoms = (randoms: number[]) => {
  const random = PlaybackRandom(randoms);

  const logger = new TestingLogger();

  const A = new Team(
    [Players.Weedle].map(createPlayer(true, random, logger)) as NonEmptyArray<
      Player
    >,
    random,
    logger
  );
  const B = new Team(
    [
      Players.Gengar1,
      Players.Golbat,
      Players.Haunter,
      Players.Arbok,
      Players.Gengar2,
    ].map(createPlayer(false, random, logger)) as NonEmptyArray<Player>,
    random,
    logger
  );

  new Game(A, B, random, logger).play();

  return logger.log;
};

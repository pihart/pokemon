// can easily be optimized but this is used only for a few iterations
import { NonEmptyArray } from "@mehra/ts";
import * as fs from "fs";
import { Game, Player, Players, Team } from "../lib";
import { createPlayer, PlaybackRandom } from "../script";
import TestingLogger from "./logger";
import { seekFiles } from "./seekFiles";

for (const { randoms: randomsFile, log: logFile } of seekFiles()) {
  const randoms = JSON.parse(fs.readFileSync(randomsFile).toString());
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

  fs.writeFileSync(logFile, JSON.stringify(logger.log));
}

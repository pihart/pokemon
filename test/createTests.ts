// can easily be optimized but this is used only for a few iterations
import { NonEmptyArray } from "@mehra/ts";
import * as fs from "fs";
import * as path from "path";
import { Game, Player, Players, Team } from "../lib";
import { createPlayer, PlaybackRandom } from "../script";
import TestingLogger from "./logger";

const dirs = ["pass", "fail"].map((value) => path.join(__dirname, value));

for (const dir of dirs) {
  const files = fs
    .readdirSync(dir)
    .filter((filePath) => filePath.endsWith(".rands.json"))
    .map((filePath) => path.join(dir, filePath));
  for (const file of files) {
    const randoms = JSON.parse(fs.readFileSync(file).toString());
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

    fs.writeFileSync(
      file.replace(/\.rands\.json$/, ".log.json"),
      JSON.stringify(logger.log)
    );
  }
}

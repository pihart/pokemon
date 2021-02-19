import { DescriptiveLogger } from "./dist/lib";

const path = require("path");

const { Team, Game } = require(".");
const {
  createLoggedPlayer,
  PlaybackRandom,
  prefixedLog,
} = require("./dist/script");

const parseOptions = () => {
  let [, , filePath = "./test/fail/1.json"] = process.argv;

  console.log("Given options", {
    filePath,
  });

  filePath = path.resolve(filePath);

  console.log("Using options", {
    filePath,
  });

  return {
    filePath,
  };
};

const { filePath } = parseOptions();

const random = PlaybackRandom(require(filePath));

const A = new Team(
  ["Weedle"].map(createLoggedPlayer(true, random)),
  random,
  prefixedLog("Team A:")
);
const B = new Team(
  ["Gengar1", "Golbat", "Haunter", "Arbok", "Gengar2"].map(
    createLoggedPlayer(false, random)
  ),
  random,
  prefixedLog("Team B:")
);

new Game(
  A,
  B,
  random,
  new DescriptiveLogger(prefixedLog("Game manager:"))
).play();

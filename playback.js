const path = require("path");

const { Team, Players, Game } = require(".");

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

const prefixedLog = (...prefix) => (...data) => console.log(...prefix, ...data);

/**
 * Instantiate player
 */
const createPlayer = (isHuman, random) => (playerConstructor) =>
  new playerConstructor(
    isHuman,
    random,
    prefixedLog(`${playerConstructor.name}:`)
  );

const randoms = require(filePath);
let i = 0;
const random = () => randoms[i++];

const A = new Team(
  [Players.Weedle].map(createPlayer(true, random)),
  random,
  prefixedLog("Team A:")
);
const B = new Team(
  [
    Players.Gengar1,
    Players.Golbat,
    Players.Haunter,
    Players.Arbok,
    Players.Gengar2,
  ].map(createPlayer(false, random)),
  random,
  prefixedLog("Team B:")
);

new Game(A, B, random, prefixedLog("Game manager:")).play();

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

/**
 * Instantiate player
 */
const createPlayer = (isHuman, random) => (playerConstructor) =>
  new playerConstructor(isHuman, random, (...data) => {
    console.log(`${playerConstructor.name}:`, ...data);
  });

const randoms = require(filePath);
let i = 0;
const random = () => randoms[i++];

const A = new Team([Players.Weedle].map(createPlayer(true, random)), random);
const B = new Team(
  [
    Players.Gengar1,
    Players.Golbat,
    Players.Haunter,
    Players.Arbok,
    Players.Gengar2,
  ].map(createPlayer(false, random)),
  random
);

console.log("Winner is", new Game(A, B, random).play() ? "Team A" : "Team B");

const { appendFileSync } = require("fs");

const { Team, Player, Players, Game } = require(".");

const [
  ,
  ,
  maxNumIterations = 1000,
  progressInterval = Math.floor(maxNumIterations / 100),
  continueOnSuccess = false,
  divideProgressLogByInterval = false,
] = process.argv;

console.log("Using options", {
  maxNumIterations,
  progressInterval,
  continueOnSuccess,
  divideProgressLogByInterval,
});

console.time();
for (let i = 0; i < maxNumIterations; i++) {
  const randomLog = [];
  const random = () => {
    const rand = Math.random();
    randomLog.push(rand);
    return rand;
  };

  /**
   * Instantiate player given options
   * @param {boolean} isHuman
   * @return {function(PlayerOptions): Player}
   */
  const createPlayer = (isHuman) => (options) =>
    new Player(options, isHuman, random);

  if (i % progressInterval === 0)
    console.timeLog(
      undefined,
      divideProgressLogByInterval ? i / progressInterval : i
    );
  const A = new Team([Players.Weedle].map(createPlayer(true)), random);
  const B = new Team(
    [
      Players.Gengar1,
      Players.Golbat,
      Players.Haunter,
      Players.Arbok,
      Players.Gengar2,
    ].map(createPlayer(false)),
    random
  );

  if (new Game(A, B, random).play()) {
    console.timeLog(undefined, "success", i, randomLog);
    appendFileSync(
      "avi.log",
      `${new Date().toISOString()} success: ${i} randoms: ${JSON.stringify(
        randomLog
      )}\n`
    );
    if (!continueOnSuccess) break;
  }
}
console.timeEnd();

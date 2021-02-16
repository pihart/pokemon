const { appendFileSync } = require("fs");

const { Team, Player, Players, Game } = require(".");

const [
  ,
  ,
  maxNumIters = 1000,
  progressInterval = Math.floor(maxNumIters / 100),
  continueOnSuccess = false,
  divideProgressLogByInterval = false,
] = process.argv;

console.log("Using options", {
  maxNumIters,
  progressInterval,
  continueOnSuccess,
});

console.time();
for (let i = 0; i < maxNumIters; i++) {
  const randomLog = [];
  const random = () => {
    const rand = Math.random();
    randomLog.push(rand);
    return rand;
  };

  /**
   * @param {PlayerOptions} options
   */
  const createPlayer = (options) => new Player(options, true, random);

  if (i % progressInterval === 0)
    console.timeLog(
      undefined,
      divideProgressLogByInterval ? i / progressInterval : i
    );
  const A = new Team([Players.Weedle].map(createPlayer), random);
  const B = new Team(
    [
      Players.Gengar1,
      Players.Golbat,
      Players.Haunter,
      Players.Arbok,
      Players.Gengar2,
    ].map(createPlayer),
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

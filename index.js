const { Team, Player, Players, Game } = require(".");

const [
  ,
  ,
  maxNumIters = 1000,
  progressInterval = Math.floor(maxNumIters / 100),
  continueOnSuccess = false,
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

  if (i % progressInterval === 0) console.log(i);
  const A = new Team([new Player(Players.Weedle, true, random)], random);
  const B = new Team(
    [
      new Player(Players.Gengar1, false, random),
      new Player(Players.Golbat, false, random),
      new Player(Players.Haunter, false, random),
      new Player(Players.Arbok, false, random),
      new Player(Players.Gengar2, false, random),
    ],
    random
  );

  if (new Game(A, B, random).play()) {
    console.log("success", i, randomLog);
    require("fs").appendFileSync(
      "avi.log",
      `${new Date().toISOString()} success: ${i} randoms: ${JSON.stringify(
        randomLog
      )}\n`
    );
    if (!continueOnSuccess) break;
  }
}
console.timeEnd();

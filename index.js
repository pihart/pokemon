const { CustomError } = require("@mehra/ts");
const { appendFileSync } = require("fs");

const { Team, Players, Game } = require(".");
const { createPlayer, RecordedRandom } = require("./dist/script");

const parseOptions = () => {
  let [
    ,
    ,
    maxNumIterations = 1000,
    progressInterval = Math.floor(+maxNumIterations / 100),
    continueOnSuccess = false,
    divideProgressLogByInterval = false,
  ] = process.argv;

  console.log("Given options", {
    maxNumIterations,
    progressInterval,
    continueOnSuccess,
    divideProgressLogByInterval,
  });

  maxNumIterations = +maxNumIterations;
  progressInterval = +progressInterval;
  continueOnSuccess = !!continueOnSuccess;
  divideProgressLogByInterval = !!divideProgressLogByInterval;

  console.log("Using options", {
    maxNumIterations,
    progressInterval,
    continueOnSuccess,
    divideProgressLogByInterval,
  });

  return {
    maxNumIterations,
    progressInterval,
    continueOnSuccess,
    divideProgressLogByInterval,
  };
};

const {
  maxNumIterations,
  progressInterval,
  continueOnSuccess,
  divideProgressLogByInterval,
} = parseOptions();

class NotCallableError extends CustomError {}

const APlayers = [Players.Weedle].map(
  createPlayer(true, () => {
    throw new NotCallableError();
  })
);

const BPlayers = [
  Players.Gengar1,
  Players.Golbat,
  Players.Haunter,
  Players.Arbok,
  Players.Gengar2,
].map(
  createPlayer(false, () => {
    throw new NotCallableError();
  })
);

const recordedRandom = RecordedRandom();
const random = recordedRandom.random;

console.time();
for (let i = 0; i < maxNumIterations; i++) {
  recordedRandom.reset();

  if (i % progressInterval === 0)
    console.timeLog(
      undefined,
      divideProgressLogByInterval ? i / progressInterval : i
    );

  APlayers.forEach((player) => player.reset(random));
  BPlayers.forEach((player) => player.reset(random));
  const A = new Team([...APlayers], random);
  const B = new Team([...BPlayers], random);

  if (new Game(A, B, random).play()) {
    console.timeLog(undefined, "success", i, recordedRandom.getLog());
    appendFileSync(
      "avi.log",
      `${new Date().toISOString()} success: ${i} randoms: ${JSON.stringify(
        recordedRandom.getLog()
      )}\n`
    );
    if (!continueOnSuccess) break;
  }
}
console.timeEnd();

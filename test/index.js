const path = require("path");
const { readFile: oldReadFile } = require("fs");
const { promisify } = require("util");
const { exec: oldExec } = require("child_process");
const { Assert } = require("@mehra/ts");

const exec = promisify(oldExec);
const readFile = promisify(oldReadFile);

const tests = [{ randoms: "./fail/1.json", playback: "./fail/1.txt" }];

for (let { randoms, playback } of tests) {
  const runPromise = exec(`npm run playback ${path.join(__dirname, randoms)}`);
  const readPromise = readFile(path.join(__dirname, playback));

  Promise.all([runPromise, readPromise]).then(([result, file]) =>
    Assert(result.stdout.endsWith(file))
  );
}

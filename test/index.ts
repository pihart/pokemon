import * as fs from "fs";
import { seekFiles } from "./seekFiles";
import { getLogFromRandoms } from "./logGame";
import assert = require("assert");

for (const { randoms: randomsFile, log: logFile } of seekFiles()) {
  const randoms = JSON.parse(fs.readFileSync(randomsFile).toString());
  const log = JSON.parse(fs.readFileSync(logFile).toString());

  assert.deepStrictEqual(
    log,
    JSON.parse(JSON.stringify(getLogFromRandoms(randoms)))
  );
}

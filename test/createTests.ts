import * as fs from "fs";
import { seekFiles } from "./seekFiles";
import { getLogFromRandoms } from "./logGame";

for (const { randoms: randomsFile, log: logFile } of seekFiles()) {
  const randoms = JSON.parse(fs.readFileSync(randomsFile).toString());

  fs.writeFileSync(logFile, JSON.stringify(getLogFromRandoms(randoms)));
}

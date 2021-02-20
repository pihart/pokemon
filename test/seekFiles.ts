import * as fs from "fs";
import * as path from "path";

const dirs = ["pass", "fail"].map((value) => path.join(__dirname, value));

export const seekFiles = () =>
  dirs
    .map((dir) => {
      const files = fs
        .readdirSync(dir)
        .filter((filePath) => filePath.endsWith(".rands.json"))
        .map((filePath) => path.join(dir, filePath));

      return files.map((file) => ({
        randoms: file,
        log: file.replace(/\.rands\.json$/, ".log.json"),
      }));
    })
    // flatMap doesn't exist
    .reduce((arr1, arr2) => [...arr1, ...arr2]);

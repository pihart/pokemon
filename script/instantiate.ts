import { DescriptiveLogger, PlayerLogger } from "../lib/logger";
import Player, { PlayerOptions } from "../lib/player";
import * as Players from "../lib/players";
import { prefixedLog } from "./log";

export const createPlayer = (
  isHuman: boolean,
  random: () => number,
  logger?: Partial<PlayerLogger>
) => (options: PlayerOptions) => new Player(options, isHuman, random, logger);

export const createLoggedPlayer = (isHuman: boolean, random: () => number) => (
  name: keyof typeof Players
) =>
  new Player(
    Players[name],
    isHuman,
    random,
    new DescriptiveLogger(prefixedLog(`${name}:`))
  );

import Player, { PlayerOptions } from "../lib/player";
import * as Players from "../lib/players";
import { prefixedLog } from "./log";

export const createPlayer = (
  isHuman: boolean,
  random: () => number,
  log?: (...data: any[]) => void
) => (options: PlayerOptions) => new Player(options, isHuman, random, log);

export const createLoggedPlayer = (isHuman: boolean, random: () => number) => (
  name: keyof typeof Players
) => new Player(Players[name], isHuman, random, prefixedLog(`${name}:`));

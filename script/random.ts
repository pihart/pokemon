export const RecordedRandom = () => {
  let randomLog: number[] = [];
  return {
    getLog: () => randomLog,

    random: () => {
      const rand = Math.random();
      randomLog.push(rand);
      return rand;
    },

    reset: () => {
      randomLog = [];
    },
  };
};

export const PlaybackRandom = (randoms: ReadonlyArray<number> | number[]) => {
  let i = 0;
  return () => randoms[i++];
};

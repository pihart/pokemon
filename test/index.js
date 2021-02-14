const { Player, Players, Team, Game } = require("..");
const { Assert } = require("@mehra/ts");

for (let file of ["./success/1.json"]) {
  const rands = require(file);
  let i = 0;
  function random() {
    return rands[i++];
  }

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

  Assert(new Game(A, B, random).play());
}

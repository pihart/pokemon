const { Team, Player, Players, Game } = require(".");

console.time();
for (let i = 0; i < 1e7; i++) {
  if (i % 1e5 === 0) console.log(i);
  const A = new Team([new Player(Players.Weedle, true)]);
  const B = new Team([
    new Player(Players.Gengar1, false),
    new Player(Players.Golbat, false),
    new Player(Players.Haunter, false),
    new Player(Players.Arbok, false),
    new Player(Players.Gengar2, false),
  ]);

  if (new Game(A, B).play()) {
    console.log("success", i);
    break;
  }
}
console.timeEnd();

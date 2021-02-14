const { Team, Player, Players, Game } = require(".");

console.time();
const A = new Team([new Player(Players.Weedle, true)]);
const B = new Team([
  new Player(Players.Gengar1, false),
  new Player(Players.Golbat, false),
  new Player(Players.Haunter, false),
  new Player(Players.Arbok, false),
  new Player(Players.Gengar2, false),
]);

console.log(new Game(A, B).play());
console.timeEnd();

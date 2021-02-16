# pokemon

I still don't know what this does.

Simulates something to do with pokemon.

## Library

`lib/` should have implemented most rules.

To create a player:

```js
const Weedle = new Player(
  Players.Weedle, // The configuration for the player
  // Presets are exported from players.ts.
  true, // Whether the player is human;
  // applies different rules
  Math.random // The function to generate random numbers
  // You can build a closure to log or playback random numbers
);
```

To create a team:

```js
const A = new Team(
  [Weedle], // An array of instantiated Players on the team
  Math.random // The function to generate random numbers
);
```

To create a game:

```js
const game = new Game(
  A, // One of the teams
  B, // The other team
  random // The function to generate random numbers
);
```

To play a round (one turn for each player) of the game:

```js
// If there is a winner, returns a boolean indicating whether team A (from constructor) is the winner.
// Otherwise, returns undefined.
game.playRound();
```

To finish the game until one team wins:

```js
// Returns a boolean indicating whether team A (from constructor) is the winner.
game.play();
```

## `index.js`

Simulates a game that is supposedly important?
Very unlikely for team A to win this game.

### Teams

Simulates a game with these teams:

```js
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
```

### Usage

#### Setup

Once per update, you must run

```shell
npm i
```

#### Run

```shell
npm start <maxNumIterations = 1000> <progressCheckInterval = floor(maxNumIterations / 100)> <continueOnSuccess = false> <divideProgressLogByInterval = false>
```

This will run up to `maxNumIterations` simulations, halting earlier if and only if team `A` wins and `!continueOnSuccess`.

It will log the elapsed time and current iteration (divided by `progressCheckInterval` if `divideProgressLogByInterval`) before every `progressCheckInterval` number of iterations;
you can set `progressCheckInterval = 0` to not have this happen, or to some sufficiently large number to have it occur only at step `0`.

On success (team `A`'s win), it will log _and_ append a record to the end of the file `avi.log` (or create it if it does not exist).
This log will include the current (**not elapsed**) time, the iteration at which the success occurred, and the entire sequence of random numbers in that simulation.
This is sufficient information to replay the game without loss.

**Note:**
`continueOnSuccess` and `divideProgressLogByInterval` check for JavaScript truthiness.
In particular, if `"false"` is entered in the command line, it will be treated as `true`!

##### Speed

Expect running time of around `11µs` per iteration.

##### Production config for bashing

When bashing out simulations, I generally use

```shell
npm start 1e12 1e6 true true > run.log &
```

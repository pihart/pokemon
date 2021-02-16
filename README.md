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

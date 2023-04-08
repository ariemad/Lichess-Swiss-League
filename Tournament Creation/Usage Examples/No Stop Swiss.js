const LichessEvent = require("../LichessEvent/LichessEvent");

let myEvent = new LichessEvent("chess-swiss-league", {
  repeat: true,
  numberTournaments: Infinity,
  creationTime: "2023-01-01T00:00:00.000Z",
});

let settings = {
  name: "No Stop Swiss #1#",
  clock: {
    limit: 300,
    increment: 3,
  },
  nbRounds: 5,
  startsAt: null,
  roundInterval: null,
  variant: "standard",
  description: `Welcome to "No Stop Swiss #1#"

Last Tournament Winners were:
#podium#

We invite you to join "No Stop Swiss #2#" that will start immediately after.

Number of rounds varies with the number of players.
    `,
  rated: true,
  password: null,
  forbiddenPairings: null,
  manualPairings: null,
  chatFor: 30,
  conditions: {
    minRating: { rating: null },
    maxRating: { rating: null },
    nbRatedGame: { nb: null },
    allowList: null,
  },
};

myEvent.addTournamentSettings(settings);

myEvent.start();

console.log();

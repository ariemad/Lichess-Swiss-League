const LichessEvent = require("../LichessEvent/LichessEvent");

let eventsSettings = {
  numberTournaments: Infinity,
  creationTime: "2023-01-01T00:00:00.000Z",
};

let tournamentSettings = {
  name: "No Stop Swiss #1#",
  clock: {
    limit: 300,
    increment: 3,
  },
  nbRounds: 4,
  startsAt: null,
  roundInterval: null,
  variant: "standard",
  description: `Welcome to "No Stop Swiss #1#"
  
  Last Tournament Winners were:
  #podium#

We invite you to join "No Stop Swiss #2#" that will start immediately after.

Minimum players to start:
6

Number of rounds:
According to number of players.
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

let myEvent = new LichessEvent("chess-swiss-league", eventsSettings);

myEvent.addTournamentSettings(tournamentSettings);

myEvent.start();

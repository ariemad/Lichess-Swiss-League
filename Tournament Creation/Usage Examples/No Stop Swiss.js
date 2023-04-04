const LichessEvent = require("../Event/LichessEvent");

let myEvent = new LichessEvent("chess-swiss-league", {
  repeat: true,
  numberTournaments: Infinity,
  creationTime: "2023-01-01T00:00:00.000Z",
  startingTime: process.env.startTime,
  numberOffset: 1,
});

let settings = {
  name: "No Stop Swiss ###",
  clock: {
    limit: 180,
    increment: 2,
  },
  nbRounds: 3,
  startsAt: null,
  roundInterval: null,
  variant: "standard",
  description: null,
  rated: false,
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

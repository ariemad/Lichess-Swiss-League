const LichessEvent = require("../Event/LichessEvent");

let myEvent = new LichessEvent("chess-swiss-league", {
  repeat: true,
  numberTournaments: Infinity,
  creationTime: "2023-04-01T23:52:00.000Z",
  startingTime: "2023-04-01T23:53:00.000Z",
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

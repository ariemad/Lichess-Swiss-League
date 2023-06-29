const LichessEvent = require("../LichessEvent/LichessEvent");

let eventsSettings = {
  repeat: false,
  creationTime: "2023-01-01T00:00:00.000Z",
};

let tournamentSettings = {
  name: "My Event",
  clock: {
    limit: 300,
    increment: 3,
  },
  nbRounds: 4,
  startsAt: "2023-01-02T00:00:00.000Z",
  roundInterval: null,
  variant: "standard",
  description: `This is the description of my event`,
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

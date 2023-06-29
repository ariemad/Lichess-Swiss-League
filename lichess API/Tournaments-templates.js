let eventDefault = {
  repeat: false,
  creationTime: "2023-01-01T00:00:00.000Z",
  tournamentInterval: 300000,
};

let tournamentDefault = {
  name: null,
  clock: {
    limit: 180,
    increment: 2,
  },
  nbRounds: 5,
  startsAt: null,
  roundInterval: null,
  variant: "standard",
  description: null,
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

module.exports = { tournamentDefault, eventDefault };

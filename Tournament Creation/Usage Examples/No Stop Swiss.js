const LichessEvent = require("../Event/LichessEvent");

let myEvent = new LichessEvent("chess-swiss-league", {
  repeat: true,
  numberTournaments: Infinity,
});

myEvent.addTournamentSettings(
  "blitz",
  {
    name: "Chess Swiss League",
    startsAt: "2023-04-01T21:55:00.000Z",
    nbRounds: 2,
  },
  {
    creationTime: "2023-04-01T21:45:00.000Z",
  }
);

myEvent.start();

console.log();

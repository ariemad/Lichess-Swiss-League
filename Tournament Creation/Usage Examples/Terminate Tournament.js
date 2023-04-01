const Tournament = require("../lichess API/Tournament");

let myTournament = new Tournament("chess-swiss-league");

myTournament.updateAPIOptions({
  id: "ueiBsMIj",
});
myTournament.read();

// myTournament.terminate();

const Tournament = require("../lichess API/Tournament");

require("dotenv").config();

let myTournament = new Tournament("chess-swiss-league");
myTournament.updateAPIOptions({
  id: "n828wsKD",
  clock: { limit: 180, increment: 2 },
  nbRounds: 7,
  nextRound: { at: "2023-03-28T18:00:00.000Z" },
});
myTournament.start();

const now = new Date();
const isoString = now.toISOString();
console.log(isoString);

// const getInfo = async (arg) => {
//   const options = {
//     headers: {
//       Authorization: "Bearer " + process.env.lichessToken,
//       "Content-Type": "application/json",
//     },
//     method: "GET",
//   };
//   return await fetch(`https://lichess.org/api/swiss/n828wsKD`, options).then(
//     (res) => res.json()
//   );
// };

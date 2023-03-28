// const Tournament = require("../lichess API/Tournament");

// require("dotenv").config();

// let myTournament = new Tournament("chess-swiss-league");
// myTournament.updateAPIOptions({
//   roundInterval: 604800,
// });
// myTournament.start();

require("dotenv").config();

const getInfo = async (arg) => {
  const options = {
    headers: {
      Authorization: "Bearer " + process.env.lichessToken,
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  return await fetch(`https://lichess.org/api/swiss/n828wsKD`, options).then(
    (res) => res.json()
  );
};

let round = 0;
setInterval(async () => {
  let data = await getInfo();
  console.log(data);
  if (data.round > 0 && nbOngoing == 0) {
    round = data.round;
    console.log(`Round ${round}`);
  }
}, 30000);

require("dotenv").config();

const getInfo = async (arg) => {
  const options = {
    headers: {
      Authorization: "Bearer " + process.env.lichessToken,
      "Content-Type": "application/json",
    },
    method: "GET",
  };
  return await fetch(`https://lichess.org/api/swiss/yT4ISoMZ`, options).then(
    (res) => res.json()
  );
};

let round = 0;
setInterval(async () => {
  let data = await getInfo();
  console.log(data);
  if (data.round != round) {
    round = data.round;
    console.log(`Round ${round}`);
  }
}, 30000);

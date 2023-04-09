function waitUntil(time) {
  let futureTime = new Date(time);
  let currentTime = new Date().getTime();

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), futureTime - currentTime);
  });
}

function waitFor(time) {
  let waitTime = new Date(time);

  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(), waitTime);
  });
}

function waitStatus(id, status, cb) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "GET",
    };
    let intervalID = setInterval(() => {
      console.log(`https://lichess.org/api/swiss/${id}`);

      fetch(`https://lichess.org/api/swiss/${id}`, options)
        .then((res) => res.json())
        .then((data) => {
          if (cb) {
            cb();
          }
          if (data.status == status) {
            resolve();
            clearInterval(intervalID);
          }
        });
    }, 30000);
  });
}

function continuousCheckEnd(id, cb) {
  setInterval(() => {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "GET",
    };
    fetch(`https://lichess.org/api/swiss/${id}`, options)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status == "finished") {
          cb();
        }
      });
  }, 30000);
}

function parsePodium(winners) {
  let string = "";
  for (let i = 0; i < 3; i++) {
    if (winners[i]) {
      string += `${i + 1} - lichess.org/@/${winners[i].username} \n`;
    }
  }

  return string;
}

module.exports = {
  waitUntil,
  waitFor,
  waitStatus,
  continuousCheckEnd,
  parsePodium,
};

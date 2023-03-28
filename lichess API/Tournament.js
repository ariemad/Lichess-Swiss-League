const defaults = require("./Tournaments-defaults");

class Tournament {
  constructor(
    teamID,
    tournamentOptions = {
      type: "Blitz_3+2",
      roundStarts: { type: "default", schedule: [] },
    }
  ) {
    this.teamID = teamID;

    this.tournamentOptions = tournamentOptions;

    this.APIoptions = {};
    this.updateAPIOptions(defaults[this.tournamentOptions.type]);
  }

  updateAPIOptions(object) {
    const recursive = (object) => {
      let temp = {};
      for (const key of Object.keys(object)) {
        if (object[key] != null && typeof object[key] == "object") {
          temp[key] = recursive(object[key]);
        } else {
          temp[key] = object[key];
        }
      }

      return temp;
    };

    this.APIoptions = { ...this.APIoptions, ...recursive(object) };
    return this.APIoptions;
  }

  start() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.APIoptions),
    };

    //CREATE
    if (!this.APIoptions.id) {
      fetch(`https://lichess.org/api/swiss/new/${this.teamID}`, options)
        .then((res) => res.json())
        .then((data) => this.updateAPIOptions(data))
        .then(console.log);

      let round = 0;
      setInterval(async () => {
        let data = await this.getInfo();
        console.log(data);
        if (data.round != round) {
          round = data.round;
          console.log(`Round ${round}`);
        }
      }, 30000);

      //UPDATE
    } else {
      console.log("Update");

      fetch(`https://lichess.org/api/swiss/${this.APIoptions.id}/edit`, options)
        .then((res) => res.json())
        .then((data) => this.updateAPIOptions(data))
        .then(console.log);
    }
  }

  async getInfo() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
      },
      method: "GET",
    };
    return await fetch(
      `https://lichess.org/api/swiss/${this.APIoptions.id}`,
      options
    )
      .then((res) => res.json())
      .then(console.log);
  }

  terminate() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
      },
      method: "POST",
    };

    fetch(
      `https://lichess.org/api/swiss/${this.APIoptions.id}/terminate`,
      options
    )
      .then((res) => res.json())
      .then(console.log);
  }
}

module.exports = Tournament;

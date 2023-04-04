const tournamentDefault = require("./Tournaments-templates");

require("dotenv").config();

/*

How to start a new tournament?

let myTournament = new Tournament("chess-swiss-league")

myTournament.updateOptions({
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
})

myTournament.start()


How to update an existing tournament?

let myTournament = new Tournament()

myTournament.APIoptions = myTournament.getInfo('SomeTournamentID')

myTournament.updateAPIOptions({ ...})

myTournament.update()

*/

class Tournament {
  constructor(teamID, API_Options = {}) {
    this.teamID = teamID;
    this.API_Options = {};
    this.updateAPIOptions(tournamentDefault);
    this.updateAPIOptions(API_Options);
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

    this.API_Options = { ...this.API_Options, ...recursive(object) };
    return this.API_Options;
  }

  start() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.API_Options),
    };

    return new Promise((resolve, reject) => {
      fetch(`https://lichess.org/api/swiss/new/${this.teamID}`, options)
        .then((res) => res.json())
        .then((data) => this.updateAPIOptions(data))
        .then(console.log)
        .then(resolve);
    });
  }

  update() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.API_Options),
    };

    return new Promise((resolve, reject) => {
      fetch(
        `https://lichess.org/api/swiss/${this.API_Options.id}/edit`,
        options
      )
        .then((res) => res.json())
        .then((data) => this.updateAPIOptions(data))
        .then(console.log)
        .then(resolve);
    });
  }

  read(id = this.API_Options.id) {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "GET",
    };

    fetch(`https://lichess.org/api/swiss/${id}`, options)
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
      `https://lichess.org/api/swiss/${this.API_Options.id}/terminate`,
      options
    )
      .then((res) => res.json())
      .then(console.log);
  }
}

module.exports = Tournament;

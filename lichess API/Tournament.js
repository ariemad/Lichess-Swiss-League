const defaults = require("./Tournaments-defaults");

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

    fetch(`https://lichess.org/api/swiss/new/${this.teamID}`, options)
      .then((res) => res.json())
      .then((data) => this.updateAPIOptions(data))
      .then(console.log);
  }

  update() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(this.APIoptions),
    };

    fetch(`https://lichess.org/api/swiss/${this.APIoptions.id}/edit`, options)
      .then((res) => res.json())
      .then((data) => this.updateAPIOptions(data))
      .then(console.log);
  }

  read() {
    const options = {
      headers: {
        Authorization: "Bearer " + process.env.lichessToken,
        "Content-Type": "application/json",
      },
      method: "GET",
    };

    fetch(`https://lichess.org/api/swiss/${this.APIoptions.id}`, options)
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

const { logger } = require("../logger/logger");
const tournamentDefault = require("./Tournaments-templates");

require("dotenv").config();

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
        .then((data) => {
          logger.log({
            level: "info",
            message: data,
            action: "Create Tournament",
          });
          return data;
        })
        .then((data) => {
          this.updateAPIOptions(data);
          resolve();
        });
    });
  }

  update(object) {
    if (object) {
      this.updateAPIOptions(object);
    }
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
        .then((data) => {
          logger.log({
            level: "info",
            message: data,
            action: "Update Tournament",
          });
          return data;
        })
        .then((data) => {
          this.updateAPIOptions(data);
          resolve();
        });
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
      .then((data) => {
        logger.log({
          level: "info",
          message: data,
          action: "Read Tournament",
        });
        return data;
      })
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
      .then((data) => {
        logger.log({
          level: "info",
          message: data,
          action: "Terminate Tournament",
        });
        return data;
      })
      .then(console.log);
  }

  last() {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          Authorization: "Bearer " + process.env.lichessToken,
        },
        method: "GET",
      };

      fetch(`https://lichess.org/api/team/${this.teamID}/swiss?max=1`, options)
        .then((res) => res.json())
        .then((data) => {
          logger.log({
            level: "info",
            message: data,
            action: "Last Tournament",
          });
          return data;
        })
        .then((data) => {
          this.updateAPIOptions(data);
          resolve();
        });
    });
  }

  results(id = this.API_Options.id, n = 1) {
    return new Promise((resolve, reject) => {
      const options = {
        headers: {
          Authorization: "Bearer " + process.env.lichessToken,
          "Content-Type": "application/x-ndjson",
        },
        method: "GET",
      };
      const url = new URL(`https://lichess.org/api/swiss/${id}/results`);
      url.searchParams.append("nb", n);

      fetch(url.href, options)
        .then((res) => res.text())
        .then((data) =>
          data
            .split("\n")
            .slice(0, -1)
            .map((element) => JSON.parse(element))
        )
        .then(resolve);
    });
  }
}

module.exports = Tournament;

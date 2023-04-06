const { log } = require("debug/src/node");
const Tournament = require("../lichess API/Tournament");
const {
  waitUntil,
  waitTournamentEnd,
  waitFor,
  continuousCheckEnd,
  waitStatus,
} = require("./auxiliaryFunctions");
require("dotenv").config();

class LichessEvent {
  constructor(teamID, eventOptions = {}) {
    this.teamID = teamID;
    this.eventProperties = {
      numberSettings: 0,
      tournamentCount: 0,
    };
    this.eventOptions = {
      repeat: false,
      tournamentInterval: 300000, //5minutes,
      creationTime: "2000-01-01T00:00.000Z",
      ...eventOptions,
    };
    this.tournamentsSettings = [];
  }

  addTournamentSettings(API_Options) {
    this.tournamentsSettings.push(API_Options);
    this.eventProperties.numberSettings++;
  }

  addTournament(i) {
    this.tournaments.push(
      new Tournament(
        this.teamID,
        this.tournamentsSettings[i % this.eventProperties.numberSettings]
      )
    );
  }

  async start() {
    await waitUntil(this.eventOptions.creationTime);

    if (this.eventOptions.repeat) {
      this.repeat();
    }
  }

  repeat() {
    this.updateEvent();
    setInterval(() => this.updateEvent(), 30000);
  }

  async updateEvent() {
    let currentTournament = new Tournament(this.teamID);
    await currentTournament.last();

    // Wait 1s to avoid request spam
    await waitFor(1000);
    console.log(`
    ${new Date().toISOString()}
    Updating Event
    `);

    if (currentTournament.API_Options.status == "finished") {
      let newTournament = new Tournament(
        this.teamID,
        this.tournamentsSettings[
          this.eventProperties.tournamentCount %
            this.eventProperties.numberSettings
        ]
      );

      let lastNumber = Number(
        currentTournament.API_Options.name.split(" ").at(-1)
      );

      newTournament.updateAPIOptions({
        startsAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(), // 5 minutes
        name: newTournament.API_Options.name.replace("###", lastNumber + 1),
      });

      newTournament.start();
      this.eventProperties.tournamentCount++;
      //
      //
    } else if (currentTournament.API_Options.status == "created") {
      if (currentTournament.API_Options.nextRound.in < 60) {
        //1 minute before tournament starts
        if (currentTournament.API_Options.nbPlayers < 2) {
          currentTournament.update({
            startsAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          });
        } else {
          let newRound = Math.max(
            3,
            Math.ceil(Math.sqrt(currentTournament.API_Options.nbPlayers) + 1)
          );
          if (currentTournament.API_Options.round != newRound) {
            currentTournament.update({
              nbRounds: newRound,
            });
          }
        }
      }
    }
  }
}

module.exports = LichessEvent;

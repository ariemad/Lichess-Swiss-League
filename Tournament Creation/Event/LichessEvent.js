//Tournaments types:

const { log } = require("debug/src/node");
const Tournament = require("../lichess API/Tournament");
const {
  waitUntil,
  waitTournamentEnd,
  waitFor,
  continuousCheckEnd,
  waitStatus,
} = require("./AuxiliaryFunctions");
require("dotenv").config();

class LichessEvent {
  constructor(teamID, eventOptions = {}) {
    this.teamID = teamID;
    this.eventProperties = {
      numberSettings: 0,
    };
    this.eventOptions = {
      repeat: false,
      tournamentInterval: 300000, //5minutes
      numberTournaments: Infinity,
      ...eventOptions,
    };
    this.tournamentsSettings = [];
    this.tournaments = [];
  }

  addTournamentSettings(type, API_Options, OtherOptions) {
    this.tournamentsSettings.push({
      type,
      API_Options,
      OtherOptions,
    });
    this.eventProperties.numberSettings++;
  }

  addTournament(i) {
    this.tournaments.push(
      new Tournament(
        this.teamID,
        this.tournamentsSettings[i % this.eventProperties.numberSettings].type,
        this.tournamentsSettings[
          i % this.eventProperties.numberSettings
        ].APIoptions,
        this.tournamentsSettings[
          i % this.eventProperties.numberSettings
        ].OtherOptions
      )
    );
  }

  async start() {
    if (this.eventOptions.repeat) {
      for (let i = 0; i < this.eventOptions.numberTournaments; i++) {
        //Create 2 tournaments first time and 1 next times
        while (this.tournaments.length < i + 2) {
          this.addTournament(i);
        }

        if (i == 0) {
          // Wait to add Announce first tournament to Lichess
          await waitUntil(this.tournaments[i].otherOptions.creationTime);
          await this.tournaments[i].start();
        }

        //When tournament starts. We announce next tournament.

        await waitStatus(this.tournaments[i].API_Options.id, "started");
        await this.tournaments[i + 1].start();

        // Wait for tournament to finish
        await waitStatus(this.tournaments[i].API_Options.id, "finished", () => {
          const now = new Date(); // current time
          const future = new Date(now.getTime() + 5 * 60000); // add 5 minutes (5 * 60 * 1000 ms) to current time
          const futureIsoString = future.toISOString(); // convert to ISO string
          this.tournaments[i + 1].updateAPIOptions({
            startsAt: futureIsoString,
          });
          this.tournaments[i + 1].update();
        });
      }
    }
  }
}

module.exports = LichessEvent;

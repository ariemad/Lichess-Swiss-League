const { log } = require("debug/src/node");
const Tournament = require("../lichess API/Tournament");
const {
  waitUntil,
  waitTournamentEnd,
  waitFor,
  parsePodium,
  roundTime,
} = require("./auxiliaryFunctions");
require("dotenv").config();

class LichessEvent {
  constructor(teamID, eventOptions = {}) {
    this.teamID = teamID;
    this.eventProperties = {
      numberSettings: 0,
      tournamentCount: 0,
      numbering: undefined,
      lastWinners: undefined,
    };
    this.eventOptions = {
      repeat: false,
      numbering: false,
      tournamentInterval: 300000, //Milliseconds,
      creationTime: "2000-01-01T00:00.000Z",
      ...eventOptions,
    };
    this.tournamentsSettings = [];
  }

  addTournamentSettings(API_Options) {
    this.tournamentsSettings.push(API_Options);
    this.eventProperties.numberSettings++;
  }

  addTournament() {
    let newTournament = new Tournament(
      this.teamID,
      this.tournamentsSettings[
        this.eventProperties.tournamentCount %
          this.eventProperties.numberSettings
      ]
    );

    const replacements = {
      "#1#": this.eventProperties.numbering + 1, //Current Tournament
      "#2#": this.eventProperties.numbering + 2, //Next Tournament
      "#podium#": parsePodium(this.eventProperties.lastWinners),
    };

    let replacedName = newTournament.API_Options.name;
    let replacedDescription = newTournament.API_Options.description;

    for (const key in replacements) {
      replacedName = replacedName.replaceAll(key, replacements[key]);
      replacedDescription = replacedDescription.replaceAll(
        key,
        replacements[key]
      );
    }

    let API_Options = {
      startsAt: new Date(
        Date.now() + this.eventOptions.tournamentInterval
      ).toISOString(),
      name: replacedName,
      description: replacedDescription,
    };

    newTournament.updateAPIOptions(API_Options);

    newTournament.start();
    this.eventProperties.tournamentCount++;
  }

  updateTournament() {}

  async start() {
    await waitUntil(this.eventOptions.creationTime);

    if (this.eventOptions.repeat) {
      this.repeatEvent();
    }
  }

  repeatEvent() {
    try {
      this.updateEvent();
      setInterval(() => this.updateEvent(), 30000);
    } catch (error) {
      console.error("Error occurred:", error);
      setTimeout(() => {
        repeatEvent();
      }, 60000);
    }
  }

  updateNumbering(tournament) {
    let numbering = Number(tournament.API_Options.name.split(" ").at(-1));
    if (typeof numbering == "number") {
      this.eventProperties.numbering = numbering;
    }
  }

  async updateLastWinner(tournament) {
    this.eventProperties.lastWinners = await tournament.results(undefined, 3);
  }

  async updateEvent() {
    // Get current tournament of team
    let currentTournament = new Tournament(this.teamID);
    await currentTournament.last();

    // Wait 1s to avoid request spam
    await waitFor(1000);

    if (currentTournament.API_Options.status == "finished") {
      this.updateNumbering(currentTournament);
      await this.updateLastWinner(currentTournament);
      this.addTournament();
      //
    } else if (currentTournament.API_Options.status == "created") {
      if (
        currentTournament.API_Options.nextRound.in < 60 &&
        currentTournament.API_Options.nbPlayers < 4
      ) {
        //1 minute before tournament starts
        currentTournament.update({
          startsAt: roundTime().toISOString(),
        });
      }
      let newRound = Math.max(
        3,
        Math.ceil(Math.sqrt(currentTournament.API_Options.nbPlayers) + 1)
      );
      if (currentTournament.API_Options.nbRounds != newRound) {
        currentTournament.update({
          nbRounds: newRound,
        });
      }
    }
  }
}

module.exports = LichessEvent;

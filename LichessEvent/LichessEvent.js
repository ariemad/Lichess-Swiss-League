const { log } = require("debug/src/node");
const Tournament = require("../lichess API/Tournament");
const {
  waitUntil,
  waitTournamentEnd,
  waitFor,
  parsePodium,
  roundTime,
} = require("../utils/auxiliaryFunctions");
const { eventDefault } = require("../lichess API/Tournaments-templates");
require("dotenv").config();

class LichessEvent {
  constructor(teamID, eventOptions = {}) {
    this.teamID = teamID;

    this.eventOptions = {
      ...eventDefault,
      ...eventOptions,
    };

    this.eventProperties = {
      numberSettings: 0,
      tournamentCount: 0,
      numbering: undefined,
      lastWinners: undefined,
    };

    this.tournamentsSettings = [];
  }

  addTournamentSettings(API_Options) {
    this.tournamentsSettings.push(API_Options);
    this.eventProperties.numberSettings++;
  }

  /**
   * My function description.
   *
   * @param {string} startsAt - The parameter that can have one of the following values:
   *   - 'default': According to tournament settings
   *   - 'now': Starts now.
   *   - 'interval': Starts after the interval defined in eventOptions.
   *   - 'round': Rounds to the next 30 min or 60 min.
   */
  async startTournament(startsAt) {
    //Update event properties
    let lastTournament = new Tournament(this.teamID);
    await lastTournament.last();
    this.updateNumbering(lastTournament);
    await this.updateLastWinner(lastTournament);

    //Defining new tournament
    let newTournament = new Tournament(
      this.teamID,
      this.tournamentsSettings[
        this.eventProperties.tournamentCount %
          this.eventProperties.numberSettings
      ]
    );

    //Update name and description
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

    //Update Starts At
    let replaceStartsAt;
    if (startsAt === "now") {
      replaceStartsAt = new Date(Date.now() + 5000).toISOString();
      //
    } else if (startsAt === "interval") {
      replaceStartsAt = new Date(
        Date.now() + this.eventOptions.tournamentInterval
      ).toISOString();
      //
    } else if (startsAt === "round") {
      replaceStartsAt = roundTime().toISOString();
    }

    let API_Options = {
      name: replacedName,
      description: replacedDescription,
    };
    if (replaceStartsAt) {
      API_Options.startsAt = replaceStartsAt;
    }

    //Update New Tournament

    newTournament.updateAPIOptions(API_Options);

    //Start New Tournament

    newTournament.start();
    this.eventProperties.tournamentCount++;
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

  async start() {
    await waitUntil(this.eventOptions.creationTime);

    if (this.eventOptions.repeat) {
      this.repeatEvent();
    } else {
      this.scheduleEvent();
    }
  }

  //RepeatEvent

  repeatEvent() {
    let intervalID;
    try {
      this.updateRepeatEvent();
      intervalID = setInterval(() => this.updateRepeatEvent(), 30000);
    } catch (error) {
      console.error("Error occurred:", error);
      clearInterval(intervalID);
      setTimeout(() => {
        this.repeatEvent();
      }, 60000);
    }
  }

  async updateRepeatEvent() {
    // Get current tournament of team
    let currentTournament = new Tournament(this.teamID);
    await currentTournament.last();

    // Wait 1s to avoid request spam
    await waitFor(1000);

    if (currentTournament.API_Options.status == "finished") {
      this.startTournament("now");
      //
    } else if (currentTournament.API_Options.status == "created") {
      if (
        currentTournament.API_Options.nextRound.in < 65 &&
        currentTournament.API_Options.nbPlayers < 6
      ) {
        //Delete tournament to remove inactive players
        currentTournament.terminate();
        await waitFor(1000);
        this.startTournament("round");
        //
      } else {
        //Update number of rounds
        let newRound = Math.max(
          4,
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

  //ScheduledEvent

  scheduleEvent() {
    this.startTournament("default");
  }
}

module.exports = LichessEvent;

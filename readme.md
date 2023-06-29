# Swiss League Tournament Creation

<p align="center">
    <a href="https://swissleague.org/">
        <img src="https://raw.githubusercontent.com/ariemad/lichess-swiss-league-website/main/assets/LogoLichess.png"
            height="130">
    </a>
</p>

<p align="center">
    <a href="https://github.com/RichardLitt/standard-readme" alt="Contributors">
        <img src="https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square" /></a>
    <a href="https://discord.gg/tJPSGQG3">
        <img src="https://img.shields.io/discord/1115282892424220754?logo=discord"
            alt="chat on Discord"></a>
</p>

Scripts to automate lichess swiss tournaments.

## Recommendation

- Use the lichess UI for simple cases.
- Familiarize with the 'Create a new Swiss Tournament' API parameters.
- Feel free to contact me if you need assistance.

## Install

```
git clone https://github.com/ariemad/lichess-swiss-league-tournament-creation.git

cd lichess-swiss-league-tournament-creation

npm install
```

## Usage

- Add your lichess token to environment variables.

- Create an Event with the desired settings:

```JS
let myEvent = new LichessEvent("chess-swiss-league", eventsSettings);
```

- Add a Tournament with the desired settings:

```JS
myEvent.addTournamentSettings(tournamentSettings);
```

- Start your event:

```JS
myEvent.start();
```

- Run your script (e.g.):

```
node ScheduleTournament.js
```

## Contributing

PRs accepted.

Please contact me if you wish to contribute.

## License

MIT © Daniel Bray

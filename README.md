# senseibot

senseibot is reactive bot for Slack whose purpose is to help us study Japanese.

## Supported commands

senseibot supports the following commands:

- `senseibot kanji meaning <kanji>`: Returns the kanji's meaning from Jisho;
- `senseibot kanji reading <kanji>`: Returns the kanji's reading from Jisho;
- `senseibot <something>`: He'll echo whatever you say to him.

Notice that senseibot's commands are case sensitive, unless implemented otherwise.

## Feature roadmap

Check the [Issues section](https://github.com/vruzeda/senseibot/issues) for future improvements.

## Technologies

This bot is written in JavaScript to run in NodeJS.

The original version is running in NodeJS v6.3.0.

### Setup

You need to install NodeJS - this is not covered here.

After cloning the project, you need to run `npm install` to get the projects dependencies.

### Running

Currently, the bot runs on port 7001 (this should be extracted to a variable for easier customization), so make sure this port is available and opened to the world.

To run it, execute:

```
> node senseibot.js
```

### Testing

You should be able to test it doing a POST with some required data. For example, using `curl`:

```
> curl --data "token=<Your Slack's bot's token>&trigger_word=<Your trigger word>&text=<Your trigger word> <Your command>&user_name=<Your username>" http://localhost:7001/trigger
```

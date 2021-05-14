const fetch = require("node-fetch");
const Discord = require("discord.io");
const logger = require("winston");
const auth = require("./auth.json");
const spawn = require("child_process").spawn;
const itemName = "Kismet Feather";

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";
let bot = new Discord.Client({
  token: auth.token,
  autorun: true,
});

bot.on("ready", function (evt) {
  logger.info("Connected");
  logger.info("Logged in as: ");
  logger.info(bot.username + " - (" + bot.id + ")");
});

bot.on("message", function (user, userID, channelID, message, evt) {
  if (message.substring(0, 1) == "!") {
    var args = message.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case "bc": {
        const pythonProcess = spawn("python3", ["./apiTesting.py"]);
        bot.sendMessage({
          to: channelID,
          message: "Getting data. Please wait...",
        });
        pythonProcess.stdout.on("data", (data) => {
          let out = JSON.parse(data.toString());
          bot.sendMessage({
            to: channelID,
            message: out,
          });
          console.log(out);
        });

        break;
      }
    }
  }
});

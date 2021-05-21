const Discord = require("discord.js");
const logger = require("winston");
const auth = require("./auth.json");
const spawn = require("child_process").spawn;

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console(), {
  colorize: true,
});
logger.level = "debug";

const client = new Discord.Client();
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (message) => {
  if (message.content.substring(0, 1) == "!") {
    var args = message.content.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case "bc": {
        const pythonProcess = spawn("python3", ["./apiTesting.py", args[0]]);
        message.reply("Getting data. Please wait...");
        pythonProcess.stdout.on("data", (data) => {
          let out = data.toString();
          const embed = new Discord.MessageEmbed()
            .setTitle("Here is the data, bois")
            .setColor("#80ff00")
            .setDescription(out);
          message.channel.send(embed).then((msg) => msg.react("🤑"));
        });

        break;
      }
      case "bchelp": {
        message.reply("Getting data. Please wait...");
      }
    }
  }
});

client.login(auth.token);

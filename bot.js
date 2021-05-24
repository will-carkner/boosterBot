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
    let authors = [];
    switch (cmd) {
      case "bc": {
        const pythonProcess = spawn("python3", ["./apiTesting.py", args[0]]);
        message.reply("Getting data. Please wait...");
        pythonProcess.stdout.on("data", (data) => {
          let out = data.toString();
          const embed = new Discord.MessageEmbed()
            .setTitle("Here is the data, bois")
            .setColor("#80ff00")
            .setAuthor("ChickenTaxi43")
            .setDescription(out);
          message.channel.send(embed).then((msg) => msg.react("🤑"));
        });

        break;
      }
      case "bchelp": {
        const embed2 = new Discord.MessageEmbed()
          .setTitle("You needed help?")
          .setColor("#80ff00")
          .setAuthor("ChickenTaxi43")
          .setDescription(
            "Commands = !bc followed by integer for number of Bits. \n Will calculate best items to buy, but buy quickly as prices can fluctuate. \n V2 with further commands coming soon!"
          );
        message.channel.send(embed2).then((msg) => msg.react("👌"));
      }
    }
  }
});

client.login(auth.token);

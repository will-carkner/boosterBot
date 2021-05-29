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

let authors = [];
client.on("message", (message) => {
  if (message.content.substring(0, 1) == "!") {
    var args = message.content.substring(1).split(" ");
    var cmd = args[0];

    args = args.splice(1);
    switch (cmd) {
      case "bc": {
        const embed3 = new Discord.MessageEmbed()
          .setTitle("Do you have bits?")
          .setColor("#80ff00")
          .setAuthor(message.author.username)
          .setDescription("React with the ✅ or the ❌");
        message.reply(embed3).then((rMes) => {
          rMes.react("✅").then(() => rMes.react("❌"));
          const filter = (reaction, user) => {
            return (
              ["✅", "❌"].includes(reaction.emoji.name) &&
              user.id === message.author.id
            );
          };

          rMes
            .awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] })
            .then((collected) => {
              const embed4 = new Discord.MessageEmbed()
                .setTitle("How many bits do you have?")
                .setColor("#80ff00")
                .setDescription("Please answer with an integer...");
              const reaction = collected.first();
              if (reaction.emoji.name === "✅") {
                message.reply(embed4);
                authors.push(message.author.id);
              } else {
              }
            });
        });
        break;
      }
      case "bchelp": {
        const embed2 = new Discord.MessageEmbed()
          .setTitle("You needed help?")
          .setColor("#80ff00")
          .setAuthor(message.author.username)
          .setDescription(
            "Commands = !bc followed by integer for number of Bits. \n Will calculate best items to buy, but buy quickly as prices can fluctuate. \n V2 with further commands coming soon!"
          );
        message.channel.send(embed2).then((msg) => msg.react("👌"));
      }
    }
  }
  if (authors.indexOf(message.author.id) != -1) {
    if (!isNaN(message.content)) {
      const embed5 = new Discord.MessageEmbed()
        .setTitle("Ok, Getting data...")
        .setColor("#80ff00");
      message.reply(embed5);

      let bits = message.content;
      const pythonProcess = spawn("python3", ["./apiTesting.py", bits]);
      pythonProcess.stdout.on("data", (data) => {
        let out = data.toString();
        const embed = new Discord.MessageEmbed()
          .setTitle("Here is the data, bois")
          .setColor("#80ff00")
          .setAuthor(message.author.username)
          .setDescription(out);
        message.channel.send(embed).then((msg) => msg.react("🤑"));
      });
    } else {
      message.reply("Learn what a number is you dumb bitch!");
    }
    authors.splice(authors.indexOf(message.author.id), 1);
  }
});

client.login(auth.token);

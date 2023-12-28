//Imports
require("dotenv").config();
const guildId = process.env.guildId

//Message Create event
module.exports = {
  name: "messageCreate",
    /**
  * @param {Message} message
  * @param {Client} client
  */
  async execute(message, client) {
    try {
      const guild = client.guilds.cache.get(guildId);
      const channel = guild.channels.cache.get("1188687223038685255");

      if (message.channel === channel) {
        if (message.content == "<:swagong:1189301009000956044>") {
          message.react("1181279015802241065");
        } else {
          message.react(`❌`);
          await message.delete();
        }
      }
    } catch (err) {
      return;
    }
  },
};

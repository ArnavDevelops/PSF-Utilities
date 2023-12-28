//Imports
const { ActivityType } = require("discord.js");
const { logMessage } = require("../../helpers/logging.js");
require("dotenv").config()
const guildId = process.env.guildId

//Ready event
module.exports = {
  name: "ready",
  once: true,
  /**
  * @param {Client} client
  */
  async execute(client) {
    const guild = client.guilds.cache.get(guildId);

    //Status | Array
    const statusArray = [
      {
        type: ActivityType.Playing,
        content: "Military War Tycoon",
      },
      {
        type: ActivityType.Playing,
        content: "Ruining other Military Tycoon Games",
      },
      {
        type: ActivityType.Watching,
        content: `Over ${guild.memberCount} members in Para SF!`,
      },
      {
        type: ActivityType.Listening,
        content: `Jana Gana Mana`,
      },
      {
        type: ActivityType.Competing,
        content: `Faction wars`,
      },
    ];

    //Status | Main function
    async function pickPresence() {
      const option = Math.floor(Math.random() * statusArray.length);
      client.user.setStatus("dnd");
      try {
        await client.user.setPresence({
          activities: [
            {
              name: statusArray[option].content,
              type: statusArray[option].type,
            },
          ],
        });
      } catch (error) {
        return;
      }
    }
    setInterval(pickPresence, 8 * 1000);

    //Bot startup
    logMessage(`${client.user.username} is online!`, "INFO");
  },
};

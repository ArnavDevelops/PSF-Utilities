//Imports
const { EmbedBuilder } = require("discord.js");
require("dotenv").config();
const guildId = process.env.guildId

//GuildMemberAdd event
module.exports = {
  name: "guildMemberAdd",
    /**
  * @param {GuildMember} member
  * @param {Client} client
  */
  async execute(member, client) {
    //Misc
    if (member.user.bot) return;
    const guild = client.guilds.cache.get(guildId);

    //Channel
    const channel = guild.channels.cache.get("1189635169838182441");
    if (!channel) return;

    //Role IDs
    const roles = [
      "1188628857796956301",
      "1188617583428124693",
    ];

    //PSF
    if(member.guild.id === guild.id) {
      await member.roles.add(roles)

      const welcomeEmbed = new EmbedBuilder()
        .setTitle(`New Member!`)
        .setDescription(
          `Hey ${member.user.username}! Welcome to ***${member.guild}***. Enjoy your stay and **don't forget to verify yourself in <#1188689066431090688>**.`
        )
        .addFields({ name: "Rules", value: "<#1188624224915558400>" })
        .addFields({ name: "About us", value: "<#1188684797053239316>" })
        .setColor("Random")
        .setTimestamp();
      channel.send({ content: `${member}`, embeds: [welcomeEmbed] });
    }
  },
};

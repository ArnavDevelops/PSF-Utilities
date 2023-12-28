const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "guildMemberRemove",
  async execute(member) {
    try {
      const logData = await logSchema.findOne({ Guild: member.guild.id });
      if (!logData) return;

      const logChannel = member.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;


      let rolesArray = [];

      const roles = member.roles.cache.filter((r) => r.name !== "@everyone").map((r) => r.id);
      roles.forEach((role) => {
        rolesArray.push(`<@&${role}>`)
      });

      const fetchedlogs = await member.guild.fetchAuditLogs({
        type: AuditLogEvent.MemberKick,
        Limit: 1,
      });
      const kicklog = fetchedlogs.entries.first();
      const { target, reason, executor } = kicklog;

      if (kicklog.createdAt < member.joinedAt) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${member.user.username} just left the server`,
            iconURL: member.user.avatarURL(),
          })
          .setDescription(
            `**User:**\n ${member.user.username} (${member.user.id})\n
            **Roles:**\n ${rolesArray.join(`\n`)}`
          )
          .setThumbnail(member.user.avatarURL())
          .setFooter({
            text: "Para SF Utilities#1663",
            iconURL: `https://media.discordapp.net/attachments/1188687137894305793/1189645170430464061/6826-yipeee.png?ex=659eea67&is=658c7567&hm=862fda72b4ff86ebecbe79be4a894f48f984811ea6d2a6ab562795f2c4093a19&=&format=webp&quality=lossless&width=337&height=337`,
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }

      //Kick logs
      else if (target.id === member.id) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setAuthor({
            name: `${target.username} was kicked`,
            iconURL: target.avatarURL(),
          })
          .setDescription(
            `
        **User:**\n ${target.username} (${target.id})\n
        **Reason**\n ${reason || "Not specified"}`
          )
          .setThumbnail(target.avatarURL())
          .setFooter({
            text: `Moderator: ${executor.username}`,
            iconURL: `${executor.avatarURL()}`,
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      return;
    }
  },
};

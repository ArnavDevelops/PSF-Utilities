const { EmbedBuilder, AuditLogEvent } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember) {
    try {
      const logData = await logSchema.findOne({ Guild: newMember.guild.id });
      if (!logData) return;

      const logChannel = newMember.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      //Timeout event
      if (
        newMember.communicationDisabledUntilTimestamp !== null &&
        (oldMember.communicationDisabledUntilTimestamp === null ||
          newMember.communicationDisabledUntilTimestamp >
            oldMember.communicationDisabledUntilTimestamp) &&
        newMember.communicationDisabledUntilTimestamp > Date.now()
      ) {
        const auditLogs = await newMember.guild
          .fetchAuditLogs({
            type: AuditLogEvent.MemberUpdate,
            limit: 1,
          })
          .then((a) => a.entries.first());
        const executor = auditLogs ? auditLogs.executor : null;
        const { reason } = auditLogs;

        const embed = new EmbedBuilder()
          .setColor("Red")
          .setTitle("Member timed out")
          .setDescription(
            `**Member:**\n ${newMember.user.username} (${newMember.id})
        \n**Reason**\n ${reason || "Not specified"}
        \n**Ends at**\n <t:${Math.floor(
          newMember.communicationDisabledUntilTimestamp / 1000
        )}:F>`
          )
          .setThumbnail(newMember.user.avatarURL())
          .setFooter({
            text: `Moderator: ${executor.username}`,
            iconURL: executor.avatarURL(),
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      } else if (
        oldMember.communicationDisabledUntilTimestamp !== null &&
        newMember.communicationDisabledUntilTimestamp === null
      ) {
        const auditlog2 = await newMember.guild
          .fetchAuditLogs({
            type: AuditLogEvent.MemberUpdate,
            limit: 1,
          })
          .then((a) => a.entries.first());
        const executor = auditlog2 ? auditlog2.executor : null;

        const embed = new EmbedBuilder()
          .setColor("Green")
          .setTitle("Member untimed out")
          .setDescription(
            `**Member:**\n ${newMember.user.username} (${newMember.id})`
          )
          .setThumbnail(newMember.user.avatarURL())
          .setFooter({
            text: `Moderator: ${executor.username}`,
            iconURL: executor.avatarURL(),
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }

      const changes = [];
      if (oldMember.nickname !== newMember.nickname) {
        changes.push(
          `\n**Old Nickname:**\n ${oldMember.nickname || "None"}
        \n **New Nickname**\n ${newMember.nickname || "None"}`
        );
      }

      const oldRoleIDs = oldMember.roles.cache.map((r) => r.id);
      const newRoleIDs = newMember.roles.cache.map((r) => r.id);
      const rolesArray = [];

      if (oldRoleIDs !== newRoleIDs) {
        oldRoleIDs.forEach((role) => {
          if (!newRoleIDs.includes(role)) rolesArray.push(`<@&${role}> - Removed`)
        });

        newRoleIDs.forEach((role) => {
          if (!oldRoleIDs.includes(role)) rolesArray.push(`<@&${role}> - Added`)
        });

        if(rolesArray.length > 0) {
          changes.push(`\n**Roles**\n${rolesArray.join(`\n`)}`)
        }
      }
      
      if (changes.length === 0) return;

      const MemberUpdate = await newMember.guild
        .fetchAuditLogs({
          type: AuditLogEvent.MemberUpdate,
          limit: 1,
        })
        .then((a) => a.entries.first());

      //Nicknames
      if (MemberUpdate) {
        const embed = new EmbedBuilder()
          .setColor("White")
          .setTitle("Member Updated")
          .setDescription(
            `**Member:**\n ${newMember.user.username} (${
              newMember.id
            })\n${changes.join("\n")}`
          )
          .setThumbnail(newMember.user.avatarURL())
          .setFooter({
            text: "Para SF Utilities#1663",
            iconURL: "https://media.discordapp.net/attachments/1188687137894305793/1189645170430464061/6826-yipeee.png?ex=659eea67&is=658c7567&hm=862fda72b4ff86ebecbe79be4a894f48f984811ea6d2a6ab562795f2c4093a19&=&format=webp&quality=lossless&width=337&height=337",
          })
          .setTimestamp();

        await logChannel.send({ embeds: [embed] });
      }
    } catch (err) {
      console.error(err);
    }
  },
};

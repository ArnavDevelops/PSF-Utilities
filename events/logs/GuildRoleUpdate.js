const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "roleUpdate",
  async execute(oldRole, newRole) {
    try {
      const logData = await logSchema.findOne({ Guild: newRole.guild.id });
      if (!logData) return;

      const logChannel = newRole.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;
      const changes = [];

      if (oldRole.name !== newRole.name) {
        changes.push(`\n **Name:**\n "${oldRole.name}" ⮕ "${newRole.name}"`);
      }

      if (oldRole.color !== newRole.color) {
        changes.push(
          `\n**Color:**\n ${oldRole.color.toString(
            16
          )} ⮕ ${newRole.color.toString(16)}`
        );
      }

      if (oldRole.mentionable !== newRole.mentionable) {
        changes.push(
          `\n**Mentionable:**\n ${oldRole.mentionable} ⮕ ${newRole.mentionable}`
        );
      }

      if (oldRole.hoist !== newRole.hoist) {
        changes.push(
          `\n**Display Separately:**\n ${oldRole.hoist} ⮕ ${newRole.hoist}`
        );
      }

      if (oldRole.permissions !== newRole.permissions) {
        const permissionsArray = newRole.permissions
          .toArray()
          .filter(
            (p) =>
              !oldRole.permissions.toArray().includes(p) &&
              oldRole.id === newRole.id
          )
          .map((permission) => {
            if (!oldRole.permissions.has(permission)) {
              return `${permission} <:toggle_on:1189788397053689866>`;
            } else {
              return `${permission} <:toggle_off:1189789052921204818>`;
            }
          });

        oldRole.permissions.toArray().forEach((permission) => {
          if (!newRole.permissions.has(permission)) {
            permissionsArray.push(
              `${permission} <:toggle_off:1189789052921204818>`
            );
          }
        });

        if (permissionsArray.length > 0) {
          changes.push(`\n**Permissions:**\n ${permissionsArray.join("\n")}`);
        }
      }

      if (changes.length === 0) {
        return;
      }

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Role Updated")
        .setDescription(
          `**Role:**\n ${newRole.name} (${newRole.id})\n${changes.join("\n")}`
        )
        .setFooter({
          text: "Para SF Utilities#1663",
          iconURL: "https://media.discordapp.net/attachments/1188687137894305793/1189645170430464061/6826-yipeee.png?ex=659eea67&is=658c7567&hm=862fda72b4ff86ebecbe79be4a894f48f984811ea6d2a6ab562795f2c4093a19&=&format=webp&quality=lossless&width=337&height=337",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });
    } catch (err) {
      return;
    }
  },
};

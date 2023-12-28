const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "channelUpdate",
  async execute(oldChannel, newChannel) {
    try {
      const logData = await logSchema.findOne({ Guild: newChannel.guild.id });
      if (!logData) return;

      const logChannel = newChannel.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const changes = [];
      if (oldChannel.name !== newChannel.name) {
        changes.push(`\n**Name:**\n ${oldChannel.name} ⮕ ${newChannel.name}`);
      }
      if (oldChannel.topic !== newChannel.topic) {
        changes.push(
          `\n**Topic:**\n ${oldChannel.topic || "None"} ⮕ ${newChannel.topic || "None"
          }`
        );
      }
      if (oldChannel.permissionOverwrites !== newChannel.permissionOverwrites) {
        let permArray = [];
        newChannel.permissionOverwrites.cache.forEach(newOverwrite => {
          if (newOverwrite.type === 0) {
            const oldOverwrite = oldChannel.permissionOverwrites.cache.get(newOverwrite.id);

            const newlyGrantedPermissions = newOverwrite.allow.toArray().filter(perm => !oldOverwrite.allow.has(perm));
            const newlyDeniedPermissions = newOverwrite.deny.toArray().filter(perm => !oldOverwrite.deny.has(perm));
            const defaultPermissions = oldOverwrite.allow.toArray().filter(perm => !newOverwrite.allow.has(perm) && !newOverwrite.deny.has(perm))
              .concat(oldOverwrite.deny.toArray().filter(perm => !newOverwrite.deny.has(perm) && !newOverwrite.allow.has(perm)));

            if (newlyGrantedPermissions.length > 0 || newlyDeniedPermissions.length > 0 || defaultPermissions.length > 0) {
              const role = newChannel.guild.roles.cache.get(newOverwrite.id);
              const roleName = role ? `<@&${role.id}>` : `ID: ${newOverwrite.id}`;

              newlyGrantedPermissions.forEach(perm => {
                permArray.push(`${perm} <:channelperms_check:1189801438679941230> `);
              });

              newlyDeniedPermissions.forEach(perm => {
                permArray.push(`${perm} <:channelperms_x:1189801446946906132>`);
              });

              defaultPermissions.forEach(perm => {
                permArray.push(`${perm} <:channelperms_default:1189801442735824937> `);
              });
              // Add the changes for this role to the changes array
              changes.push(`\n**Permissions**:\n${roleName}:\n\n${permArray.join('\n')}`);
            }
          }
        });
      }

      if (changes.length === 0) return;

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Channel Updated")
        .setDescription(
          `**Channel:**\n ${newChannel} (${newChannel.id})\n${changes.join(
            "\n"
          )}`
        )
        .setFooter({
          text: "Para SF Utilities#1663",
          iconURL: "https://media.discordapp.net/attachments/1188687137894305793/1189645170430464061/6826-yipeee.png?ex=659eea67&is=658c7567&hm=862fda72b4ff86ebecbe79be4a894f48f984811ea6d2a6ab562795f2c4093a19&=&format=webp&quality=lossless&width=337&height=337",
        })
        .setTimestamp();

      await logChannel.send({ content: ``, embeds: [embed] });
    } catch (err) {
      return;
    }
  },
};

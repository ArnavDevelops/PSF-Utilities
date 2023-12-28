const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "stickerUpdate",
  async execute(oldSticker, newSticker) {
    try {
      const logData = await logSchema.findOne({ Guild: newSticker.guild.id });
      if (!logData) return;

      const logChannel = newSticker.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const changedProperties = [];

      if (oldSticker.name !== newSticker.name) {
        changedProperties.push(
          `\n**Name:**\n ${oldSticker.name} ⮕ ${newSticker.name}`
        );
      }

      if (oldSticker.description !== newSticker.description) {
        changedProperties.push(
          `\n**Description:**\n ${oldSticker.description || "None"} ⮕ ${
            newSticker.description || "None"
          }`
        );
      }

      if (oldSticker.tags !== newSticker.tags) {
        changedProperties.push(
          `\n**Emoji**\n :${oldSticker.tags}: ⮕ :${newSticker.tags}:`
        );
      }

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Sticker Updated")
        .setDescription(
          `**Sticker:**\n ${newSticker.name} (${
            newSticker.id
          })\n${changedProperties.join(`\n`)}`
        )
        .setThumbnail(newSticker.url)
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

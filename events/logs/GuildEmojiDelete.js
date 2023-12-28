const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "emojiDelete",
  async execute(emoji) {
    try {
      const logData = await logSchema.findOne({ Guild: emoji.guild.id });
      if (!logData) return;

      const logChannel = emoji.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Emoji deleted")
        .setDescription(
          `**Name:**\n ${emoji.name}\n
        **ID:**\n ${emoji.id}`
        )
        .setThumbnail(emoji.url)
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

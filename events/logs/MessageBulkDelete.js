const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "messageDeleteBulk",
  async execute(messages, client) {
    try {
      const logData = await logSchema.findOne({ Guild: client.guild.id });
      if (!logData) return;

      const logChannel = client.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const channel = messages.first()?.channel;

      const embed1 = new EmbedBuilder()
        .setColor("Red")
        .setTitle(`${messages.size} messages deleted in #${channel.name}`)
        .setDescription(
          `**Channel:**\n ${channel}\n
          **Count:**\n ${messages.size}`
        )
        .setFooter({
          text: "Para SF Utilities#1663",
          iconURL: "https://media.discordapp.net/attachments/1188687137894305793/1189645170430464061/6826-yipeee.png?ex=659eea67&is=658c7567&hm=862fda72b4ff86ebecbe79be4a894f48f984811ea6d2a6ab562795f2c4093a19&=&format=webp&quality=lossless&width=337&height=337",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed1] });
    } catch (err) {
      return;
    }
  },
};

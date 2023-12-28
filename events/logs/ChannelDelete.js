const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "channelDelete",
  async execute(channel) {
    try {
      const logData = await logSchema.findOne({ Guild: channel.guild.id });
      if (!logData) return;

      const logChannel = channel.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("Channel Deleted")
        .setDescription(
          `**Name:**\n ${channel.name} (${channel.id})\n
        **Type:**\n ${getChannelTypeName(channel.type)}`
        )
        .setFooter({
          text: "Para SF Utilities#1663",
          iconURL: "https://media.discordapp.net/attachments/1188687137894305793/1189645170430464061/6826-yipeee.png?ex=659eea67&is=658c7567&hm=862fda72b4ff86ebecbe79be4a894f48f984811ea6d2a6ab562795f2c4093a19&=&format=webp&quality=lossless&width=337&height=337",
        })
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });

      function getChannelTypeName(channelType) {
        const channelTypeMapping = {
          0: "Text",
          1: "DM",
          2: "Voice",
          3: "Group DM",
          4: "Category",
          5: "Announcement",
          10: "News Thread",
          11: "Public Thread",
          12: "Private Thread",
          13: "Stage Voice",
          14: "Directory",
          15: "Forum",
          16: "Media",
        };

        return channelTypeMapping[channelType] || "Unknown";
      }
    } catch (err) {
      return;
    }
  },
};

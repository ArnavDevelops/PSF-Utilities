const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");
const {
  getChangedProperties,
} = require(`../../helpers/getChangedProperties.js`);

module.exports = {
  name: "guildUpdate",
  async execute(oldGuild, newGuild) {
    try {
      const logData = await logSchema.findOne({ Guild: newGuild.id });
      if (!logData) return;

      const logChannel = newGuild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      const changedProperties = await getChangedProperties(oldGuild, newGuild);

      if (changedProperties.length === 0) return;

      const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Guild Updated")
        .setDescription(
          changedProperties
            .map(
              (prop) =>
                `**${prop.name}:**\n ${prop.oldValue} ⮕ ${prop.newValue}\n`
            )
            .join("\n")
        )
        .setThumbnail(newGuild.iconURL())
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

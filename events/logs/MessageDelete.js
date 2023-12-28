const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "messageDelete",
  async execute(message) {
    try {
      if (message.author.bot) return;

      const logData = await logSchema.findOne({ Guild: message.guild.id });
      if (!logData) return;

      const logChannel = message.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      let content = `**${message.author.username}** (${message.author.id}) deleted their message in #${message.channel.name}\n` +
      `\n**Channel**\n<#${message.channel.id}>\n` +
      `\n**Message:**\n${message.content || "No Message"}\n`;

      if (message.attachments.size > 0) {
        content += "\n**Attachment(s) attached with this Message:**\n";
        let attachmentNumber = 1;
        message.attachments.forEach(attachment => {
            content += `[Attachment #${attachmentNumber}](${attachment.url}) `;
            attachmentNumber++;
        });
      }

      const embed = new EmbedBuilder()
        .setColor("Red")
        .setAuthor({
          name: `Message deleted by ${message.author.username}`,
          iconURL: `${message.author.avatarURL()}`,
        })
        .setDescription(content)
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

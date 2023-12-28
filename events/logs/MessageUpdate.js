const { EmbedBuilder } = require("discord.js");
const logSchema = require("../../schemas/logSchema.js");

module.exports = {
  name: "messageUpdate",
  async execute(oldMessage, newMessage) {
    try {
      if (newMessage.content === oldMessage.content) return;
      if (newMessage.author.bot) return;

      const logData = await logSchema.findOne({ Guild: newMessage.guild.id });
      if (!logData) return;

      const logChannel = newMessage.guild.channels.cache.get(logData.Channel);
      if (!logChannel) return;

      let content = `**${newMessage.author.username}** (${newMessage.author.id}) updated their message in #${newMessage.channel.name}\n` +
      `\n**Message:**\nhttps://discord.com/channels/${newMessage.guild.id}/${newMessage.channel.id}/${newMessage.id}\n` +
      `\n**Before:**\n${oldMessage.content || "No Message"}\n` +
      `\n**After:**\n${newMessage.content}\n`;

      if (newMessage.attachments.size > 0) {
        content += "\n**Attachment(s) attached with this Message:**\n";
        let attachmentNumber = 1;
        newMessage.attachments.forEach(attachment => {
            content += `[Attachment #${attachmentNumber}](${attachment.url}) `;
            attachmentNumber++;
        });
      }

      const embed = new EmbedBuilder()
        .setColor("White")
        .setAuthor({
          name: `Message edited by ${newMessage.author.username}`,
          iconURL: `${newMessage.author.avatarURL()}`,
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

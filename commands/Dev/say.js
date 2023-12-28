const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { startTyping } = require("../../helpers/startTyping.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("What should the bot say?")
    .setDMPermission(false)
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("What should the bot say?")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("reply").setDescription("What should the bot reply to?")
    ),
  async execute(interaction, client) {
    const { guild, options, channel } = interaction;
    const text = options.getString("text");
    const owner = guild.members.cache.get("947568482407546991");

    const messagelink = options.getString("reply");

    if (messagelink) {
      const badEmbed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Invalid ID/Link***");

      const messageId = (messagelink.match(/\d{10,}/g) || []).pop();
      if (!messageId)
        return interaction.reply({ embeds: [badEmbed], ephemeral: true });

      const replyMessage = await channel.messages.fetch(messageId);
      await replyMessage.reply(text);
    }

    const permissionEmbed = new EmbedBuilder()
      .setColor("Red")
      .setDescription(
        "***:warning: You're not the bot owner to use this Command.***"
      );
    if (owner.id !== interaction.user.id)
      return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });

    const Successembed = new EmbedBuilder()
      .setTitle("***✅ Successfully sent the text.***")
      .setColor("Green");
    await interaction.reply({ embeds: [Successembed], ephemeral: true });

    if (!messagelink) {
      startTyping(channel);
      setTimeout(async () => {
        await channel.send({ content: `${text}` });
      }, 1000);
    }
  },
};

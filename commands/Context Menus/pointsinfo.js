const {
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  EmbedBuilder,
} = require("discord.js");
const pointsSchema = require("../../schemas/pointsSchema.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("User Point(s)")
    .setType(ApplicationCommandType.User),
  async execute(interaction, client) {
    const { guild, targetId, targetUser } = interaction;

    const userPoints = await pointsSchema.find({
      userId: targetId,
      guildId: allowedGuild.id,
    });
    const Bots = guild.members.cache.get(targetId);
    if (Bots.user.bot) {
      const embed = new EmbedBuilder()
        .setColor("Red")
        .setDescription("***:x: Bots cannot have any points.***");
      return await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const noPoints = new EmbedBuilder()
      .setDescription(`***:warning: ${targetUser.username} has no Points.***`)
      .setColor("Red");
    if (userPoints.length < 1 || userPoints[0].points <= 0)
      return await interaction.reply({ embeds: [noPoints], ephemeral: true });

    let embedDescription = `**Points:** ${userPoints[0].points}P`;

    const embed = new EmbedBuilder()
      .setTitle(`***${targetUser.username}'s Points***`)
      .setDescription(`${embedDescription}`)
      .setColor("Random");
    await interaction.reply({ embeds: [embed], ephemeral: true });
  },
};

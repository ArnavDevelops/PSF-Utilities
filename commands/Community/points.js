const {
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const pointsSchema = require("../../schemas/pointsSchema.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("points")
    .setDescription(
      "Check someone's points, add points to an user or remove points from an user."
    )
    .setDMPermission(false)
    .addSubcommand((option) =>
      option
        .setName("info")
        .setDescription("Check Information about someone's points.")
        .addUserOption((option) =>
          option.setName("user").setDescription("Select the user.")
        )
    )
    .addSubcommand((option) =>
      option
        .setName("increase")
        .setDescription("Increase someone's points.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select the user.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("points")
            .setDescription(
              "State how many points do you wanna give to the user."
            )
            .setMinValue(0)
            .setMaxValue(20)
            .setRequired(true)
        )
    )
    .addSubcommand((option) =>
      option
        .setName("decrease")
        .setDescription("decrease's someone's points.")
        .addUserOption((option) =>
          option
            .setName("user")
            .setDescription("Select the user.")
            .setRequired(true)
        )
        .addNumberOption((option) =>
          option
            .setName("points")
            .setDescription(
              "State how many points you wanna remove from the user."
            )
            .setMinValue(0)
            .setMaxValue(20)
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    const { options } = interaction;


    //Info
    if (options.getSubcommand() === "info") {
      const { guild } = interaction;
      try {
        const e = options.getUser("user") || interaction.user;
        const user = await guild.members.fetch(e).catch(async (err) => {
          const failEmbed = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
            );
          await interaction.reply({ embeds: [failEmbed], ephemeral: true });
          return null;
        });
        if (!user) return;

        const userPoints = await pointsSchema.find({
          userId: user.id,
        });
        const Bots = guild.members.cache.get(user.id);
        if (Bots.user.bot) {
          const embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("***:x: Bots cannot have any points.***");
          return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        const noPoints = new EmbedBuilder()
          .setDescription(
            `***:warning: ${user.username || user.user.username} has no Points***`
          )
          .setColor("Red");
        if (userPoints.length < 1 || userPoints[0].points <= 0)
          return await interaction.reply({
            embeds: [noPoints],
            ephemeral: true,
          });

        let embedDescription = `**Points:** ${userPoints[0].points}P`;

        const embed = new EmbedBuilder()
          .setTitle(`***${user.username || user.user.username}'s Points***`)
          .setDescription(`${embedDescription}`)
          .setColor("Random");
        await interaction.reply({ embeds: [embed], ephemeral: true });
      } catch (err) {
        return;
      }
    }

    //Increase
    else if (options.getSubcommand() === "increase") {
      const { member, guild } = interaction;
      const e = options.getUser("user");
      const user = await guild.members.fetch(e).catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
      if (!user) return;
      const points = options.getNumber("points");

      const whitelistRole = "1188623538173792286";

      const allowedRoles = member._roles.some((role) =>
        whitelistRole.includes(role)
      );

      if (!allowedRoles) {
        const permissionEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You don't have the required role to use this command.***"
          );
        return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });
      }

      const userPoints = await pointsSchema.findOne({ userId: user.id });
      const Bots = guild.members.cache.get(user.id);
      if (Bots.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: Bots cannot have any points.***");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
      let addedPoints;

      try {
        if (userPoints) {
          addedPoints = userPoints.points += points;
          await userPoints.save();
        } else {
          await pointsSchema.create({
            userId: user.id,
            guildId: interaction.guildId,
            points: points,
          });
        }

        const embed = new EmbedBuilder()
          .setDescription(`✅ <@${user.id}> has got ***${points}P*** `)
          .setFooter({
            text: `User's points: ${addedPoints || points}P`,
            iconURL: user.user.avatarURL(),
          })
          .setColor("Green");
        await interaction.reply({ embeds: [embed] });
      } catch (err) {
        return;
      }
    }

    //Decrease
    else if (options.getSubcommand() === "decrease") {
      const { member, guild } = interaction;
      const e = options.getUser("user");
      const user = await guild.members.fetch(e).catch(async (err) => {
        const failEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: There was an error searching for the user, please make sure that the user is in the server.***"
          );
        await interaction.reply({ embeds: [failEmbed], ephemeral: true });
        return null;
      });
      if (!user) return;
      const points = options.getNumber("points");

      const whitelistRole = "1188623538173792286";

      const allowedRoles = member._roles.some((role) =>
        whitelistRole.includes(role)
      );

      if (!allowedRoles) {
        const permissionEmbed = new EmbedBuilder()
          .setColor("Red")
          .setDescription(
            "***:warning: You don't have the required role to use this command.***"
          );
        return interaction.reply({ embeds: [permissionEmbed], ephemeral: true });
      }

      const userPoints = await pointsSchema.findOne({
        userId: user.id,
        guildId: guild.id,
      });
      const Bots = guild.members.cache.get(user.id);
      if (Bots.user.bot) {
        const embed = new EmbedBuilder()
          .setColor("Red")
          .setDescription("***:x: Bots cannot have any points.***");
        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      try {
        if (!userPoints) {
          const noPoints = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              "***:warning: The user you mentioned doesn't have any points.***"
            );
          return interaction.reply({ embeds: [noPoints], ephemeral: true });
        }

        if (userPoints.points < points) {
          const lessPoints = new EmbedBuilder()
            .setColor("Red")
            .setDescription(
              `***:warning: The mentioned user doesn't have that many points (User's points: ${userPoints.points}).***`
            );
          return await interaction.reply({
            embeds: [lessPoints],
            ephemeral: true,
          });
        }
        let removedPoints;

        removedPoints = userPoints.points -= points;
        await userPoints.save();

        const embed = new EmbedBuilder()
          .setDescription(`✅ <@${user.id}> now has ***${points}P*** deducted`)
          .setFooter({
            text: `User's points: ${removedPoints || points}P`,
            iconURL: user.user.avatarURL(),
          })
          .setColor("Green");
        await interaction.reply({ embeds: [embed] });
      } catch (err) {
        return;
      }
    }
  },
};

import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import dotenv from "dotenv";
dotenv.config();

export default {
  enabled: true,
  data: new SlashCommandBuilder()
    .setName('profile_setting')
    .setDescription('Lệnh quyền admin')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), 

  async execute(interaction) {
    const allowedUserId = process.env.ADMIN_USER_ID; 
    if (interaction.user.id !== allowedUserId) {
      return interaction.reply({ content: 'Bạn không có quyền dùng lệnh này ❌', ephemeral: true });
    }

    // Logic cho bạn
    await interaction.reply('✅ Chào Admin!');
  }
};

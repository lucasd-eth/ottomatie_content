import { SlashCommandBuilder } from 'discord.js';
//import { getContentByTags } from '../../services/supabaseService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  enabled: false,
  data: new SlashCommandBuilder()
    .setName('get')
    .setDescription('Lấy bài viết theo tags')
    .addStringOption(option =>
      option.setName('tags').setDescription('Tags cách nhau bởi dấu phẩy').setRequired(true)),

  async execute(interaction) {
    const tagsInput = interaction.options.getString('tags');
    const tags = tagsInput.split(',').map(tag => tag.trim());

    const articles = await getContentByTags(tags);
    if (!articles || articles.length === 0) {
      return interaction.reply({ content: '⚠️ Không tìm thấy bài viết nào!', ephemeral: true });
    }

    const fileContent = articles.map((a, i) => (
      `🔹 ${i + 1}. ${a.link || '[Không có link]'}\n📅 Ngày: ${a.date}\n📌 Tags: ${a.tags.join(', ')}\n📝 Nội dung: ${a.content}\n`
    )).join('\n');

    const filePath = path.join(__dirname, '../output.txt');
    fs.writeFileSync(filePath, fileContent);

    await interaction.reply({ files: [filePath] });

    setTimeout(() => fs.unlinkSync(filePath), 5000);
  }
};

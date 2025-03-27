import { SlashCommandBuilder } from 'discord.js';
import { searchSimilarDocuments } from '../../ragmodel/searchEngine.js';

export default {
  enabled: true, // ✅ Cho phép load lệnh này

  data: new SlashCommandBuilder()
    .setName('searchdocs')
    .setDescription('🔍 Tìm văn bản liên quan đến câu hỏi của bạn.')
    .addStringOption(option =>
      option
        .setName('query')
        .setDescription('Nhập nội dung cần tìm kiếm')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    await interaction.deferReply(); // Cho bot thời gian xử lý

    try {
      const results = await searchSimilarDocuments(query);

      if (results.length === 0) {
        return interaction.editReply('❌ Không tìm thấy tài liệu phù hợp.');
      }

      const formatted = results.map((doc, i) => {
        return `**${i + 1}.** [📄 Link](${doc.link})  
> ${doc.content.slice(0, 200)}...`;
      }).join('\n\n');

      await interaction.editReply(`📚 Các tài liệu liên quan:\n\n${formatted}`);
    } catch (err) {
      console.error('❌ Lỗi trong /searchdocs:', err);
      await interaction.editReply('❌ Đã xảy ra lỗi khi tìm kiếm tài liệu.');
    }
  }
};

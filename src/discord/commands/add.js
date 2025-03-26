import { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

export default {
  enabled: true,
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Thêm tài liệu mới'),

  async execute(interaction) {
    const modal = new ModalBuilder()
      .setCustomId('addDocument')
      .setTitle('Thêm Bài Viết');

    const inputs = [
      { id: 'tags', label: 'Tags (cách nhau bởi dấu phẩy)', style: TextInputStyle.Short, required: true },
      { id: 'link', label: 'Link nguồn (tuỳ chọn)', style: TextInputStyle.Short, required: false },
      { id: 'content', label: 'Nội dung bài viết', style: TextInputStyle.Paragraph, required: true },
      { id: 'adduser_id', label: 'Người thêm', style: TextInputStyle.Short, required: true },
      { id: 'image_link', label: 'Dán link ảnh vào đây', style: TextInputStyle.Short, required: true }
    ];

    const rows = inputs.map(input => new ActionRowBuilder().addComponents(
      new TextInputBuilder()
        .setCustomId(input.id)
        .setLabel(input.label)
        .setStyle(input.style)
        .setRequired(input.required)
    ));

    modal.addComponents(...rows);
    await interaction.showModal(modal);

  }
};

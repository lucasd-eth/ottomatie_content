import { addArticle } from '../../services/addArticle.js';

export default {
  customId: 'addDocument',
  async execute(interaction) {
    try {
      // Gửi phản hồi tạm thời để tránh interaction timeout
      await interaction.deferReply({ ephemeral: true });

      const tagsInput = interaction.fields.getTextInputValue('tags');
      const link = interaction.fields.getTextInputValue('link');
      const content = interaction.fields.getTextInputValue('content');
      const imagelink = interaction.fields.getTextInputValue('imagelink');
      const adduser = interaction.user.username;

      const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

      const { document_id, imageMessage } = await addArticle({
        adduser,
        content,
        link,
        tags,
        imageParagraph: imagelink 
      });

      await interaction.editReply({
        content: `✅ Bài viết đã được lưu thành công!\n${imageMessage}`
      });
    } catch (err) {
      console.error('❌ Lỗi khi xử lý addDocument:', err);
      try {
        await interaction.editReply({
          content: '❌ Có lỗi xảy ra khi lưu bài viết.'
        });
      } catch (err2) {
        console.error('❌ Lỗi khi gửi editReply:', err2);
      }
    }
  }
};

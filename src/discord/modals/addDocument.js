import { createDocument, createTags, createDocumentTags } from '../../services/supabaseService.js';

export default {
  customId: 'addDocument',
  async execute(interaction) {
    const tagsInput = interaction.fields.getTextInputValue('tags');
    const link = interaction.fields.getTextInputValue('link');
    const content = interaction.fields.getTextInputValue('content');
    const adduser_id = interaction.fields.getTextInputValue('adduser_id');
    const tags = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

    const { data: newDoc, error } = await createDocument({ adduser_id, content, link });
    if (error || !newDoc || !newDoc.document_id) {
      throw new Error('Không thể tạo tài liệu.');
    }

    for (const tag_name of tags) {
      const result = await createTags({ tag_name });
      if (result.success && result.data && result.data.tag_id) {
        await createDocumentTags({ document_id: newDoc.document_id, tag_id: result.data.tag_id });
      }
    }

    await interaction.reply({ content: '✅ Bài viết đã được lưu!', ephemeral: true });
  }
};

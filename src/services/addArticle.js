import { createDocument } from './documentService.js';
import { getOrCreateTagId } from './tagsService.js';
import { createDocumentTags } from './documentTagsService.js';
import { imageUpload } from '../models/imageUpload.js';

export const addArticle = async ({ adduser, content, link, tags, imageParagraph }) => {
  // Chuẩn hoá tags
  const cleanedTags = tags
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0);

  // Tạo document mới
  const { data: newDoc, error } = await createDocument({ adduser, content, link });

  if (error || !newDoc || !newDoc.document_id) {
    throw new Error('❌ Không thể tạo tài liệu.');
  }

  const document_id = newDoc.document_id;

  // Gán tag
  for (const tagName of cleanedTags) {
    const tag_id = await getOrCreateTagId({ tagName });
    await createDocumentTags({ document_id, tag_id });
  }

  // Upload image
  const uploadedImages = await imageUpload(imageParagraph);
  let imageMessage = '';
  if (uploadedImages.length > 0) {
    imageMessage = `✅ Đã upload ${uploadedImages.length} ảnh:\n${uploadedImages.join('\n')}`;
  } else {
    imageMessage = '⚠️ Không có ảnh nào được upload.';
  }
  // Trả kết quả về
  return { document_id, imageMessage };

};


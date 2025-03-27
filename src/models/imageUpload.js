import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Tải ảnh từ đoạn văn chứa nhiều URL ảnh
 * @param {string} paragraph - đoạn văn chứa các link ảnh
 * @returns {Promise<string[]>} - danh sách URL ảnh đã upload thành công
 */
export async function imageUpload(paragraph = '') {
    if (typeof paragraph !== 'string') paragraph = '';
  
    const urls = paragraph.match(/https?:\/\/[^\s]+?\.(jpg|jpeg|png|webp|gif)/gi) || [];
  
    const uploadedUrls = [];
  
    for (const url of urls) {
      try {
        const res = await cloudinary.uploader.upload(url, {
          folder: 'discord_uploads',
        });
        uploadedUrls.push(res.secure_url);
      } catch (err) {
        console.error(`❌ Upload failed for ${url}:`, err.message);
      }
    }
  
    return uploadedUrls;
  }
  

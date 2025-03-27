import { OpenAIEmbeddings } from "@langchain/openai";
import "dotenv/config";

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

/**
 * Chuyển văn bản thành vector embedding
 * @param {string} text - Văn bản cần chuyển
 * @returns {Promise<number[] | null>} - Vector hoặc null nếu lỗi
 */
async function generateEmbedding(text) {
  try {
    const vector = await embeddings.embedQuery(text);
    return vector;
  } catch (error) {
    console.error("❌ Lỗi khi tạo embedding:", error.message);
    return null;
  }
}

export { generateEmbedding };

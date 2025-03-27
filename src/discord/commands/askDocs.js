import { SlashCommandBuilder } from "discord.js";
import { searchSimilarDocuments } from "../../ragmodel/searchEngine.js";
import { generateAnswer } from "../../ragmodel/llm.js";

export default {
  enabled: true,
  data: new SlashCommandBuilder()
    .setName("askdocs")
    .setDescription("❓ Hỏi bot về tài liệu đã lưu")
    .addStringOption(option =>
      option.setName("query").setDescription("Câu hỏi của bạn").setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString("query");
    await interaction.deferReply();

    try {
      const documents = await searchSimilarDocuments(query);

      if (!documents || documents.length === 0) {
        return interaction.editReply("❌ Không tìm thấy dữ liệu phù hợp.");
      }

      // Ghép các nội dung lại thành context cho LLM
      const context = documents.map((doc, i) => `Tài liệu ${i + 1}: ${doc.content}`).join("\n\n");

      // Gửi đến LLM để lấy câu trả lời
      const answer = await generateAnswer(query, context);

      // Format kết quả tài liệu hiển thị cho người dùng
      const formattedDocs = documents.map((doc, i) => {
        const linkText = doc.link ? `([🔗 Link](${doc.link}))` : "";
        return `**${i + 1}.** ${linkText}\n> ${doc.content.slice(0, 300)}...`;
      }).join("\n\n");

      const fullReply = `
❓ **Câu hỏi:**  
${query}

📚 **Tài liệu liên quan:**  
${formattedDocs}

💡 **Câu trả lời từ AI:**  
${answer}
      `.trim();

      return interaction.editReply(fullReply);
    } catch (err) {
      console.error("❌ Lỗi khi xử lý /askdocs:", err);
      return interaction.editReply("❌ Đã xảy ra lỗi khi xử lý câu hỏi.");
    }
  }
};

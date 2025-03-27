import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateAnswer(query, context) {
  if (!query) throw new Error("Query is missing");
  if (!context) throw new Error("Context is missing");

  const prompt = `
Bạn là một trợ lý AI chuyên tìm kiếm thông tin từ cơ sở dữ liệu.
💡 **Lưu ý quan trọng:**  
- **Trả lời chính xác từng từ như trong dữ liệu.**  
- **Không tóm tắt, không rút gọn, không thay đổi nội dung.**  
- **Giữ nguyên toàn bộ dấu câu và thứ tự câu.**  

📚 **Thông tin từ cơ sở dữ liệu:**  
"""
${context}
"""

❓ **Câu hỏi:** "${query}"  

✅ **Trả lời đầy đủ, không thiếu từ nào:**
`.trim();

  try {
    console.log("📝 Prompt gửi OpenAI:\n", prompt);

    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct", // Hoặc "text-davinci-003"
      prompt: prompt,
      temperature: 0,
      max_tokens: 500, // Tránh giới hạn 16 tokens mặc định
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0
    });

    const answer = response.choices[0]?.text.trim() || "Không có kết quả.";
    console.log("📢 Kết quả phản hồi từ OpenAI:", answer);

    return answer;
  } catch (error) {
    console.error("❌ Error calling OpenAI API:", error);
    return "Xin lỗi, tôi không thể trả lời câu hỏi này.";
  }
}

export { generateAnswer };

import { supabase } from "../config/supabaseClient.js";

//tags_api(tag_id, tag_name)
export const createTags = async (tag_name) => {
    try {
        // 🔹 1. Kiểm tra đầu vào
        if (!tag_name ) {
            throw new Error("Thiếu dữ liệu đầu vào");
        }

        // 🔹 2. Gọi API tương tác với database 
        const { data, error } = await supabase
            .from("tags")
            .insert([{ tag_name }])
            .select()
            .single();

        // 🔹 3. Kiểm tra lỗi từ database
        if (error) throw new Error(`Lỗi từ DB: ${error.message}`);

        // 🔹 4. Log và trả về kết quả nếu thành công
        console.log("✅ Tạo tài liệu thành công:", data);
        return { success: true, data };
    } catch (error) {
        // 🔹 5. Bắt lỗi, log lỗi và trả về response phù hợp
        console.error("❌ Lỗi createTags:", error.message);
        return { success: false, message: error.message };
    }
};

export const getTags = async (document_id) => {
    try {
        if (!document_id) throw new Error("Thiếu dữ liệu đầu vào");

        const { data, error } = await supabase
            .from("document")
            .select("*")
            .eq("document_id", document_id)
            .single();

        if (error) throw new Error(`Lỗi từ DB: ${error.message}`);

        console.log("✅ Lấy tài liệu thành công:", data);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Lỗi getDocumentById:", error.message);
        return { success: false, message: error.message };
    }
};

export const updateTags = async (document_id, updates) => {
    try {
        if (!document_id || !updates) throw new Error("Thiếu dữ liệu đầu vào");

        const { data, error } = await supabase
            .from("document")
            .update(updates)
            .eq("document_id", document_id)
            .select()
            .single();

        if (error) throw new Error(`Lỗi từ DB: ${error.message}`);

        console.log("✅ Cập nhật tài liệu thành công:", data);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Lỗi updateDocument:", error.message);
        return { success: false, message: error.message };
    }
};

export const deleteTags = async (document_id) => {
    try {
        if (!document_id) throw new Error("Thiếu dữ liệu đầu vào");

        const { error } = await supabase
            .from("document")
            .delete()
            .eq("document_id", document_id);

        if (error) throw new Error(`Lỗi từ DB: ${error.message}`);

        console.log(`✅ Xóa tài liệu thành công: ${document_id}`);
        return { success: true, message: "Xóa thành công" };
    } catch (error) {
        console.error("❌ Lỗi deleteDocument:", error.message);
        return { success: false, message: error.message };
    }
};

export const getOrCreateTagId = async ({ tagName }) => {
  const { data: existTag } = await supabase
    .from('tags')
    .select('tag_id')
    .eq('tag_name', tagName)
    .single() // chỉ lấy 1 dòng nếu có

  if (existTag) return existTag.tag_id

  const { data: newTag, error } = await supabase
    .from('tags')
    .insert({ tag_name: tagName }) // phải truyền đúng định dạng object
    .select('tag_id')

  if (error) throw error

  return newTag[0].tag_id
}

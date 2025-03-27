import { supabase } from "../config/supabaseClient.js";

//document_tags_api(document_id, tag_id)
export const createDocumentTags = async ({ document_id, tag_id }) => {
    try {
        // 🔹 1. Kiểm tra đầu vào
        if (!document_id || !tag_id ) {
            throw new Error("Thiếu dữ liệu đầu vào");
        }

        // 🔹 2. Gọi API tương tác với database 
        const { data, error } = await supabase
            .from("document_tags")
            .insert([{ document_id, tag_id }])
            .select()
            .single();

        // 🔹 3. Kiểm tra lỗi từ database
        if (error) throw new Error(`Lỗi từ DB: ${error.message}`);

        // 🔹 4. Log và trả về kết quả nếu thành công
        console.log("✅ Tạo tài liệu thành công:", data);
        return { success: true, data };
    } catch (error) {
        // 🔹 5. Bắt lỗi, log lỗi và trả về response phù hợp
        console.error("❌ Lỗi createDocumentTags:", error.message);
        return { success: false, message: error.message };
    }
};

export const getDocumentByTagId = async (tag_id) => {
    try {
        if (!tag_id) throw new Error("Thiếu dữ liệu đầu vào");

        const { data, error } = await supabase
            .from("document")
            .select("*")
            .eq("tag_id", tag_id)
            .single();

        if (error) throw new Error(`Lỗi từ DB: ${error.message}`);

        console.log("✅ Lấy tài liệu thành công:", data);
        return { success: true, data };
    } catch (error) {
        console.error("❌ Lỗi getDocumentById:", error.message);
        return { success: false, message: error.message };
    }
};

export const getTagByDocumentId = async (document_id) => {
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

export const updateDocumentTags = async (document_id, updates) => {
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

export const deleteDocumentTags = async (document_id) => {
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
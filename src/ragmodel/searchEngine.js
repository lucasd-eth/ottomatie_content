import { supabase } from "../config/supabaseClient.js";
import { generateEmbedding } from "./embedding.js";

export async function searchSimilarDocuments(query) {
    try {
      const queryEmbedding = await generateEmbedding(query);
  
      const { data, error } = await supabase.rpc('match_documents', {
        query_embedding: queryEmbedding,
        match_threshold: 0.8,
        match_count: 5
      });
  
      if (error) {
        console.error("❌ Lỗi Supabase RPC:", error.message);
        return []; // ⛑ Trả về mảng rỗng nếu lỗi
      }
  
      return data || []; // ⛑ Nếu `data` là null thì vẫn trả về []
    } catch (err) {
      console.error("❌ Lỗi searchSimilarDocuments:", err.message);
      return []; // ⛑ Trả về mảng rỗng nếu lỗi
    }
  }
  

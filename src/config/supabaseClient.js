import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load biến môi trường từ .env
dotenv.config();

// Kết nối với Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export { supabase };
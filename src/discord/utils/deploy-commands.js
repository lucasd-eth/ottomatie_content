import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const commandsPath = path.join(__dirname, '../commands');

const commands = [];

async function loadCommands() {
    const files = fs.readdirSync(commandsPath);
    for (const file of files) {
      if (file.endsWith(".js")) {
        try {
          const { default: command } = await import(`../commands/${file}`);
  
          // Bỏ qua nếu không enabled hoặc thiếu .data
          if (!command.enabled) {
            console.log(`⏭️ Bỏ qua (disabled): ${file}`);
            continue;
          }
  
          if (!command.data || typeof command.data.toJSON !== 'function') {
            console.warn(`⚠️ Thiếu .data hợp lệ trong: ${file}`);
            continue;
          }
  
          commands.push(command.data.toJSON());
          console.log(`✅ Loaded: ${command.data.name}`);
        } catch (err) {
          console.error(`❌ Lỗi khi load file ${file}: ${err.message}`);
        }
      }
    }
  }  


async function deploy() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("🗑️ Xóa tất cả lệnh cũ...");
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: [] });
    await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });

    await loadCommands();

    console.log("🔄 Đang cập nhật lệnh mới...");
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands });

    console.log("✅ Đã cập nhật lệnh thành công!");
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật lệnh:", error);
  }
}

deploy();

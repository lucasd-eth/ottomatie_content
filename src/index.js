import { Client, Collection, GatewayIntentBits, Events } from 'discord.js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

// 📍 Lấy đường dẫn hiện tại (__dirname)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 🚀 Tạo bot client với quyền cơ bản
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// 📁 Khởi tạo bộ sưu tập các command (slash)
client.commands = new Collection();

// 📂 Load tất cả command từ thư mục commands/
const commandsPath = path.join(__dirname, 'discord/commands');
for (const file of fs.readdirSync(commandsPath)) {
  if (!file.endsWith('.js')) continue; // Chỉ load file .js

  // Dùng import động cho ESM
  const commandModule = await import(`./discord/commands/${file}`);
const command = commandModule.default;

if (!command?.data?.name) {
  console.warn(`⚠️ Không tìm thấy 'data.name' trong file: ${file}`);
  continue;
}

client.commands.set(command.data.name, command);

}

// 📁 Khởi tạo Map cho các modal submit handler
const modals = new Map();

// 📂 Load tất cả modal từ thư mục modals/
const modalsPath = path.join(__dirname, 'discord/modals');
for (const file of fs.readdirSync(modalsPath)) {
  if (!file.endsWith('.js')) continue;

  const modal = (await import(`./discord/modals/${file}`)).default;
  modals.set(modal.customId, modal);
}

// ✅ Khi bot online
client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot đã sẵn sàng: ${client.user.tag}`);

  // 🔍 Kiểm tra trạng thái các lệnh (Global + Guild)
  const globalCommands = await client.application.commands.fetch();
  console.log("🌍 Lệnh Global:", globalCommands.map(cmd => cmd.name).join(", ") || "Không có");

  const guild = client.guilds.cache.get(process.env.GUILD_ID);
  if (guild) {
    const guildCommands = await guild.commands.fetch();
    console.log("🏠 Lệnh trong Guild:", guildCommands.map(cmd => cmd.name).join(", ") || "Không có");
  } else {
    console.log("⚠️ Không tìm thấy Guild!");
  }
});

// 📦 Xử lý các interaction gửi đến bot
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction);
  } else if (interaction.isModalSubmit()) {
    const modal = modals.get(interaction.customId);
    if (modal) await modal.execute(interaction);
  }
});

// 🔐 Đăng nhập bot bằng token
client.login(process.env.DISCORD_TOKEN);

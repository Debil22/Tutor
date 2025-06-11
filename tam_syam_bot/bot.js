// bot.js
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
	console.error("Токен не задан! Проверьте переменную TELEGRAM_BOT_TOKEN.");
	process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

module.exports = bot;

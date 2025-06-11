require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
	console.error("Токен не задан! Проверьте переменную TELEGRAM_BOT_TOKEN.");
	process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

// Обработка ошибок polling
bot.on("polling_error", (error) => {
	console.error("Polling error:", error);
});

// Обработка команд
bot.onText(/\/start/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, "Привет! Я простой Telegram-бот.");
});
bot.onText(/\/menu/, (msg) => {
	const chatId = msg.chat.id;
	bot.sendMessage(chatId, "The fuck?");
});

// Обработка команды /photo
bot.onText(/\/photo/, (msg) => {
	const chatId = msg.chat.id;

	// Можно отправить изображение по URL
	const photoUrl =
		"https://i.pinimg.com/originals/74/10/c6/7410c639e7206f75f45d6fcc719a0a54.jpg";

	// Или из файла (локально)
	// const photoPath = './path/to/image.jpg';

	// Отправка по URL
	bot.sendPhoto(chatId, photoUrl, { caption: "Вот картинка!" });

	// Или из файла (раскомментировать)
	// bot.sendPhoto(chatId, photoPath, { caption: 'Вот картинка!' });
});

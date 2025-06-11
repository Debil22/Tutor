// index.js
const bot = require("./bot");
const { loadImages, getRandomImage } = require("./images");

// Инициализация команд
bot.setMyCommands([
	{ command: "start", description: "Начать работу" },
	{ command: "menu", description: "Ну типа" },
	{ command: "photo", description: "Пепе" },
]);

// Обработка ошибок polling
bot.on("polling_error", (error) => {
	console.error("Polling error:", error);
});

// Обработка команд /start и /menu
bot.onText(/\/start/, (msg) => {
	bot.sendMessage(msg.chat.id, "Привет! Я простой Telegram-бот.");
});

bot.onText(/\/menu/, (msg) => {
	bot.sendMessage(msg.chat.id, "Ну типа");
});

// Загрузка изображений при старте
(async () => {
	await loadImages();

	// После загрузки можно установить обработчик /photo
	bot.onText(/\/photo/, (msg) => {
		const chatId = msg.chat.id;
		const image = getRandomImage();

		if (!image) {
			bot.sendMessage(chatId, "Изображения еще не загружены или их нет.");
			return;
		}

		bot.sendPhoto(chatId, image.buffer, {
			filename: image.filename,
			contentType: image.mimeType,
		});
	});
})();

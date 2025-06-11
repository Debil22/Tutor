require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const TelegramBot = require("node-telegram-bot-api");
const cron = require("node-cron");

// Ваш токен бота
const token = "6081854979:AAE57Xtn1U7Jkzq0EfAwl3p6ODDGheFW2K8";

// ID вашего канала (замените на свой)
const chatId = "-1001408015398"; // <-- вставьте сюда ваш chat_id канала

const bot = new TelegramBot(token);

// URL раздела Latest News на ign.com
const NEWS_URL = "https://www.ign.com/news";

// Функция для парсинга относительного времени
function parseRelativeTime(text) {
	const match = text.match(/(\d+)\s*([smhd])\s*ago/);
	if (!match) return null;

	const value = parseInt(match[1], 10);
	const unit = match[2];

	switch (unit) {
		case "s": // секунды
			return Date.now() - value * 1000;
		case "m": // минуты
			return Date.now() - value * 60 * 1000;
		case "h": // часы
			return Date.now() - value * 60 * 60 * 1000;
		case "d": // дни
			return Date.now() - value * 24 * 60 * 60 * 1000;
		default:
			return null;
	}
}

// Функция получения свежих новостей
async function fetchLatestNews() {
	try {
		const response = await axios.get(NEWS_URL);
		const html = response.data;
		const $ = cheerio.load(html);

		const now = Date.now();

		const newsItems = [];

		// Анализируем структуру страницы и выбираем новости
		$(".list-item").each((i, elem) => {
			const title = $(elem).find('[data-cy="item-title"]').text().trim();
			const link = $(elem).find("a").attr("href");

			const subtitleText = $(elem)
				.find('[data-cy="item-subtitle"]')
				.text()
				.trim();

			let pubTimestamp;

			// Попытка парсить относительное время вида "24m ago"
			if (subtitleText) {
				pubTimestamp = parseRelativeTime(subtitleText);
			}

			if (pubTimestamp) {
				if (pubTimestamp > now - 60 * 60 * 1000 && pubTimestamp <= now) {
					newsItems.push({ title, link });
				}
			}
		});

		return newsItems;
	} catch (err) {
		console.error("Ошибка при получении новостей:", err);
		return [];
	}
}

// Создаем краткую выжимку
function createSummary(newsItems) {
	if (!newsItems.length) return "Нет новых новостей за последний час.";
	let summary = "Последние новости за последний час:\n\n";
	newsItems.forEach((item, index) => {
		summary += `${index + 1}. ${item.title}\n${item.link}\n\n`;
	});
	return summary;
}

// Основная функция запускающая сбор и отправку
async function run() {
	const news = await fetchLatestNews();
	const message = createSummary(news);
	bot.sendMessage(chatId, message);
}

// Запускаем раз в час по расписанию
cron.schedule("0 * * * *", () => {
	console.log("Запуск сбора новостей...");
	run();
});

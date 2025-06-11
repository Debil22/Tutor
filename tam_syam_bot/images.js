// images.js
const fs = require("fs").promises;
const path = require("path");
const mime = require("mime-types");

const imagesDir = path.join(__dirname, "images");
let imagesCache = [];

/**
 * Загружает все изображения из папки в память.
 */
async function loadImages() {
	try {
		const files = await fs.readdir(imagesDir);
		const imageFiles = files.filter((file) =>
			/\.(jpg|jpeg|png|gif)$/i.test(file)
		);

		const results = await Promise.all(
			imageFiles.map(async (file) => {
				const filePath = path.join(imagesDir, file);
				const data = await fs.readFile(filePath);
				const mimeType = mime.lookup(filePath) || "application/octet-stream";

				return {
					buffer: data,
					filename: path.basename(filePath),
					mimeType,
				};
			})
		);

		imagesCache = results;
		console.log(`Загружено ${imagesCache.length} изображений в память`);
	} catch (err) {
		console.error("Ошибка загрузки изображений:", err);
	}
}

/**
 * Возвращает случайное изображение из кэша.
 */
function getRandomImage() {
	if (imagesCache.length === 0) return null;
	return imagesCache[Math.floor(Math.random() * imagesCache.length)];
}

module.exports = { loadImages, getRandomImage };

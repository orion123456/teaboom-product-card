// Генерирует адаптивные версии фото товара: npm run images
// WebP для такой мелкой текстуры почти не выигрывает у JPEG, поэтому AVIF + JPEG как fallback
import { mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const SOURCE_DIR = 'images-source';
const OUTPUT_DIR = 'src/assets/images';
// 160 — миниатюры, 480 — мобильные, 970 — десктоп и полноэкранный просмотр
const WIDTHS = [160, 480, 970];

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });

const files = (await readdir(SOURCE_DIR)).filter((file) => /\.(jpe?g|png)$/i.test(file));

for (const file of files) {
  const name = path.parse(file).name;
  const image = sharp(path.join(SOURCE_DIR, file));
  const { width: sourceWidth } = await image.metadata();
  // Не увеличиваем исходник: в имени файла всегда реальная ширина
  const widths = [...new Set(WIDTHS.map((width) => Math.min(width, sourceWidth)))];

  for (const width of widths) {
    const resized = image.clone().resize({ width });

    await resized.clone().jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(OUTPUT_DIR, `${name}-${width}.jpg`));
    await resized.clone().avif({ quality: 50, effort: 6 }).toFile(path.join(OUTPUT_DIR, `${name}-${width}.avif`));
  }

  console.log(`✓ ${file}: ${widths.join(', ')}`);
}

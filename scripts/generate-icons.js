import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

async function generate() {
  const svgBuffer = fs.readFileSync(path.resolve('./public/icon.svg'));

  await sharp(svgBuffer).resize(192, 192).png().toFile('./public/pwa-192x192.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile('./public/pwa-512x512.png');
  await sharp(svgBuffer).resize(180, 180).png().toFile('./public/apple-touch-icon.png');
  await sharp(svgBuffer).resize(512, 512).png().toFile('./public/pwa-maskable-512x512.png');
  await sharp(svgBuffer).resize(64, 64).png().toFile('./public/favicon.png');

  console.log('Icons generated successfully!');
}

generate().catch(console.error);

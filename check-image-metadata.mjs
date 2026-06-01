import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function checkMetadata() {
  const dir = 'C:/Users/nicol/.gemini/antigravity-ide/brain/6c529ff9-ad38-484b-8747-99eda69fd7db';
  const files = fs.readdirSync(dir);
  for (const file of files) {
    if (file.startsWith('media__') && (file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg'))) {
      const filePath = path.join(dir, file);
      try {
        const metadata = await sharp(filePath).metadata();
        console.log(`File: ${file}`);
        console.log(`  Format: ${metadata.format}`);
        console.log(`  Width: ${metadata.width}, Height: ${metadata.height}`);
        console.log(`  Channels: ${metadata.channels}`);
      } catch (err) {
        console.error(`Error reading ${file}:`, err.message);
      }
    }
  }
}

checkMetadata();

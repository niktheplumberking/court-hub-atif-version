import sharp from 'sharp';

async function checkBackground(filename) {
  try {
    const filePath = `public/images/${filename}`;
    const { data, info } = await sharp(filePath)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    console.log(`\nFile: ${filename}`);
    console.log(`  Width: ${info.width}, Height: ${info.height}`);
    
    // Check first 10 pixels
    console.log("  First 10 pixels RGB values:");
    for (let i = 0; i < 10; i++) {
      const idx = i * info.channels;
      console.log(`    Pixel ${i}: RGB(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`);
    }
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
  }
}

async function run() {
  await checkBackground('premium_padel_racket_stealth_blue_1779706040552.webp');
  await checkBackground('premium_padel_racket_black_lime_1779706021226.webp');
}

run();

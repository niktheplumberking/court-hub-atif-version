import sharp from 'sharp';

async function checkBackground(filename) {
  try {
    const filePath = `C:/Users/nicol/.gemini/antigravity-ide/brain/6c529ff9-ad38-484b-8747-99eda69fd7db/${filename}`;
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
  await checkBackground('media__1780010992341.png');
  await checkBackground('media__1780011686139.png');
}

run();

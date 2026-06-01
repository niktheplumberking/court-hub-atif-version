import sharp from 'sharp';

async function checkBorders(filename) {
  try {
    const filePath = `C:/Users/nicol/.gemini/antigravity-ide/brain/6c529ff9-ad38-484b-8747-99eda69fd7db/${filename}`;
    const { data, info } = await sharp(filePath)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    console.log(`\nFile: ${filename} (${info.width}x${info.height})`);
    
    // Check top-left, top-right, bottom-left, bottom-right
    const getPixel = (x, y) => {
      const idx = (y * info.width + x) * info.channels;
      return `RGB(${data[idx]}, ${data[idx+1]}, ${data[idx+2]})`;
    };
    
    console.log(`  Top-Left (0,0): ${getPixel(0, 0)}`);
    console.log(`  Top-Right (${info.width-1},0): ${getPixel(info.width-1, 0)}`);
    console.log(`  Bottom-Left (0,${info.height-1}): ${getPixel(0, info.height-1)}`);
    console.log(`  Bottom-Right (${info.width-1},${info.height-1}): ${getPixel(info.width-1, info.height-1)}`);
    console.log(`  Center (${Math.floor(info.width/2)},${Math.floor(info.height/2)}): ${getPixel(Math.floor(info.width/2), Math.floor(info.height/2))}`);
  } catch (err) {
    console.error(`Error reading ${filename}:`, err.message);
  }
}

async function run() {
  await checkBorders('media__1780015110919.jpg');
  await checkBorders('media__1780015393036.jpg');
}

run();

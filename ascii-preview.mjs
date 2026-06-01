import sharp from 'sharp';

async function run() {
  try {
    const filePath = 'C:/Users/nicol/.gemini/antigravity-ide/brain/6c529ff9-ad38-484b-8747-99eda69fd7db/media__1780010992341.png';
    const width = 80;
    const height = 30;

    const { data, info } = await sharp(filePath)
      .resize(width, height, { fit: 'fill' })
      .raw()
      .toBuffer({ resolveWithObject: true });

    let ascii = '';
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * info.channels;
        const r = data[idx];
        const g = data[idx+1];
        const b = data[idx+2];
        
        // If it's a shade of blue, print space or dot, otherwise print char
        const isBlue = (b > 150 && r < 100);
        const isWhite = (r > 200 && g > 200 && b > 200);
        
        if (isBlue) {
          ascii += '.';
        } else if (isWhite) {
          ascii += 'W';
        } else {
          ascii += '#';
        }
      }
      ascii += '\n';
    }
    console.log(ascii);
  } catch (err) {
    console.error(err);
  }
}

run();

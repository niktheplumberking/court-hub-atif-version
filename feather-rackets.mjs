import sharp from 'sharp';

async function cutBackgroundSmooth(filename, outputName, refColor, minThreshold, maxThreshold) {
  try {
    const filePath = `public/images/${filename}`;
    const image = sharp(filePath);
    const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

    const [refR, refG, refB] = refColor;
    console.log(`\nProcessing ${filename}:`);
    console.log(`Reference background color: RGB(${refR}, ${refG}, ${refB})`);

    const outBuffer = Buffer.alloc(info.width * info.height * 4);

    let transparentCount = 0;
    let semiTransparentCount = 0;
    let opaqueCount = 0;

    for (let i = 0; i < info.width * info.height; i++) {
      const idx3 = i * info.channels;
      const idx4 = i * 4;

      const r = data[idx3];
      const g = data[idx3 + 1];
      const b = data[idx3 + 2];

      // Euclidean color distance
      const dist = Math.sqrt(
        Math.pow(r - refR, 2) +
        Math.pow(g - refG, 2) +
        Math.pow(b - refB, 2)
      );

      let alpha = 255;
      if (dist < minThreshold) {
        alpha = 0;
        transparentCount++;
      } else if (dist > maxThreshold) {
        alpha = 255;
        opaqueCount++;
      } else {
        // Interpolate smoothly
        alpha = Math.round(255 * (dist - minThreshold) / (maxThreshold - minThreshold));
        semiTransparentCount++;
      }

      outBuffer[idx4] = r;
      outBuffer[idx4 + 1] = g;
      outBuffer[idx4 + 2] = b;
      outBuffer[idx4 + 3] = alpha;
    }

    console.log(`  Transparent: ${transparentCount}, Semi-transparent: ${semiTransparentCount}, Opaque: ${opaqueCount}`);

    await sharp(outBuffer, {
      raw: {
        width: info.width,
        height: info.height,
        channels: 4
      }
    })
    .webp({ quality: 100 })
    .toFile(`public/images/${outputName}`);

    console.log(`  Saved smoothed transparent WebP to public/images/${outputName}`);
  } catch (err) {
    console.error(`Error processing ${filename}:`, err);
  }
}

async function run() {
  // Green racket: ref color [6, 11, 11], threshold range [12, 32]
  await cutBackgroundSmooth(
    'premium_padel_racket_black_lime_1779706021226.webp',
    'racket_lime_nobg.webp',
    [6, 11, 11],
    12,
    32
  );

  // Blue racket: ref color [3, 3, 3], threshold range [10, 28]
  await cutBackgroundSmooth(
    'premium_padel_racket_stealth_blue_1779706040552.webp',
    'racket_blue_nobg.webp',
    [3, 3, 3],
    10,
    28
  );
}

run();

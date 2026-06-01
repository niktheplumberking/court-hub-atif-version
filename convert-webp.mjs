import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = 'src/assets/images';

async function convertImages() {
  try {
    const files = await fs.promises.readdir(directoryPath);
    
    for (const file of files) {
      if (file.endsWith('.png') && !file.startsWith('hero_')) {
        const filePath = path.join(directoryPath, file);
        const newFilePath = path.join(directoryPath, file.replace('.png', '.webp'));
        
        console.log(`Converting ${file} to WebP...`);
        
        await sharp(filePath)
          .webp({ quality: 80 })
          .toFile(newFilePath);
          
        console.log(`Successfully converted ${file} to WebP. Deleting original...`);
        await fs.promises.unlink(filePath);
      }
    }
    
    console.log('Conversion complete!');
  } catch (err) {
    console.error('Error occurred:', err);
  }
}

convertImages();

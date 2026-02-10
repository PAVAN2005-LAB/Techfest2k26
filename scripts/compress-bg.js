// Convert background GIF to animated WebP (keeps animation!)
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, '..', 'public', 'images', 'giphy-downsized-large.gif');
const outputPath = path.join(__dirname, '..', 'public', 'images', 'bg-animated.webp');

async function compress() {
    try {
        const inputStats = fs.statSync(inputPath);
        console.log('Original GIF size:', (inputStats.size / 1024 / 1024).toFixed(2), 'MB');

        // Convert GIF to animated WebP (keeps all frames!)
        await sharp(inputPath, { animated: true })
            .webp({ quality: 60, effort: 6 })
            .toFile(outputPath);

        const outputStats = fs.statSync(outputPath);
        console.log('Animated WebP size:', (outputStats.size / 1024 / 1024).toFixed(2), 'MB');
        console.log('Savings:', ((1 - outputStats.size / inputStats.size) * 100).toFixed(1) + '%');
        console.log('\nDone! File saved to:', outputPath);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

compress();

/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Install @ffmpeg-installer/ffmpeg if not already installed
const checkAndInstallFFmpeg = () => {
  try {
    require.resolve('@ffmpeg-installer/ffmpeg');
  } catch (err) {
    execSync('npm install --no-audit --no-fund --save-dev @ffmpeg-installer/ffmpeg', { stdio: 'inherit' });
  }
};

checkAndInstallFFmpeg();

const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const ffmpegPath = ffmpegInstaller.path;

// Directories
const musicDir = path.join(__dirname, '../public/music');
const tempDir = path.join(musicDir, 'temp_compressed');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Read music files
const files = fs.readdirSync(musicDir);
const mp3Files = files.filter(file => file.endsWith('.mp3'));

console.log(`Found ${mp3Files.length} music files to compress...`);

mp3Files.forEach(file => {
  const inputPath = path.join(musicDir, file);
  const tempOutputPath = path.join(tempDir, file);

  try {
    const originalSize = (fs.statSync(inputPath).size / (1024 * 1024)).toFixed(2);
    console.log(`Compressing ${file} (Original Size: ${originalSize} MB)...`);

    // Compress to 96kbps, 44.1kHz stereo, strip cover art (-vn), and cut to 30 seconds (-t 30) for fast preview
    const command = `"${ffmpegPath}" -y -i "${inputPath}" -vn -codec:a libmp3lame -b:a 96k -ar 44100 -t 30 "${tempOutputPath}"`;
    execSync(command, { stdio: 'inherit' });

    // Replace original file with compressed file
    fs.copyFileSync(tempOutputPath, inputPath);
    fs.unlinkSync(tempOutputPath);

    const compressedSize = (fs.statSync(inputPath).size / (1024 * 1024)).toFixed(2);
    console.log(`✓ Successfully compressed ${file} to ${compressedSize} MB`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});

// Clean up temp directory
try {
  fs.rmdirSync(tempDir);
} catch (e) {}

console.log('All music files processed successfully!');

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
const videoDir = path.join(__dirname, '../public/video');
const previewDir = path.join(videoDir, 'previews');

if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

// Read videos
const files = fs.readdirSync(videoDir);
const mp4Files = files.filter(file => file.endsWith('.mp4'));

mp4Files.forEach(file => {
  const inputPath = path.join(videoDir, file);
  const outputPath = path.join(previewDir, `preview-${file}`);


  
  try {
    // Cut 15 seconds starting from 1.0 second, remove audio, scale width to 480px, compress heavily
    const command = `"${ffmpegPath}" -y -ss 00:00:01 -i "${inputPath}" -t 15 -vf "scale=480:-2" -an -vcodec libx264 -crf 28 "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});



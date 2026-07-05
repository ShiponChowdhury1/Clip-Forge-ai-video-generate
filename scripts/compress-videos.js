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
  const outputPath = path.join(previewDir, `preview-${file.replace('.mp4', '.webp')}`);

  try {
    // Convert to animated webp, cut 10 seconds, scale to 320px width, 12 fps, loop infinitely
    const command = `"${ffmpegPath}" -y -ss 00:00:01 -t 10 -i "${inputPath}" -vf "scale=320:-2,fps=12" -loop 0 -vcodec libwebp -quality 60 "${outputPath}"`;
    execSync(command, { stdio: 'inherit' });
    console.log(`✓ Created webp preview: preview-${file.replace('.mp4', '.webp')}`);
  } catch (error) {
    console.error(`✗ Error processing ${file}:`, error.message);
  }
});



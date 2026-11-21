import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const svgPath = path.resolve(publicDir, 'favicon.svg');

async function generateIcons() {
  if (!fs.existsSync(svgPath)) {
    console.error('favicon.svg not found at', svgPath);
    process.exit(1);
  }

  const svgBuffer = fs.readFileSync(svgPath);

  // 1. 192x192 Standard PNG
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-192x192.png'));
  console.log('✓ Created pwa-192x192.png');

  // 2. 512x512 Standard PNG
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.resolve(publicDir, 'pwa-512x512.png'));
  console.log('✓ Created pwa-512x512.png');

  // 3. 180x180 Apple Touch Icon (iOS Safari compliant PNG)
  await sharp(svgBuffer)
    .resize(180, 180)
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(path.resolve(publicDir, 'apple-touch-icon.png'));
  console.log('✓ Created apple-touch-icon.png');

  // 4. 512x512 Maskable Icon with 15% safe-zone margin (Android compliant)
  const innerSize = Math.round(512 * 0.75); // 384px inside 512px
  const innerBuffer = await sharp(svgBuffer).resize(innerSize, innerSize).toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 36, g: 89, b: 52, alpha: 1 } // #245934 Acacia Green
    }
  })
    .composite([{ input: innerBuffer, gravity: 'center' }])
    .png()
    .toFile(path.resolve(publicDir, 'pwa-maskable-512x512.png'));
  console.log('✓ Created pwa-maskable-512x512.png');

  // 5. 1200x630 OpenGraph / Twitter Social Share Card
  const logoOgSize = 360;
  const logoOgBuffer = await sharp(svgBuffer).resize(logoOgSize, logoOgSize).toBuffer();
  const ogSvgBanner = Buffer.from(`
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#081810" />
          <stop offset="50%" stop-color="#1b4327" />
          <stop offset="100%" stop-color="#051009" />
        </linearGradient>
      </defs>
      <rect width="1200" height="630" fill="url(#bgGrad)" />
      <text x="560" y="240" fill="#eec149" font-family="Outfit, sans-serif" font-size="52" font-weight="900">Mind Bridge</text>
      <text x="560" y="300" fill="#ffffff" font-family="Outfit, sans-serif" font-size="28" font-weight="700">ASYV Psychosocial Support Platform</text>
      <text x="560" y="350" fill="#a7f3d0" font-family="Plus Jakarta Sans, sans-serif" font-size="20">Official Care Network · Ingabe · Ingabo · Ijabo</text>
      <text x="560" y="420" fill="#f59e0b" font-family="Plus Jakarta Sans, sans-serif" font-size="16" font-weight="600">Confidential Counseling · Mood Tracking · Peer Mentors · Village Hotline</text>
      <text x="560" y="520" fill="#94a3b8" font-family="Plus Jakarta Sans, sans-serif" font-size="16">Agahozo-Shalom Youth Village, Rwanda</text>
    </svg>
  `);

  await sharp(ogSvgBanner)
    .composite([{ input: logoOgBuffer, left: 100, top: 135 }])
    .png()
    .toFile(path.resolve(publicDir, 'og-image.png'));
  console.log('✓ Created og-image.png (1200x630)');

  console.log('All icons generated successfully!');
}

generateIcons().catch(err => {
  console.error(err);
  process.exit(1);
});

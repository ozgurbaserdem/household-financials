# Public Assets Structure

This directory contains all public assets for the Budgetkollen financial calculator.

## Naming Conventions

### Favicons & App Icons
- `favicon.ico` - Multi-resolution ICO (16x16, 32x32, 48x48, 64x64, 128x128, 256x256)
- `favicon-{size}x{size}.png` - PNG favicons for specific sizes
- `favicon.svg` - Scalable vector favicon
- `apple-touch-icon.png` - 180x180 PNG for iOS devices
- `icon-{size}x{size}.png` - PWA icons for manifest.json

### OpenGraph & Social Media Images
- `og-image.png` - Main OpenGraph image (1200x630)
- `einstein-optimized.png` - Compound interest calculator specific OG image

### Screenshots
- `screenshots/` - App screenshots for documentation
  - `budget-wizard.png` - Budget wizard interface
  - `budget-results.png` - Results page
  - `compound-interest.png` - Compound interest calculator

## Image Guidelines

1. **Favicons**: Always generate from `favicon.svg` using the provided scripts
2. **OpenGraph Images**: Should be 1200x630px for optimal display
3. **Screenshots**: Use descriptive kebab-case names
4. **File formats**: 
   - Use PNG for icons and screenshots
   - Use SVG for scalable graphics
   - ICO only for favicon.ico

## Maintenance

All favicons have been generated and optimized. If you need to regenerate them:
1. Install image processing tools: `npm install --save-dev sharp png-to-ico`
2. Create generation scripts or use online tools like realfavicongenerator.net
3. Ensure the multi-resolution favicon.ico contains at least 16x16, 32x32, and 48x48 sizes
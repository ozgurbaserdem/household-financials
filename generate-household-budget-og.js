import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateHouseholdBudgetOGImage() {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport to exact OG image dimensions
    await page.setViewport({
      width: 1200,
      height: 630,
      deviceScaleFactor: 2, // For crisp rendering
    });

    // Read the HTML file
    const htmlPath = path.join(__dirname, 'household-budget-og-generator.html');
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });

    // Wait a bit for fonts to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Take PNG screenshot
    const pngPath = path.join(__dirname, 'public', 'household-budget-og.png');
    await page.screenshot({
      path: pngPath,
      width: 1200,
      height: 630,
      type: 'png',
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
      },
    });

    // Generate SVG version by getting the HTML content and wrapping it in SVG
    const svgContent = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <foreignObject width="1200" height="630">
        <div xmlns="http://www.w3.org/1999/xhtml">
          ${htmlContent.replace(/<html[^>]*>|<\/html>|<head[^>]*>.*?<\/head>|<body[^>]*>|<\/body>/gs, "")}
        </div>
      </foreignObject>
    </svg>`;

    const svgPath = path.join(__dirname, 'public', 'household-budget-og.svg');
    fs.writeFileSync(svgPath, svgContent);

    console.log(`✅ Household Budget OpenGraph images generated:`);
    console.log(`   PNG: ${pngPath}`);
    console.log(`   SVG: ${svgPath}`);
    
  } catch (error) {
    console.error("❌ Error generating image:", error);
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is available, if not provide instructions
async function main() {
  try {
    await generateHouseholdBudgetOGImage();
  } catch (error) {
    if (error.message.includes("puppeteer")) {
      console.log("📦 Installing puppeteer...");
      console.log("Run: npm install puppeteer");
      console.log("Then run: node generate-household-budget-og.js");
    } else {
      console.error("Error:", error);
    }
  }
}

main();
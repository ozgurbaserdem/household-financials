import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import puppeteer from "puppeteer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateOGImage = async () => {
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
      deviceScaleFactor: 1, // Correct dimensions without doubling
    });

    // Read the HTML file
    const htmlPath = path.join(__dirname, "og-generator.html");
    const htmlContent = fs.readFileSync(htmlPath, "utf8");

    // Set the HTML content
    await page.setContent(htmlContent, {
      waitUntil: "networkidle0",
    });

    // Wait a bit for fonts to load
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Take PNG screenshot
    const pngPath = path.join(__dirname, "public", "og-image.png");
    await page.screenshot({
      path: pngPath,
      width: 1200,
      height: 630,
      type: "png",
      clip: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
      },
    });

    console.log(`✅ OpenGraph image generated:`);
    console.log(`   PNG: ${pngPath}`);
  } catch (error) {
    console.error("❌ Error generating image:", error);
  } finally {
    await browser.close();
  }
};

// Check if puppeteer is available, if not provide instructions
const main = async () => {
  try {
    await generateOGImage();
  } catch (error) {
    if (error.message.includes("puppeteer")) {
      console.log("📦 Installing puppeteer...");
      console.log("Run: npm install puppeteer");
      console.log("Then run: node generate-og-image.js");
    } else {
      console.error("Error:", error);
    }
  }
};

main();

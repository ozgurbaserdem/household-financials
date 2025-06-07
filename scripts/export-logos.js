import { chromium } from "playwright";

const exportLogos = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Set viewport for consistent sizing
  await page.setViewportSize({ width: 800, height: 600 });

  // Create HTML content with all logo variants
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    </head>
    <body class="bg-transparent">
      <div id="b-check" class="inline-block">
        <div class="relative inline-flex items-center">
          <div class="h-16 aspect-square bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
            <span class="text-4xl font-bold text-white">B</span>
          </div>
          <div class="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-md">
            <i data-lucide="check" class="w-4 h-4 text-white"></i>
          </div>
        </div>
      </div>
      
      <div id="text-check" class="inline-block">
        <div class="flex items-center">
          <span class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">Budgetk</span>
          <div class="mx-1 bg-green-500 rounded-full p-1">
            <i data-lucide="check" class="w-3 h-3 text-white"></i>
          </div>
          <span class="text-4xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 bg-clip-text text-transparent">llen</span>
        </div>
      </div>
      
      <script>lucide.createIcons();</script>
    </body>
    </html>
  `;

  await page.setContent(html);
  await page.waitForLoadState("domcontentloaded");

  // Take high-resolution screenshots with transparent background
  await page.locator("#b-check").screenshot({
    path: "public/b-check-logo.png",
    scale: "device",
    animations: "disabled",
    omitBackground: true,
  });

  await page.locator("#text-check").screenshot({
    path: "public/text-check-logo.png",
    scale: "device",
    animations: "disabled",
    omitBackground: true,
  });

  await browser.close();
  console.log("Logos exported to public/ directory");
};

exportLogos().catch(console.error);

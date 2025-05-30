/**
 * Skatteverket API Processor - CommonJS version för Next.js projekt
 * Skapar ren JSON med endast: kommunNamn, kommunalSkatt, kyrkoSkatt, summaInklKyrka
 */

const fs = require("fs");

const SKATTEVERKET_API_URL =
  "https://skatteverket.entryscape.net/rowstore/dataset/c67b320b-ffee-4876-b073-dd9236cd2a99";

async function fetchTaxData() {
  try {
    console.log("Hämtar data för 2025 från Skatteverkets API...");

    // Använd dynamic import för fetch i Node.js
    const fetch = (await import("node-fetch")).default;

    let allData = [];
    let offset = 0;
    const limit = 100;
    let hasMoreData = true;

    while (hasMoreData) {
      console.log(
        `Hämtar batch ${Math.floor(offset / limit) + 1} (offset: ${offset})`
      );

      // Filtrera direkt för 2025 i API-anropet
      const url = `${SKATTEVERKET_API_URL}?_offset=${offset}&_limit=${limit}&år=2025`;

      try {
        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": "TaxCalculator/1.0",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} för ${url}`);
        }

        const data = await response.json();

        console.log(
          `API Response - resultCount: ${data.resultCount}, offset: ${data.offset}, limit: ${data.limit}`
        );

        // Hantera API-strukturen
        let batchData = [];
        if (data.results && Array.isArray(data.results)) {
          batchData = data.results;
        } else {
          console.log("Okänd API-struktur:", Object.keys(data));
          break;
        }

        console.log(`Batch innehåller ${batchData.length} rader`);

        if (batchData.length === 0) {
          console.log("Tom batch, avslutar");
          hasMoreData = false;
          break;
        }

        allData = allData.concat(batchData);

        // Kontrollera om det finns mer data
        if (allData.length >= data.resultCount) {
          console.log(`✅ Alla ${data.resultCount} rader för 2025 hämtade`);
          hasMoreData = false;
        } else if (batchData.length < limit) {
          console.log("Sista batch hämtad (mindre än limit)");
          hasMoreData = false;
        } else {
          offset += limit;
          console.log(
            `📊 Hämtat ${allData.length}/${data.resultCount} rader så här långt...`
          );

          // Säkerhetskontroll
          if (offset > data.resultCount + 100) {
            console.log("🛑 Säkerhetsgräns nådd");
            hasMoreData = false;
          }
        }

        // Kort paus mellan anrop
        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (err) {
        console.error(`Fel vid hämtning av batch ${offset}:`, err.message);
        hasMoreData = false;
      }
    }

    console.log(
      `\n🎉 Totalt hämtade ${allData.length} rader för 2025 från API:et`
    );

    // Visa sample av första raden för debugging
    if (allData.length > 0) {
      console.log("Sample första rad:", JSON.stringify(allData[0], null, 2));
    }

    // Kontrollera unika kommuner
    const uniqueKommuner = [
      ...new Set(allData.map((row) => row.kommun)),
    ].filter((k) => k);
    console.log(`📍 Hittade ${uniqueKommuner.length} unika kommuner för 2025`);

    return allData;
  } catch (error) {
    console.error("❌ Fel vid hämtning av data:", error);
    throw error;
  }
}

function processKommunData(rawData) {
  console.log("Bearbetar kommundata för 2025...");

  if (!Array.isArray(rawData)) {
    throw new Error("rawData är inte en array");
  }

  console.log(`Bearbetar ${rawData.length} rader för 2025`);

  if (rawData.length === 0) {
    throw new Error("Ingen data att bearbeta");
  }

  // Gruppera per kommun
  const kommunMap = new Map();

  rawData.forEach((row, index) => {
    const kommunNamn = row.kommun;

    if (!kommunNamn) {
      if (index < 3)
        console.log(
          `Rad ${index} saknar kommunnamn:`,
          JSON.stringify(row, null, 2)
        );
      return;
    }

    if (!kommunMap.has(kommunNamn)) {
      const kommunalSkatt = parseFloat(row["summa, exkl. kyrkoavgift"]) || 0;

      kommunMap.set(kommunNamn, {
        kommunNamn: kommunNamn,
        kommunalSkatt: kommunalSkatt,
        kyrkoavgifter: [],
      });
    }

    const kommunData = kommunMap.get(kommunNamn);

    // Samla endast kyrkoavgifter (inte begravningsavgifter)
    const kyrkoavgift = parseFloat(row["kyrkoavgift"]) || 0;

    if (kyrkoavgift > 0) {
      kommunData.kyrkoavgifter.push(kyrkoavgift);
    }
  });

  console.log(`Hittade ${kommunMap.size} kommuner`);

  if (kommunMap.size === 0) {
    throw new Error("Inga kommuner hittades i datan");
  }

  // Skapa slutlig struktur med genomsnittlig kyrkoavgift
  const processedData = Array.from(kommunMap.values()).map((kommun) => {
    // Beräkna genomsnittlig kyrkoavgift
    const kyrkoSkatt =
      kommun.kyrkoavgifter.length > 0
        ? kommun.kyrkoavgifter.reduce((sum, val) => sum + val, 0) /
          kommun.kyrkoavgifter.length
        : 0;

    return {
      kommunNamn: kommun.kommunNamn,
      kommunalSkatt: Math.round(kommun.kommunalSkatt * 100) / 100,
      kyrkoSkatt: Math.round(kyrkoSkatt * 100) / 100,
      summaInklKyrka:
        Math.round((kommun.kommunalSkatt + kyrkoSkatt) * 100) / 100,
    };
  });

  // Sortera alfabetiskt
  processedData.sort((a, b) => a.kommunNamn.localeCompare(b.kommunNamn, "sv"));

  console.log(`Bearbetat data för ${processedData.length} kommuner`);
  return processedData;
}

function saveToFile(data, filename = "kommunalskatt_2025.json") {
  try {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
    console.log(`✅ Data sparad till ${filename}`);
    console.log(`📊 Totalt antal kommuner: ${data.length}`);
  } catch (error) {
    console.error("❌ Fel vid sparning:", error);
    console.log(
      "Data som skulle sparats (första 3 kommuner):",
      JSON.stringify(data.slice(0, 3), null, 2)
    );
  }
}

async function main() {
  try {
    console.log("=== 🇸🇪 Skatteverket API Data Processor ===\n");

    const rawData = await fetchTaxData();
    const processedData = processKommunData(rawData);

    // Visa exempel
    if (processedData.length > 0) {
      console.log("\n=== 📋 Exempel på resultat ===");
      console.log(JSON.stringify(processedData.slice(0, 3), null, 2));
    }

    saveToFile(processedData);

    console.log(
      `\n=== ✅ Klart! ${processedData.length} kommuner bearbetade ===`
    );

    return processedData;
  } catch (error) {
    console.error("❌ Fel i huvudprocessen:", error);
    process.exit(1);
  }
}

// Exportera för användning som modul
module.exports = { main, fetchTaxData, processKommunData };

// Kör scriptet om det körs direkt
if (require.main === module) {
  main();
}

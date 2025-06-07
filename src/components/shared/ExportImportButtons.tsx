"use client";

import React, { useRef, useState } from "react";
import { exportToCsv } from "@/lib/export-to-csv";
import { importFromCsv } from "@/lib/import-from-csv";
import type { CalculatorState } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ValidationMessage } from "@/components/ui/validation-message";
import { useTranslations } from "next-intl";
import { Box } from "@/components/ui/box";

interface ExportImportButtonsProps {
  state: CalculatorState;
  onImport: (state: Partial<CalculatorState>) => void;
}

const ExportImportButtons = ({ state, onImport }: ExportImportButtonsProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const t = useTranslations("export_import");

  const handleExport = () => {
    exportToCsv(state);
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportError(null);
    importFromCsv(
      file,
      (importedState) => {
        onImport(importedState);
        setImportError(null);
      },
      (err) => setImportError(err.message)
    );

    // Clear the file input so the same file can be selected again
    e.target.value = "";
  };

  return (
    <Box className="space-y-2">
      <Box className="flex gap-2">
        <Button
          type="button"
          onClick={handleExport}
          variant="outline"
          className="
						bg-white hover:bg-gray-100 text-black
						dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
					"
          suppressHydrationWarning
        >
          {t("export_csv")}
        </Button>
        <Button
          type="button"
          onClick={handleImportClick}
          variant="outline"
          className="
						bg-white hover:bg-gray-100 text-black
						dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
					"
          suppressHydrationWarning
        >
          {t("import_csv")}
        </Button>
        <input
          type="file"
          accept=".csv"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </Box>
      {importError && (
        <ValidationMessage variant="inline" role="alert">
          {t("import_error", { error: importError })}
        </ValidationMessage>
      )}
    </Box>
  );
};

export { ExportImportButtons };

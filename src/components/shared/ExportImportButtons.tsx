"use client";

import { useTranslations } from "next-intl";
import React, { useRef, useState } from "react";

import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { ValidationMessage } from "@/components/ui/ValidationMessage";
import { exportToCsv } from "@/lib/export-to-csv";
import { importFromCsv } from "@/lib/import-from-csv";
import type { CalculatorState } from "@/lib/types";

interface ExportImportButtonsProps {
  state: CalculatorState;
  onImport: (state: Partial<CalculatorState>) => void;
}

const ExportImportButtons = ({ state, onImport }: ExportImportButtonsProps) => {
  const fileInputReference = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const t = useTranslations("export_import");

  const handleExport = () => {
    exportToCsv(state);
  };

  const handleImportClick = () => {
    setImportError(null);
    fileInputReference.current?.click();
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
          suppressHydrationWarning
          className="
						bg-white hover:bg-gray-100 text-black
						dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
					"
          type="button"
          variant="outline"
          onClick={handleExport}
        >
          {t("export_csv")}
        </Button>
        <Button
          suppressHydrationWarning
          className="
						bg-white hover:bg-gray-100 text-black
						dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white
					"
          type="button"
          variant="outline"
          onClick={handleImportClick}
        >
          {t("import_csv")}
        </Button>
        <input
          ref={fileInputReference}
          accept=".csv"
          style={{ display: "none" }}
          type="file"
          onChange={handleFileChange}
        />
      </Box>
      {importError && (
        <ValidationMessage
          message={t("import_error", { error: importError })}
          show={true}
          variant="inline"
        />
      )}
    </Box>
  );
};

export { ExportImportButtons };

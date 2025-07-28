import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState, useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { kommunalskattData } from "@/data/kommunalskatt_2025";
import type { KommunData } from "@/lib/types";

import type { IncomeFormValues } from "./Income";

interface KommunSearchDropdownProps {
  form: UseFormReturn<IncomeFormValues>;
  onFieldChange: () => void;
}

export const KommunSearchDropdown = ({
  form,
  onFieldChange,
}: KommunSearchDropdownProps) => {
  const [kommunSearch, setKommunSearch] = useState("");
  const [showKommunDropdown, setShowKommunDropdown] = useState(false);
  const t = useTranslations("income");
  const kommunList = kommunalskattData as KommunData[];

  // Initialize search with selected value
  useEffect(() => {
    const selectedKommun = form.watch("selectedKommun");
    if (selectedKommun) {
      setKommunSearch(selectedKommun);
    }
  }, [form]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest("#kommun-search") &&
        !target.closest(".kommun-dropdown")
      ) {
        setShowKommunDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and sort kommun list based on search
  const filteredKommuner = useMemo(() => {
    if (!kommunSearch) return kommunList;

    const searchLower = kommunSearch.toLowerCase();
    const filtered = kommunList.filter((kommun) =>
      kommun.kommunNamn.toLowerCase().includes(searchLower)
    );

    // Sort: prioritize names that start with the search term
    return filtered.sort((a, b) => {
      const aStarts = a.kommunNamn.toLowerCase().startsWith(searchLower);
      const bStarts = b.kommunNamn.toLowerCase().startsWith(searchLower);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // If both start or both don't start with search term, sort alphabetically
      return a.kommunNamn.localeCompare(b.kommunNamn, "sv");
    });
  }, [kommunSearch, kommunList]);

  const selectedKommun = form.watch("selectedKommun");
  const selectedKommunData = useMemo(() => {
    return kommunList.find((k) => k.kommunNamn === selectedKommun);
  }, [selectedKommun, kommunList]);

  return (
    <div className="relative">
      <Label
        className="text-sm font-medium text-foreground mb-2 block"
        htmlFor="kommun-search"
      >
        {t("select_municipality")}
      </Label>
      <div className="relative">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
        <Input
          className="!pl-10"
          id="kommun-search"
          placeholder={t("search_municipality")}
          type="text"
          value={kommunSearch}
          onChange={(e) => {
            setKommunSearch(e.target.value);
            setShowKommunDropdown(true);
          }}
          onFocus={() => setShowKommunDropdown(true)}
        />
        {selectedKommunData && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {selectedKommunData.kommunalSkatt}%
          </div>
        )}
      </div>

      {/* Dropdown */}
      {showKommunDropdown && filteredKommuner.length > 0 && (
        <div className="kommun-dropdown absolute z-50 w-full mt-1 max-h-60 overflow-y-auto bg-background/70 backdrop-blur-md rounded-lg border border-border shadow-xl">
          {filteredKommuner.slice(0, 10).map((kommun) => (
            <button
              key={kommun.kommunNamn}
              className="w-full px-4 py-2 text-left hover:bg-muted text-foreground text-sm transition-colors flex justify-between items-center"
              type="button"
              onClick={() => {
                form.setValue("selectedKommun", kommun.kommunNamn);
                setKommunSearch(kommun.kommunNamn);
                setShowKommunDropdown(false);
                onFieldChange();
              }}
            >
              <span>{kommun.kommunNamn}</span>
              <span className="text-muted-foreground">
                {kommun.kommunalSkatt}%
              </span>
            </button>
          ))}
          {filteredKommuner.length > 10 && (
            <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border">
              {t("showing_municipalities", {
                shown: 10,
                total: filteredKommuner.length,
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

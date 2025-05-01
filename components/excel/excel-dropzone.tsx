"use client";

import { parseExcelFile } from "@/lib/excel";
import { useExcelStore } from "@/store/excel-store";
import { useCallback } from "react";

export function ExcelDropzone() {
  const setData = useExcelStore((state) => state.setData);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await parseExcelFile(file);
    setData(data);
  }, [setData]);

  return (
    <div className="p-4 border rounded-lg">
      <label className="block text-sm font-medium mb-2">Excel Dosyası Yükle:</label>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
    </div>
  );
}

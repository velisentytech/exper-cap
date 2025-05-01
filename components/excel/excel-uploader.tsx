"use client";

import { useExcelStore } from "@/store/excel-store";
import { Upload } from "lucide-react";
import * as XLSX from "xlsx";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function ExcelUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const setData = useExcelStore((state) => state.setData);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { defval: "" });
      setData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex items-center gap-4 my-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        ref={inputRef}
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2"
      >
        <Upload className="w-4 h-4" />
        Excel Yükle
      </Button>
    </div>
  );
}

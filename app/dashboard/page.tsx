// dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCcw, FileText, Upload, Download } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";


export default function DashboardPage() {
  const [search, setSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const [dataForWord, setDataForWord] = useState<any[]>([]); // Word için data tutulacak
  const [dataTableData, setDataTableData] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const emailname = localStorage.getItem("email");
    if (token) {
      setUserEmail(emailname);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Başarıyla çıkış yaptınız!");
    router.push("/login");
  };

  const handleExportToWord = () => {
    // Verileri localStorage ile taşıyoruz (veya başka yöntem de olur)
    localStorage.setItem("wordData", JSON.stringify(dataForWord));
    router.push("/word-preview");
  };

  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setDataTableData(jsonData);
        toast.success("Excel verisi başarıyla yüklendi.");
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      toast.error("Excel dosyası okunamadı.");
    }
  };

  const handleExportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dataForWord);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Veriler");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const file = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(file, "veriler.xlsx");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-end p-4 shadow-md bg-gray-100 dark:bg-gray-800">
        <div className="flex items-center gap-4">
          {userEmail && <span className="text-sm font-medium">{userEmail}</span>}
          <Button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white">
            Çıkış Yap
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <Input
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
          <Button onClick={handleRefresh} variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Yenile
          </Button>

          {/* Word'e aktar butonu */}
          <Button onClick={handleExportToWord} className="bg-blue-500 hover:bg-blue-600 text-white">
            <FileText className="mr-2 h-4 w-4" />
            Word'e Aktar
          </Button>
             {/* Excel Yükle Butonu */}
             <label htmlFor="excel-upload">
            <input
              type="file"
              id="excel-upload"
              accept=".xlsx, .xls"
              onChange={handleImportExcel}
              className="hidden"
            />
            <Button variant="outline" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Excel Yükle
            </Button>
          </label>

          {/* Excel'e Aktar Butonu */}
          <Button onClick={handleExportToExcel} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Excel'e Aktar
          </Button>
        </div>

        {/* Tablo */}
        <DataTable 
          search={search} 
          refreshTrigger={refreshTrigger} 
          setDataForWord={setDataForWord} // Buradan gelen verileri saklıyoruz
        />
         <div className="mt-6 flex justify-end">
          <Button onClick={()=>router.push("/group")}>
            Devam Et
          </Button>
        </div>
      </main>
     
    </div>
  );
}

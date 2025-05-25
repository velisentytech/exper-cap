"use client";
import ExcelUploader from "@/components/ExcelUploader";
import { Button } from "@/components/ui/button";
import UploadedExcelTable from "@/components/UploadedExcelTable";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ExcelPage() {
  const router = useRouter();

  const [refreshKey, setRefreshKey] = useState(0);
  const searchParams = useSearchParams();
  const basvuruNo = searchParams.get("basvuruNo");
  console.log(basvuruNo);
  const handleContinue = () => {
    router.push("/group");
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Excel Yükleme ve Görüntüleme</h1>
      <ExcelUploader basvuruNo={basvuruNo}
      onUploadSuccess={() => setRefreshKey(prev => prev + 1)}/>
      <UploadedExcelTable basvuruNo={basvuruNo} refreshKey={refreshKey} />

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          // disabled={excelData.length === 0}
          className="mt-4"
        >
          Devam
        </Button>
      </div>
    </div>
  );
}

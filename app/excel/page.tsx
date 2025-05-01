import ExcelUploader from "@/components/excel/excel-uploader";
import ExcelTable from "@/components/excel/excel-table";

export default function ExcelPage() {
  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Excel Veri Yükleme</h1>
      <ExcelUploader />
      <ExcelTable />
    </div>
  );
}

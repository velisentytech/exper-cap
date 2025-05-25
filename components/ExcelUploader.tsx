'use client';

import { useState } from 'react';
import { toast } from 'sonner';

type ExcelUploaderProps = {
  basvuruNo: string | null;
};

export default function ExcelUploader({ basvuruNo, onUploadSuccess }: { basvuruNo: string | null, onUploadSuccess?: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!file || !basvuruNo) {
      toast.error("Dosya veya başvuru numarası eksik.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('basvuruNo', basvuruNo); // 💡 basvuruNo formData'ya eklendi

    const res = await fetch(`/api/upload-excel`, {
      method: 'POST',
      body: formData,
    });

    onUploadSuccess?.();
    const result = await res.json();
    setLoading(false);
    result.success ? toast.success("Yükleme başarılı!") : toast.error("Başarısız");
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h2 className="text-lg font-semibold mb-2">Excel Yükle</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="mt-2 px-4 py-1 bg-blue-600 text-white rounded"
        disabled={loading}
      >
        {loading ? 'Yükleniyor...' : 'Yükle'}
      </button>
    </div>
  );
}

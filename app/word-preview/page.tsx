"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";

export default function WordPreviewPage() {
  const [wordData, setWordData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("wordData");
    if (storedData) {
      setWordData(JSON.parse(storedData));
    }
  }, []);

  const handleDownloadWord = () => {
    const content = wordData.map((item) => `ID: ${item.id} | Adı: ${item.name} | Miktar: ${item.miktar}`).join("\n");
    const blob = new Blob([content], { type: "application/msword" });
    saveAs(blob, "veriler.doc");
  };

  if (!wordData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl mb-4">Veri bulunamadı.</p>
        <Button onClick={() => router.push("/dashboard")}>
          Dashboard'a Dön
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Word Önizleme</h1>

      {/* Verilerin gösterimi */}
      <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-md shadow-md p-4 space-y-2">
        {wordData.map((item) => (
          <div key={item.id} className="border-b pb-2">
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Adı:</strong> {item.name}</p>
            <p><strong>Miktar:</strong> {item.miktar}</p>
          </div>
        ))}
      </div>

      {/* Word olarak indir butonu */}
      <Button onClick={handleDownloadWord} className="mt-6 bg-green-600 hover:bg-green-700 text-white">
        Word Olarak İndir
      </Button>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableCell,
  TableRow,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
} from "docx";

export default function WordPreviewPage() {
  const [wordData, setWordData] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedData = localStorage.getItem("wordData");
    if (storedData) {
      setWordData(JSON.parse(storedData));
    }
  }, []);

  const handleDownloadWord = async () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const tableRows = wordData.map((item) => (
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: "🛠️ Makine Bilgileri", bold: true, size: 28 }),
                ],
                spacing: { after: 300 },
              }),
              new Paragraph({ text: `ID: ${item.id}`, spacing: { after: 100 } }),
              new Paragraph({ text: `Makine Kodu: ${item.machine_code}`, spacing: { after: 100 } }),
              new Paragraph({ text: `Makine Açıklaması: ${item.machine_desc}`, spacing: { after: 100 } }),
              new Paragraph({ text: `Adet: ${item.adet}`, spacing: { after: 100 } }),
              new Paragraph({ text: `Güç (kW): ${item.power}`, spacing: { after: 100 } }),
              new Paragraph({ text: `Puan: ${item.puan}`, spacing: { after: 100 } }),
            ],
            shading: {
              type: ShadingType.CLEAR,
              color: "auto",
              fill: "EDEDED", // Açık gri arka plan
            },
            margins: { top: 300, bottom: 300, left: 300, right: 300 },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "999999" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "999999" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "999999" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "999999" },
            },
          }),
        ],
      })
    ));

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Firma adı sağ üstte
            new Paragraph({
              children: [
                new TextRun({
                  text: "Sentytech",
                  bold: true,
                  color: "666666", // Gri renk
                  size: 32,
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 300 },
            }),
            // Başlık
            new Paragraph({
              children: [
                new TextRun({ text: "Makina Listesi", bold: true, size: 36 }),
              ],
              spacing: { after: 200 },
            }),
            // Tarih
            new Paragraph({
              children: [
                new TextRun({ text: `Oluşturulma Tarihi: ${formattedDate}`, italics: true, size: 24 }),
              ],
              spacing: { after: 400 },
            }),
            // Tablo
            new Table({
              width: {
                size: 100,
                type: WidthType.PERCENTAGE,
              },
              rows: tableRows,
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "makina_listesi.docx");
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
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-md shadow-md p-6 space-y-6">
        {wordData.map((item) => (
          <div
            key={item.id}
            className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-gray-100"
          >
            <p className="font-semibold text-lg mb-2">🛠️ Makine Bilgileri</p>
            <p><strong>ID:</strong> {item.id}</p>
            <p><strong>Makine Kodu:</strong> {item.machine_code}</p>
            <p><strong>Makine Açıklaması:</strong> {item.machine_desc}</p>
            <p><strong>Adet:</strong> {item.adet}</p>
            <p><strong>Güç (kW):</strong> {item.power}</p>
            <p><strong>Puan:</strong> {item.puan}</p>
          </div>
        ))}
      </div>

      {/* Word olarak indir butonu */}
      <Button 
        onClick={handleDownloadWord} 
        className="mt-6 bg-green-600 hover:bg-green-700 text-white"
      >
        Word Olarak İndir
      </Button>
    </div>
  );
}

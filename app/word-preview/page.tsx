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
  Table as DocxTable,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  ShadingType,
  AlignmentType,
  PageMargin,
  Footer,
} from "docx";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell as ShadcnTableCell,
  TableHead,
  TableHeader,
  TableRow as ShadcnTableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function WordPreviewPage() {
  const [wordData, setWordData] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  // Verileri API'den çekme
  // useEffect(() => {
  //   fetch('/api/uploaded-excel')
  //     .then(res => res.json())
  //     .then(setWordData);
  // }, []);

  useEffect(() => {
    // 1. API'den veriyi çek
    fetch('/api/uploaded-excel')
      .then(res => res.json())
      .then(setWordData);
  
    // 2. Kopyalamayı engelle
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert("Kopyalama işlemi engellendi.");
    };
  
    // 3. Sağ tıklamayı engelle
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };
  
    // 4. Ctrl+C, Cmd+C gibi kısayolları engelle
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "c") {
        e.preventDefault();
        alert("Kopyalama işlemi engellendi.");
      }
    };
  
    document.addEventListener("copy", handleCopy);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
  
    return () => {
      document.removeEventListener("copy", handleCopy);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Word dosyasını indirme fonksiyonu
  const handleDownloadWord = async () => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 2 cm
                right: 1440, // 2 cm
                bottom: 1440, // 2 cm
                left: 1440, // 2 cm
              },
            },
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  children: [
                    new TextRun({
                      text: `Sentytech © ${new Date().getFullYear()} | Sayfa `,
                    }),
                    new TextRun({
                      children: ["PAGE"],
                      field: "PAGE",
                    }),
                  ],
                }),
              ],
            }),
          },
          children: [
            // Firma Adı ve Başlık
            new Paragraph({
              children: [
                new TextRun({
                  text: "Sentytech",
                  bold: true,
                  color: "1B263B", // Profesyonel koyu mavi
                  size: 32,
                  font: "Calibri",
                }),
              ],
              alignment: AlignmentType.RIGHT,
              spacing: { after: 300 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: "Makina Listesi Raporu",
                  bold: true,
                  size: 36,
                  font: "Calibri",
                  color: "1B263B",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Oluşturulma Tarihi: ${formattedDate}`,
                  italics: true,
                  size: 24,
                  font: "Calibri",
                  color: "4B5EAA",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            // Tablo
            new DocxTable({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                // Tablo Başlık Satırı
                new TableRow({
                  children: [
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Makine Kodu",
                              bold: true,
                              size: 24,
                              font: "Calibri",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      shading: { fill: "E6E6E6", type: ShadingType.SOLID },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Makine Açıklaması",
                              bold: true,
                              size: 24,
                              font: "Calibri",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      shading: { fill: "E6E6E6", type: ShadingType.SOLID },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Adet", bold: true, size: 24, font: "Calibri" }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      shading: { fill: "E6E6E6", type: ShadingType.SOLID },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: "Güç (kW)",
                              bold: true,
                              size: 24,
                              font: "Calibri",
                            }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      shading: { fill: "E6E6E6", type: ShadingType.SOLID },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                      },
                    }),
                    new TableCell({
                      children: [
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Puan", bold: true, size: 24, font: "Calibri" }),
                          ],
                          alignment: AlignmentType.CENTER,
                        }),
                      ],
                      shading: { fill: "E6E6E6", type: ShadingType.SOLID },
                      borders: {
                        top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                      },
                    }),
                  ],
                }),
                // Veri Satırları
                ...wordData.map((item, index) =>
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: item.machine_code, size: 22, font: "Calibri" }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: { fill: index % 2 === 0 ? "F7F7F7" : "FFFFFF" },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: item.machine_desc, size: 22, font: "Calibri" }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: { fill: index % 2 === 0 ? "F7F7F7" : "FFFFFF" },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: item.adet.toString(), size: 22, font: "Calibri" }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: { fill: index % 2 === 0 ? "F7F7F7" : "FFFFFF" },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: item.power.toString(), size: 22, font: "Calibri" }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: { fill: index % 2 === 0 ? "F7F7F7" : "FFFFFF" },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        },
                      }),
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: [
                              new TextRun({ text: item.puan.toString(), size: 22, font: "Calibri" }),
                            ],
                            alignment: AlignmentType.CENTER,
                          }),
                        ],
                        shading: { fill: index % 2 === 0 ? "F7F7F7" : "FFFFFF" },
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          bottom: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          left: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                          right: { style: BorderStyle.SINGLE, size: 4, color: "000000" },
                        },
                      }),
                    ],
                  })
                ),
              ],
            }),
            // Alt Bilgi
            new Paragraph({
              children: [
                new TextRun({
                  text: "Sentytech | Kapasite Hesabı",
                  size: 20,
                  font: "Calibri",
                  color: "666666",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 400 },
            }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "kapasite_raporu.docx");
  };

  // Dialogu açma ve kapama fonksiyonları
  const handleOpenDialog = () => setIsDialogOpen(true);
  const handleCloseDialog = () => setIsDialogOpen(false);
  const handleConfirmDownload = () => {
    handleDownloadWord();
    handleCloseDialog();
  };

  // Veri yoksa yükleme ekranı
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
      <h1 className="text-2xl font-bold mb-6">Rapor Önizleme</h1>
      <Button
        onClick={handleOpenDialog}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white"
      >
        Word Olarak İndir
      </Button>

      {/* Shadcn UI Dialog */}
      {isDialogOpen && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Uyarı
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600 dark:text-gray-300">
                Hesaplama verileri Word dosyasına aktarılacak ve daha sonra bu veriler üzerinde değişiklik yapılamayacak. Devam etmek istiyor musunuz?
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                className="border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Vazgeç
              </Button>
              <Button
                onClick={handleConfirmDownload}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                Devam et
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Shadcn UI DataTable */}
      <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-md shadow-md p-6 mt-6">
        <Table>
          <TableCaption>Puantaj</TableCaption>
          <TableHeader>
            <ShadcnTableRow>
              <TableHead>Makine Kodu</TableHead>
              <TableHead>Makine Açıklaması</TableHead>
              <TableHead>Adet</TableHead>
              <TableHead>Güç (kW)</TableHead>
              <TableHead>Puan</TableHead>
            </ShadcnTableRow>
          </TableHeader>
          <TableBody>
            {wordData.map((item) => (
              <ShadcnTableRow key={item.id}>
                <ShadcnTableCell>{item.machine_code}</ShadcnTableCell>
                <ShadcnTableCell>{item.machine_desc}</ShadcnTableCell>
                <ShadcnTableCell>{item.adet}</ShadcnTableCell>
                <ShadcnTableCell>{item.power}</ShadcnTableCell>
                <ShadcnTableCell>{item.puan}</ShadcnTableCell>
              </ShadcnTableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
"use client";

import { useExcelStore } from "@/store/excel-store";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ExcelTable() {
  const data = useExcelStore((state) => state.data);

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">Henüz veri yüklenmedi.</p>;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-auto border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>{col}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: any, i: number) => (
            <TableRow key={i}>
              {columns.map((col) => (
                <TableCell key={col}>{row[col]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

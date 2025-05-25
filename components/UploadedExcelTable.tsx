'use client';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type ExcelItem = {
  id: number;
  machine_code: string;
  machine_desc: string;
  adet: number;
  puan: number;
  power: number;
  basvuruNo: string;
  createdAt: string;
};

const columns: ColumnDef<ExcelItem>[] = [
  {
    accessorKey: 'machine_code',
    header: 'Makine Kodu',
  },
  {
    accessorKey: 'machine_desc',
    header: 'Açıklama',
  },
  {
    accessorKey: 'adet',
    header: 'Adet',
  },
  {
    accessorKey: 'power',
    header: 'Power',
  },
  {
    accessorKey: 'puan',
    header: 'Puan',
  },
  {
    accessorKey: 'basvuruNo',
    header: 'Başvuru No',
  },
  {
    accessorKey: 'createdAt',
    header: 'Tarih',
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return date.toLocaleDateString();
    },
  },
];

export default function UploadedExcelTable({
  basvuruNo,
  refreshKey,
}: {
  basvuruNo: string | null;
  refreshKey: number;
}) {
  const [data, setData] = useState<ExcelItem[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');

  // useEffect(() => {
  //   fetch('/api/uploaded-excel')
  //     .then(res => res.json())
  //     .then(setData);
  // }, []);
//   useEffect(() => {
//   fetch('/api/uploaded-excel')
//     .then(res => res.json())
//     .then((excelData: ExcelItem[]) => {
//       if (basvuruNo) {
//         const filtered = excelData.filter(item => item.basvuruNo === basvuruNo);
//         setData(filtered);
//       } else {
//         setData(excelData);
//       }
//     });
// }, [basvuruNo]);

useEffect(() => {
  const query = basvuruNo ? `?basvuruNo=${basvuruNo}` : '';
  fetch(`/api/uploaded-excel${query}`)
    .then(res => res.json())
    .then(setData);
}, [basvuruNo,refreshKey]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="mt-6 space-y-4">
      <Input
        placeholder="Makine ara..."
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  Kayıt bulunamadı
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Geri
        </Button>

        <div className="text-sm">
          Sayfa {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          İleri
        </Button>
      </div>
    </div>
  );
}

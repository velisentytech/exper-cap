"use client";

import useSWR from "swr";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

type Basvuru = {
  id: number;
  basvuruNo: string;
  unvan: string;
};

export default function BasvuruTable() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, isLoading } = useSWR<Basvuru[]>("/api/basvuru", fetcher);

  return (
    <div className="mt-6 border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Başvuru No</TableHead>
            <TableHead>Unvan</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
              </TableRow>
            ))
          ) : data && data.length > 0 ? (
            data.map((basvuru) => (
              <TableRow key={basvuru.id}>
                <TableCell>
                  <Link
                    href={`/excel?basvuruNo=${encodeURIComponent(basvuru.basvuruNo)}`}
                    className="text-blue-600 hover:underline"
                  >
                    {basvuru.basvuruNo}
                  </Link>
                </TableCell>
                <TableCell>{basvuru.unvan}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                Kayıt bulunamadı.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

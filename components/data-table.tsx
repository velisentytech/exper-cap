"use client";

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { motion, AnimatePresence } from "framer-motion";

interface DataTableProps {
  search: string;
  refreshTrigger: number;
  setDataForWord: (data: ExcelData[]) => void; // <<< Burayı ekledik
}

interface ExcelData {
  id: number;
  machine_code: string;
  machine_desc: string;
  adet: number;
  power: number;
  puan: number;
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export function DataTable({ search, refreshTrigger, setDataForWord }: DataTableProps) {
  const [data, setData] = useState<ExcelData[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 10,
    pageCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<string>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const debouncedSearch = useDebounce(search, 500); 

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search: debouncedSearch,
        page: pagination.page.toString(),
        pageSize: pagination.pageSize.toString(),
      });
  
      const response = await fetch(`/api/exceldata?${params.toString()}`);
      const result = await response.json();
     
      setData(result.exceldata);

      // Dışarıya veriyi gönderiyoruz
      setDataForWord(result.exceldata);

      setPagination(prev => ({
        ...prev,
        total: result.pagination.total,
        page: result.pagination.page,
        pageSize: result.pagination.pageSize,
        pageCount: result.pagination.pageCount,
      }));
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, pagination.pageSize, sortField, sortOrder, debouncedSearch, refreshTrigger]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    }
    return sortOrder === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('id')}
                >
                  ID {renderSortIcon('id')}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('machine_code')}
                >
                  Makina Kodu {renderSortIcon('machine_code')}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('machine_desc')}
                >
                  Makina Açıklaması {renderSortIcon('machine_desc')}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('adet')}
                >
                  Adet {renderSortIcon('adet')}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('power')}
                >
                  Güç {renderSortIcon('power')}
                </div>
              </TableHead>
              <TableHead>
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('puan')}
                >
                  Puan {renderSortIcon('puan')}
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Yükleniyor...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Veri bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              <AnimatePresence>
                {data.map((row) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.3 }}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <TableCell>{row.id}</TableCell>
                    <TableCell>{row.machine_code}</TableCell>
                    <TableCell>{row.machine_desc}</TableCell>
                    <TableCell>{row.adet}</TableCell>
                    <TableCell>{row.power}</TableCell>
                    <TableCell>{row.puan}</TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Toplam {pagination.total} kayıt, Sayfa {pagination.page}/{pagination.pageCount}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
            disabled={pagination.page <= 1}
          >
            Önceki
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            disabled={pagination.page >= pagination.pageCount}
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { useState, useEffect } from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
// import {
//   Accordion,
//   AccordionContent,
//   AccordionItem,
//   AccordionTrigger,
// } from "@/components/ui/accordion";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner"; // Sonner'ı import ediyoruz

// interface DataTableProps {
//   search: string;
//   refreshTrigger: number;
//   onSelectMachineGroup?: (id: number) => void;
//   groupId?: string | null;
//   onRefresh?: () => void;
// }

// interface ExcelData {
//   id: number;
//   machine_code: string;
//   machine_desc: string;
//   adet: number;
//   power: number;
//   puan: number;
// }

// interface MachineGroupCategory {
//   id: number;
//   machine_desc: string;
//   category_id: string;
//   group1: number;
//   group2: number;
//   group3: number;
//   group4: number;
//   group5: number;
//   group6: number;
//   group7: number;
// }

// interface PaginationInfo {
//   total: number;
//   page: number;
//   pageSize: number;
//   pageCount: number;
// }

// export function AccordionDataTable({ search, refreshTrigger, onSelectMachineGroup, groupId, onRefresh }: DataTableProps) {
//   const [data, setData] = useState<ExcelData[]>([]);
//   const [machineGroups, setMachineGroups] = useState<Record<string, MachineGroupCategory[]>>({});
//   const [pagination, setPagination] = useState<PaginationInfo>({
//     total: 0,
//     page: 1,
//     pageSize: 10,
//     pageCount: 0
//   });
//   const [loading, setLoading] = useState(true);
//   const [calculating, setCalculating] = useState(false);
//   const [sortField, setSortField] = useState<string>('id');
//   const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
//   const [selectedMachineGroup, setSelectedMachineGroup] = useState<string | null>(null);
//   const [selectedMachineCode, setSelectedMachineCode] = useState<string | null>(null);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch(
//         `/api/data?page=${pagination.page}&pageSize=${pagination.pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`
//       );
//       const result = await response.json();
//       setData(result.data);
//       setPagination(result.pagination);
      
//       // Fetch machine group categories for each machine
//       const machineCodeCategories: Record<string, string> = {};
//       result.data.forEach((item: ExcelData) => {
//         machineCodeCategories[item.machine_code] = '';
//       });
      
//       if (Object.keys(machineCodeCategories).length > 0) {
//         await fetchMachineCategories(Object.keys(machineCodeCategories));
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const fetchMachineCategories = async (machineCodes: string[]) => {
//     try {
//       const response = await fetch(`/api/machine-categories?codes=${machineCodes.join(',')}`);
//       const result = await response.json();
      
//       // Group machine group categories by machine code
//       const groupedData: Record<string, MachineGroupCategory[]> = {};
      
//       for (const item of result) {
//         if (!groupedData[item.machine_code]) {
//           groupedData[item.machine_code] = [];
//         }
//         groupedData[item.machine_code].push(item);
//       }
      
//       setMachineGroups(groupedData);
//     } catch (error) {
//       console.error('Error fetching machine categories:', error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [pagination.page, pagination.pageSize, sortField, sortOrder, search, refreshTrigger]);

//   const handleSort = (field: string) => {
//     if (sortField === field) {
//       setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortOrder('asc');
//     }
//   };

//   const renderSortIcon = (field: string) => {
//     if (sortField !== field) {
//       return <ChevronsUpDown className="ml-2 h-4 w-4" />;
//     }
//     return sortOrder === 'asc' ? (
//       <ChevronUp className="ml-2 h-4 w-4" />
//     ) : (
//       <ChevronDown className="ml-2 h-4 w-4" />
//     );
//   };
  
//   const handleMachineGroupSelect = async (id: string, machineCode: string) => {
//     setSelectedMachineGroup(id);
//     setSelectedMachineCode(machineCode);
    
//     if (onSelectMachineGroup) {
//       onSelectMachineGroup(parseInt(id));
//     }
    
//     // Eğer grup ID'si varsa, puan hesaplamasını yap
//     if (groupId) {
//       await calculatePoint(machineCode, id, groupId);
//     }
//   };
  
//   const calculatePoint = async (machineCode: string, machineGroupCategoryId: string, groupId: string) => {
//     setCalculating(true);
//     try {
//       const response = await fetch('/api/calculatepoint', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           machineCode,
//           machineGroupCategoryId,
//           groupId
//         }),
//       });
      
//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Puan hesaplanırken bir hata oluştu');
//       }
      
//       // Sonner toast kullanımı
//       toast.success("Puan başarıyla hesaplandı ve güncellendi.");
      
//       // Veriyi yenile
//       if (onRefresh) {
//         onRefresh();
//       } else {
//         fetchData();
//       }
      
//     } catch (error) {
//       console.error('Error calculating point:', error);
//       // Sonner toast kullanımı
//       toast.error(error instanceof Error ? error.message : "Puan hesaplanırken bir hata oluştu");
//     } finally {
//       setCalculating(false);
//     }
//   };

//   return (
//     <div>
//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead className="w-[80px]">
//                 <div 
//                   className="flex items-center cursor-pointer"
//                   onClick={() => handleSort('id')}
//                 >
//                   ID {renderSortIcon('id')}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div 
//                   className="flex items-center cursor-pointer"
//                   onClick={() => handleSort('machine_desc')}
//                 >
//                   Makina Açıklaması {renderSortIcon('machine_desc')}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div 
//                   className="flex items-center cursor-pointer"
//                   onClick={() => handleSort('adet')}
//                 >
//                   Adet {renderSortIcon('adet')}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div 
//                   className="flex items-center cursor-pointer"
//                   onClick={() => handleSort('power')}
//                 >
//                   Güç {renderSortIcon('power')}
//                 </div>
//               </TableHead>
//               <TableHead>
//                 <div 
//                   className="flex items-center cursor-pointer"
//                   onClick={() => handleSort('puan')}
//                 >
//                   Puan {renderSortIcon('puan')}
//                 </div>
//               </TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {loading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center">
//                   Yükleniyor...
//                 </TableCell>
//               </TableRow>
//             ) : calculating ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center">
//                   Puan hesaplanıyor...
//                 </TableCell>
//               </TableRow>
//             ) : data.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center">
//                   Veri bulunamadı.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               data.map((row) => (
//                 <TableRow key={row.id}>
//                   <TableCell>{row.id}</TableCell>
//                   <TableCell className="w-full">
//                     <Accordion type="single" collapsible className="w-full">
//                       <AccordionItem value={`item-${row.id}`}>
//                         <AccordionTrigger className="py-2">
//                           {row.machine_desc}
//                         </AccordionTrigger>
//                         <AccordionContent>
//                           <div className="p-4 bg-gray-50 rounded-md">
//                             <p className="font-medium mb-2">Makina Kodu: {row.machine_code}</p>
                            
//                             {machineGroups[row.machine_code] && machineGroups[row.machine_code].length > 0 ? (
//                               <div className="mt-4">
//                                 <p className="font-medium mb-2">Makina Grup Kategorileri:</p>
//                                 <RadioGroup 
//                                   value={selectedMachineGroup || ''} 
//                                   onValueChange={(value) => handleMachineGroupSelect(value, row.machine_code)}
//                                   className="space-y-2"
//                                 >
//                                   {machineGroups[row.machine_code].map((group) => (
//                                     <div key={group.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100">
//                                       <RadioGroupItem value={group.id.toString()} id={`group-${group.id}`} />
//                                       <Label htmlFor={`group-${group.id}`} className="flex-1 cursor-pointer">
//                                         {group.machine_desc}
//                                       </Label>
//                                     </div>
//                                   ))}
//                                 </RadioGroup>
//                               </div>
//                             ) : (
//                               <p className="text-gray-500 italic">Bu makina için grup kategorisi bulunamadı.</p>
//                             )}
//                           </div>
//                         </AccordionContent>
//                       </AccordionItem>
//                     </Accordion>
//                   </TableCell>
//                   <TableCell>{row.adet}</TableCell>
//                   <TableCell>{row.power}</TableCell>
//                   <TableCell>{row.puan}</TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {/* Pagination */}
//       <div className="flex items-center justify-between space-x-2 py-4">
//         <div className="text-sm text-muted-foreground">
//           Toplam {pagination.total} kayıt, Sayfa {pagination.page}/{pagination.pageCount}
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
//             disabled={pagination.page <= 1}
//           >
//             Önceki
//           </Button>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
//             disabled={pagination.page >= pagination.pageCount}
//           >
//             Sonraki
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface DataTableProps {
  search: string;
  refreshTrigger: number;
  onSelectMachineGroup?: (id: number) => void;
  groupId?: string | null;
  onRefresh?: () => void;
}

interface ExcelData {
  id: number;
  machine_code: string;
  machine_desc: string;
  adet: number;
  power: number;
  puan: number;
}

interface MachineGroupCategory {
  id: number;
  machine_code: string;
  machine_desc: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export function AccordionDataTable({
  search,
  refreshTrigger,
  onSelectMachineGroup,
  groupId,
  onRefresh
}: DataTableProps) {
  const [data, setData] = useState<ExcelData[]>([]);
  const [machineGroups, setMachineGroups] = useState<Record<string, MachineGroupCategory[]>>({});
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    pageSize: 10,
    pageCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedMachineGroup, setSelectedMachineGroup] = useState<string | null>(null);
  const [selectedMachineCode, setSelectedMachineCode] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/data?page=${pagination.page}&pageSize=${pagination.pageSize}&sortField=${sortField}&sortOrder=${sortOrder}&search=${search}`);
      const result = await res.json();
      setData(result.data);
      setPagination(result.pagination);

      const codes = result.data.map((item: ExcelData) => item.machine_code);
      if (codes.length > 0) await fetchMachineCategories(codes);
    } catch (err) {
      toast.error("Veri çekilirken bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMachineCategories = async (machineCodes: string[]) => {
    try {
      const res = await fetch(`/api/machine-categories?codes=${machineCodes.join(",")}`);
      const result = await res.json();
      const grouped: Record<string, MachineGroupCategory[]> = {};

      for (const item of result) {
        if (!grouped[item.machine_code]) grouped[item.machine_code] = [];
        grouped[item.machine_code].push(item);
      }

      setMachineGroups(grouped);
    } catch (err) {
      toast.error("Makina grupları yüklenemedi.");
    }
  };

  const calculatePoint = async (machineCode: string, machineGroupCategoryId: string, groupId: string) => {
    setCalculating(true);
    try {
      const res = await fetch("/api/calculatepoint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ machineCode, machineGroupCategoryId, groupId })
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Puan hesaplama hatası");

      toast.success("Puan başarıyla hesaplandı.");
      onRefresh ? onRefresh() : fetchData();
    } catch (err: any) {
      toast.error(err.message || "Hata oluştu.");
    } finally {
      setCalculating(false);
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronsUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />;
  };

  const handleMachineGroupSelect = async (id: string, code: string) => {
    setSelectedMachineGroup(id);
    setSelectedMachineCode(code);
    onSelectMachineGroup?.(parseInt(id));

    if (groupId) await calculatePoint(code, id, groupId);
  };

  useEffect(() => {
    fetchData();
  }, [pagination.page, sortField, sortOrder, search, refreshTrigger]);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {["id", "machine_desc", "adet", "power", "puan"].map((field) => (
                <TableHead key={field}>
                  <div
                    className="flex items-center cursor-pointer select-none"
                    onClick={() => handleSort(field)}
                  >
                    {field === "id"
                      ? "ID"
                      : field === "machine_desc"
                      ? "Makina Açıklaması"
                      : field === "adet"
                      ? "Adet"
                      : field === "power"
                      ? "Güç"
                      : "Puan"}{" "}
                    {renderSortIcon(field)}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading || calculating ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  {loading ? "Yükleniyor..." : "Puan hesaplanıyor..."}
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  Veri bulunamadı.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>
                    <Accordion type="single" collapsible>
                      <AccordionItem value={`item-${row.id}`}>
                        <AccordionTrigger className="py-2">{row.machine_desc}</AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">Kodu: {row.machine_code}</p>
                            {machineGroups[row.machine_code]?.length ? (
                              <RadioGroup
                                value={selectedMachineGroup || ""}
                                onValueChange={(val) => handleMachineGroupSelect(val, row.machine_code)}
                                className="space-y-2 mt-3"
                              >
                                {machineGroups[row.machine_code].map((group) => (
                                  <div
                                    key={group.id}
                                    className="flex items-center gap-2 p-2 border rounded-lg hover:bg-accent"
                                  >
                                    <RadioGroupItem value={group.id.toString()} id={`g-${group.id}`} />
                                    <Label htmlFor={`g-${group.id}`} className="cursor-pointer">
                                      {group.machine_desc}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            ) : (
                              <p className="text-sm italic text-muted-foreground">
                                Grup kategorisi bulunamadı.
                              </p>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </TableCell>
                  <TableCell>{row.adet}</TableCell>
                  <TableCell>{row.power}</TableCell>
                  <TableCell>{row.puan}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Toplam {pagination.total} kayıt, Sayfa {pagination.page} / {pagination.pageCount}
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
            }
          >
            Önceki
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pagination.page >= pagination.pageCount}
            onClick={() =>
              setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
            }
          >
            Sonraki
          </Button>
        </div>
      </div>
    </div>
  );
}


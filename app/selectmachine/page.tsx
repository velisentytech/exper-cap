// app/select-machine/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Machine = {
  id: number;
  name: string;
  categoryId: number;
};

type Category = {
  id: number;
  name: string;
};

export default function SelectMachinePage() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("groupId");

  const [machines, setMachines] = useState<Machine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [machineRes, categoryRes] = await Promise.all([
        fetch(`/api/machines?groupId=${groupId}`),
        fetch(`/api/categories`),
      ]);
      const machineData = await machineRes.json();
      const categoryData = await categoryRes.json();
      setMachines(machineData);
      setCategories(categoryData);
    };

    fetchData();
  }, [groupId]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Makine Seçimi</h1>

      <Accordion type="multiple" className="w-full space-y-2">
        {categories.map((category) => {
          const machinesForCategory = machines.filter(
            (m) => m.categoryId === category.id
          );

          if (machinesForCategory.length === 0) return null;

          return (
            <AccordionItem value={`category-${category.id}`} key={category.id}>
              <AccordionTrigger className="text-lg font-medium">
                {category.name}
              </AccordionTrigger>
              <AccordionContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Makine Adı</TableHead>
                      <TableHead>Kategori ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {machinesForCategory.map((machine) => (
                      <TableRow key={machine.id}>
                        <TableCell>{machine.name}</TableCell>
                        <TableCell>{machine.categoryId}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

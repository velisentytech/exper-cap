"use client";

import { useState } from "react";
import { columns, Basvuru } from "@/components/basvuru/basvuru-columns";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function BasvuruTable({ initialData }: { initialData: Basvuru[] }) {
  const [data, setData] = useState<Basvuru[]>(initialData);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ basvuruNo: "", unvan: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.basvuruNo || !form.unvan) {
      toast.error("Tüm alanları doldurun");
      return;
    }

    try {
      const res = await fetch("/api/basvuru", {
        method: "POST",
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const newBasvuru = await res.json();
        setData([...data, newBasvuru]);
        toast.success("Başvuru eklendi");
        setOpen(false);
        setForm({ basvuruNo: "", unvan: "" });
      } else {
        toast.error("Kayıt hatası");
      }
    } catch (error) {
      toast.error("Sunucu hatası");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Başvurular</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white">Yeni Başvuru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Başvuru Ekle</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Başvuru No"
                name="basvuruNo"
                value={form.basvuruNo}
                onChange={handleChange}
              />
              <Input
                placeholder="Ünvan"
                name="unvan"
                value={form.unvan}
                onChange={handleChange}
              />
              <Button
                onClick={handleSubmit}
                className="w-full bg-green-600 text-white"
              >
                Kaydet
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
            <TableHead>Başvuru Tarihi</TableHead>
              <TableHead>Başvuru No</TableHead>
              <TableHead>Ünvan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, i) => (
              <TableRow key={i}>
                 <TableCell>{item.basvuruTarihi}</TableCell>
                <TableCell>{item.basvuruNo}</TableCell>
                <TableCell>{item.unvan}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export default function BasvuruDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [basvuruNo, setBasvuruNo] = useState("");
  const [unvan, setUnvan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!basvuruNo || !unvan) {
      toast.warning("Lütfen tüm alanları doldurun");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basvuruNo, unvan }),
      });

      if (res.ok) {
        toast.success("Başvuru başarıyla eklendi");
        onSuccess();
        setBasvuruNo("");
        setUnvan("");
        setOpen(false);
      } else {
        toast.error("Başvuru eklenemedi");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sunucu hatası");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Yeni Başvuru</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Yeni Başvuru Ekle</DialogTitle>
          <DialogDescription>
            Lütfen başvuru bilgilerini eksiksiz doldurun.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="basvuru-no">Başvuru No</Label>
            <Input
              id="basvuru-no"
              placeholder="örn. 2025-001"
              value={basvuruNo}
              onChange={(e) => setBasvuruNo(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="unvan">Başvuru Unvanı</Label>
            <Input
              id="unvan"
              placeholder="örn. Üretim Talebi"
              value={unvan}
              onChange={(e) => setUnvan(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Kaydediliyor..." : "Kaydet"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

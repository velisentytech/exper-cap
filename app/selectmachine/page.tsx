"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AccordionDataTable } from "@/components/accordion-data-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Toaster } from "sonner";
import { useMachineStore } from "@/store/machineStore";

export default function SelectMachinePage() {
  const [search, setSearch] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [hasData, setHasData] = useState(false);
  const [selectedMachineGroupId, setSelectedMachineGroupId] = useState<number | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGroupId = searchParams.get("groupId");
  const selectedMachines = useMachineStore((state) => state.selectedMachines);

  useEffect(() => {
    const checkData = async () => {
      try {
        const response = await fetch("/api/data?page=1&pageSize=1");
        const result = await response.json();
        setHasData(result.pagination.total > 0);
      } catch (error) {
        console.error("Veri kontrolü hatası:", error);
      }
    };
    checkData();
  }, [refreshTrigger]);

  const handleMachineGroupSelect = (id: number) => {
    setSelectedMachineGroupId(id);
  };

  const handleContinue = () => {
    // Word verisini localStorage'a al
    if (selectedMachineGroupId) {
      localStorage.setItem("wordData", JSON.stringify(selectedMachines));
      router.push("/word-preview");
    } else {
      router.push("/dashboard");
    }
  };

  const handleOpenConfirm = () => setIsConfirmOpen(true);
  const handleCloseConfirm = () => setIsConfirmOpen(false);
  const handleConfirm = () => {
    handleCloseConfirm();
    handleContinue();
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
      <Toaster />
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Makine Seçimi</h1>
        <p className="text-muted-foreground">
          Gruplara göre makine listesini inceleyip seçim yapabilirsiniz.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {selectedGroupId && (
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <CardHeader>
              <CardTitle className="text-blue-800 dark:text-blue-200">Seçili Grup ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg">{selectedGroupId}</p>
            </CardContent>
          </Card>
        )}
        {selectedMachineGroupId && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-green-800 dark:text-green-200">Seçili Makina Grup ID</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-lg">{selectedMachineGroupId}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Input
          placeholder="Makina ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <Button variant="outline" onClick={handleRefresh}>
          Listeyi Yenile
        </Button>
      </div>

      <AccordionDataTable
        search={search}
        refreshTrigger={refreshTrigger}
        onSelectMachineGroup={handleMachineGroupSelect}
        groupId={selectedGroupId}
        onRefresh={handleRefresh}
      />

      <div className="flex justify-end">
        <Button
          onClick={handleOpenConfirm}
          disabled={!hasData || !selectedMachineGroupId}
          className="px-6 py-2 text-base"
        >
          Devam Et
        </Button>
      </div>

      {/* Onay Dialogu */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Uyarı</DialogTitle>
          </DialogHeader>
          <p className="py-4">Puantaj sonrasında değişiklik yapılamaz. İşlemi tamamlamak istediğinize emin misiniz?</p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseConfirm}>Vazgeç</Button>
            <Button onClick={handleConfirm}>Devam et</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

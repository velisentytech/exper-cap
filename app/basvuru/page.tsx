"use client";

import BasvuruTable from "@/components/BasvuruTable";
import BasvuruDialog from "@/components/BasvuruDialog";
import { useState } from "react";

export default function BasvuruPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Başvurular</h1>
        <BasvuruDialog onSuccess={() => setRefreshKey((prev) => prev + 1)} />
      </div>
      <BasvuruTable key={refreshKey} />
    </div>
  );
}
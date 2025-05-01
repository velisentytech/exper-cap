"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // import Shadcn radio group
import { Label } from "@/components/ui/label"; // opsiyonel, açıklama için
import { toast } from "sonner"; // Sonner'ı import ediyoruz

type Group = {
  id: number;
  description: string;
  katsayi: number;
};

export default function GroupPage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await fetch("/api/group");
        const data = await res.json();
        setGroups(data);
      } catch (error) {
        console.error("Gruplar alınamadı:", error);
      }
    };

    fetchGroups();
  }, []);

  const handleContinue = () => {
    if (selectedGroupId) {
      router.push(`/selectmachine?groupId=${selectedGroupId}`);
    } else {
      //alert("Lütfen bir grup seçin.");
      toast.error("Lütfen bir grup seçiniz");
    }
  };

  return (
    <div className="p-6 max-w-max mx-auto">
      <h1 className="text-xl font-bold mb-4">Grup Seçimi</h1>

      <RadioGroup
        value={selectedGroupId}
        onValueChange={(val) => setSelectedGroupId(val)}
        className="space-y-3"
      >
        {groups.map((group) => (
          <div key={group.id} className="flex items-center space-x-3">
            <RadioGroupItem value={group.id.toString()} id={`group-${group.id}`} />
            <Label htmlFor={`group-${group.id}`}>
              {group.description} (Katsayı: {group.katsayi})
            </Label>
          </div>
        ))}
      </RadioGroup>

      {selectedGroupId && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
          Seçilen Grup ID: {selectedGroupId}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <Button onClick={handleContinue}>Devam Et</Button>
      </div>
    </div>
  );
}

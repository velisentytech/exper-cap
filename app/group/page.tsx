"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      toast.error("Lütfen bir grup seçiniz");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Grup Seçimi</CardTitle>
          <CardDescription>
            Lütfen bir grup seçerek devam ediniz.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <RadioGroup
            value={selectedGroupId}
            onValueChange={(val) => setSelectedGroupId(val)}
            className="space-y-3"
          >
            {groups.map((group) => (
              <div key={group.id} className="flex items-center space-x-3">
                <RadioGroupItem
                  value={group.id.toString()}
                  id={`group-${group.id}`}
                />
                <Label
                  htmlFor={`group-${group.id}`}
                  className="text-base font-medium"
                >
                  {group.description}{" "}
                 
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedGroupId && (
            <div className="text-sm text-muted-foreground">
              Seçilen Grup ID:{" "}
              <span className="font-semibold">{selectedGroupId}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={handleContinue} disabled={!selectedGroupId}>
            Devam Et
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

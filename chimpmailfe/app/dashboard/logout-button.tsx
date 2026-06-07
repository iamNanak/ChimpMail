"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/api";

export function LogoutButton() {
  const router = useRouter();
  async function onClick() {
    await logout();
    router.push("/login");
    router.refresh();
  }
  return (
    <Button variant="outline" size="sm" onClick={onClick}>
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  );
}

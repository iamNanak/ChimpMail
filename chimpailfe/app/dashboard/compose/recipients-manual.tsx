"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { isValidEmail } from "@/lib/csv";
import type { ParsedRow } from "@/lib/csv";

export function RecipientsManual({
  onAdd,
}: {
  onAdd: (row: ParsedRow) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleAdd() {
    if (!email.trim()) return;
    const valid = isValidEmail(email);
    onAdd({
      name: name.trim() || email.trim(),
      email: email.trim(),
      valid,
      reason: valid ? undefined : "Invalid email",
    });
    setName("");
    setEmail("");
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Input
        placeholder="Name (optional)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="sm:flex-1"
      />
      <Input
        placeholder="email@example.com"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleAdd();
          }
        }}
        className="sm:flex-1"
      />
      <Button onClick={handleAdd} disabled={!email.trim()}>
        <Plus className="h-4 w-4" />
        Add
      </Button>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { parsePastedText, type ParsedRow } from "@/lib/csv";
import { toast } from "sonner";

export function RecipientsPaste({
  onParsed,
}: {
  onParsed: (rows: ParsedRow[], duplicates: number) => void;
}) {
  const [text, setText] = useState("");

  function handleParse() {
    const result = parsePastedText(text);
    if (result.rows.length === 0) {
      toast.error("No lines to parse");
      return;
    }
    onParsed(result.rows, result.duplicates);
    toast.success(`Parsed ${result.rows.length} rows`);
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        rows={6}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"One per line, e.g.\nAlice, alice@example.com\nbob@example.com"}
      />
      <Button variant="outline" onClick={handleParse} disabled={text.trim() === ""}>
        Parse
      </Button>
    </div>
  );
}

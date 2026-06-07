"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { parseCsv, type ParsedRow } from "@/lib/csv";

export function RecipientsCsv({
  onParsed,
}: {
  onParsed: (rows: ParsedRow[], duplicates: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [filename, setFilename] = useState<string | null>(null);

  async function handleFile(file: File) {
    if (!/\.csv$/i.test(file.name) && file.type !== "text/csv") {
      toast.error("Please upload a .csv file");
      return;
    }
    const text = await file.text();
    const result = parseCsv(text);
    if (result.parseErrors.length > 0) {
      result.parseErrors.forEach((e) =>
        toast.warning(`Line ${e.line}: ${e.reason}`),
      );
    }
    if (result.rows.length === 0) {
      toast.error("No recipients found in CSV");
      return;
    }
    setFilename(file.name);
    onParsed(result.rows, result.duplicates);
    toast.success(`Loaded ${result.rows.length} rows from ${file.name}`);
  }

  return (
    <div
      className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed py-10"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f) void handleFile(f);
      }}
    >
      <Upload className="h-6 w-6 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Drop a <code>Name,Email</code> CSV here, or
      </p>
      <Button variant="outline" onClick={() => inputRef.current?.click()}>
        Choose CSV
      </Button>
      {filename && (
        <p className="text-xs text-muted-foreground">Loaded: {filename}</p>
      )}
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

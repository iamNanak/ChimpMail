"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { ParsedRow } from "@/lib/csv";

const ROW_DISPLAY_CAP = 200;

export function RecipientsTable({
  rows,
  onRemove,
  duplicates,
}: {
  rows: ParsedRow[];
  onRemove?: (index: number) => void;
  duplicates: number;
}) {
  const valid = rows.filter((r) => r.valid).length;
  const invalid = rows.length - valid;
  const shown = rows.slice(0, ROW_DISPLAY_CAP);
  const overflow = rows.length - shown.length;

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-6 text-center">
        No recipients yet.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="rounded bg-emerald-100 text-emerald-900 px-2 py-0.5 dark:bg-emerald-950 dark:text-emerald-200">
          {valid} valid
        </span>
        {invalid > 0 && (
          <span className="rounded bg-red-100 text-red-900 px-2 py-0.5 dark:bg-red-950 dark:text-red-200">
            {invalid} invalid
          </span>
        )}
        {duplicates > 0 && (
          <span className="rounded bg-amber-100 text-amber-900 px-2 py-0.5 dark:bg-amber-950 dark:text-amber-200">
            {duplicates} duplicates removed
          </span>
        )}
      </div>
      <div className="rounded-md border max-h-80 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="w-[80px]">Status</TableHead>
              {onRemove && <TableHead className="w-[40px]" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {shown.map((r, i) => (
              <TableRow
                key={`${r.email}-${i}`}
                className={!r.valid ? "bg-red-50 dark:bg-red-950/30" : undefined}
              >
                <TableCell className="truncate max-w-[200px]">{r.name}</TableCell>
                <TableCell className="truncate max-w-[260px]">{r.email}</TableCell>
                <TableCell className="text-xs">
                  {r.valid ? (
                    <span className="text-emerald-700 dark:text-emerald-300">ok</span>
                  ) : (
                    <span className="text-red-700 dark:text-red-300" title={r.reason}>
                      {r.reason ?? "invalid"}
                    </span>
                  )}
                </TableCell>
                {onRemove && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemove(i)}
                      aria-label="Remove"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {overflow > 0 && (
        <p className="text-xs text-muted-foreground">
          Showing first {ROW_DISPLAY_CAP} of {rows.length} rows. +{overflow} more will
          still be sent.
        </p>
      )}
    </div>
  );
}

"use client";

import { useSyncExternalStore } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  clearHistory,
  getHistorySnapshot,
  getServerSnapshot,
  subscribeHistory,
} from "./history-storage";

export function HistoryList() {
  const jobs = useSyncExternalStore(
    subscribeHistory,
    getHistorySnapshot,
    getServerSnapshot,
  );

  function handleClear() {
    clearHistory();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Send history</CardTitle>
          <CardDescription>
            Stored locally in your browser. Last 50 jobs.
          </CardDescription>
        </div>
        {jobs.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClear}>
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No jobs yet. Send your first batch from the Compose tab.
          </p>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Sent</TableHead>
                  <TableHead className="text-right">Failed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((j) => (
                  <TableRow key={j.jobId}>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(j.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{j.templateName}</TableCell>
                    <TableCell className="max-w-[260px] truncate" title={j.subject}>
                      {j.subject}
                    </TableCell>
                    <TableCell className="text-right">{j.sent}</TableCell>
                    <TableCell className="text-right">
                      {j.failed > 0 ? (
                        <span
                          className="text-red-700 dark:text-red-300"
                          title={j.failures.map((f) => f.email).join(", ")}
                        >
                          {j.failed}
                        </span>
                      ) : (
                        0
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

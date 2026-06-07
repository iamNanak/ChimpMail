import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ComposeForm } from "./compose/compose-form";
import { HistoryList } from "./history/history-list";
import { TEMPLATES } from "@/lib/templates";

export default function DashboardPage() {
  return (
    <Tabs defaultValue="compose" className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Pick a template, supply recipients, send.
          </p>
        </div>
        <TabsList>
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="compose">
        <ComposeForm templates={TEMPLATES} />
      </TabsContent>
      <TabsContent value="history">
        <HistoryList />
      </TabsContent>
    </Tabs>
  );
}

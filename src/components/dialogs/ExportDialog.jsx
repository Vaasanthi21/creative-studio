import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileJson, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

function downloadAsFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ExportDialog({ variant, open, onClose }) {
  if (!variant) return null;

  const handleExport = (format) => {
    const title = variant.title || "content";
    const safeName = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    if (format === "json") {
      downloadAsFile(JSON.stringify(variant, null, 2), `${safeName}.json`, "application/json");
    } else if (format === "csv") {
      const csv = `"Title","Content","Word Count"\n"${(variant.title || "").replace(/"/g, '""')}","${variant.content.replace(/"/g, '""')}","${variant.word_count || ""}"`;
      downloadAsFile(csv, `${safeName}.csv`, "text/csv");
    } else {
      downloadAsFile(variant.content, `${safeName}.txt`, "text/plain");
    }
    toast({ title: `Exported as ${format.toUpperCase()}`, duration: 1500 });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Export Variant</DialogTitle>
          <DialogDescription>Choose a format to export this content.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 pt-2">
          <Button variant="outline" className="justify-start gap-3 h-11" onClick={() => handleExport("json")}>
            <FileJson className="w-4 h-4 text-primary" /> JSON
          </Button>
          <Button variant="outline" className="justify-start gap-3 h-11" onClick={() => handleExport("csv")}>
            <FileSpreadsheet className="w-4 h-4 text-primary" /> CSV
          </Button>
          <Button variant="outline" className="justify-start gap-3 h-11" onClick={() => handleExport("txt")}>
            <FileText className="w-4 h-4 text-primary" /> Plain Text
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
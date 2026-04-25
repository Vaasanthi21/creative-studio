import React, { useState } from "react";
import { Copy, Check, Maximize2, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function VariantCard({ variant, index, onExpand, onDelete, onExport }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(variant.content);
    setCopied(true);
    toast({ title: "Copied to clipboard", duration: 1500 });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-5 flex flex-col gap-3 group hover:border-muted-foreground/30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Variant {index + 1}
          </span>
          {variant.title && (
            <span className="text-xs text-foreground font-medium">
              — {variant.title}
            </span>
          )}
        </div>
        <span className="text-[10px] text-muted-foreground">
          {variant.word_count || variant.content.split(/\s+/).length} words
        </span>
      </div>

      <div className="text-sm text-secondary-foreground leading-relaxed whitespace-pre-wrap flex-1 max-h-48 overflow-y-auto">
        {variant.content}
      </div>

      <div className="flex items-center gap-1.5 pt-1 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={handleCopy}
        >
          {copied ? <Check className="w-3.5 h-3.5 mr-1" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onExpand(variant)}
        >
          <Maximize2 className="w-3.5 h-3.5 mr-1" />
          Expand
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs text-muted-foreground hover:text-foreground"
          onClick={() => onExport(variant)}
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Export
        </Button>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-muted-foreground hover:text-destructive ml-auto"
            onClick={() => onDelete(variant)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}
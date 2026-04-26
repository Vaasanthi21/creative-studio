import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchHistory, deleteHistoryEntry } from "@/services/aiService";
import { supabase } from "@/api/supabaseClient";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Trash2, Eye, Clock, Loader2 } from "lucide-react";
import VariantExpandedModal from "@/components/generate/VariantExpandedModal";
import ExportDialog from "@/components/dialogs/ExportDialog";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { toast } from "@/components/ui/use-toast";
import { getPersonaById } from "@/lib/personas";

export default function History() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [expandedVariant, setExpandedVariant] = useState(null);
  const [exportVariant, setExportVariant] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const { data: history = [], isLoading } = useQuery({
    queryKey: ["contentHistory"],
    queryFn: () => fetchHistory(supabase, 50),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteHistoryEntry(supabase, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contentHistory"] });
      toast({ title: "Entry deleted", duration: 1500 });
      setDeleteTarget(null);
    },
  });

  const filtered = history
    .filter((h) => h.status !== "deleted")
    .filter((h) =>
      search ? h.topic.toLowerCase().includes(search.toLowerCase()) : true
    );

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-lg font-display font-bold text-foreground">Content History</h2>
          <p className="text-xs text-muted-foreground">{filtered.length} entries</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search topics..."
            className="pl-9 bg-muted border-border text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <Clock className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No content history yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => {
            const persona = getPersonaById(entry.persona);
            return (
              <div
                key={entry.id}
                className="bg-card border border-border rounded-lg p-4 hover:border-muted-foreground/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-foreground truncate">{entry.topic}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge
                        variant="secondary"
                        className="text-[10px]"
                        style={{
                          background: `${persona.color}1f`,
                          color: persona.color,
                          border: `1px solid ${persona.color}40`,
                        }}
                      >
                        {persona.label}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {entry.content_type}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">
                        {entry.created_date ? format(new Date(entry.created_date), "MMM d, yyyy · h:mm a") : ""}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => setSelectedEntry(selectedEntry?.id === entry.id ? null : entry)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => setDeleteTarget(entry)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Expanded variants */}
                {selectedEntry?.id === entry.id && entry.variants && (
                  <div className="mt-3 pt-3 border-t border-border space-y-2">
                    {entry.variants.map((v, i) => (
                      <div
                        key={i}
                        className="bg-muted rounded-md p-3 cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => setExpandedVariant(v)}
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                          Variant {i + 1}{v.title ? ` — ${v.title}` : ""}
                        </p>
                        <p className="text-xs text-secondary-foreground line-clamp-2">
                          {v.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <VariantExpandedModal
        variant={expandedVariant}
        open={!!expandedVariant}
        onClose={() => setExpandedVariant(null)}
        onExport={setExportVariant}
      />
      <ExportDialog
        variant={exportVariant}
        open={!!exportVariant}
        onClose={() => setExportVariant(null)}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteMutation.mutate(deleteTarget.id)}
        title="Delete this entry?"
        description="This will soft-delete the content history entry."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
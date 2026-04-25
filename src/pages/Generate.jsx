import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { getPersonaById } from "@/lib/personas";
import PersonaSelector from "@/components/generate/PersonaSelector";
import GenerationForm from "@/components/generate/GenerationForm";
import VariantCard from "@/components/generate/VariantCard";
import VariantExpandedModal from "@/components/generate/VariantExpandedModal";
import ExportDialog from "@/components/dialogs/ExportDialog";
import { Loader2 } from "lucide-react";

export default function Generate() {
  const { activePersona, setActivePersona } = useOutletContext();
  const persona = getPersonaById(activePersona);
  const [variants, setVariants] = useState([]);
  const [expandedVariant, setExpandedVariant] = useState(null);
  const [exportVariant, setExportVariant] = useState(null);

  const generateMutation = useMutation({
    mutationFn: async (params) => {
      const toneLabel = params.tone < 30 ? "formal" : params.tone < 70 ? "balanced" : "casual";
      const lengthLabel = params.length < 30 ? "short (100-150 words)" : params.length < 70 ? "medium (200-300 words)" : "extended (400-600 words)";

      const prompt = `You are a content creator for the "${persona.label}" brand (${persona.description}).

Generate 3 distinct variants of a "${params.contentType}" about the following topic:
"${params.topic}"

Tone: ${toneLabel}
Target length per variant: ${lengthLabel}
${params.keywords ? `Keywords to include: ${params.keywords}` : ""}

For each variant, provide a different angle or approach. Make sure the content is professional, engaging, and brand-appropriate.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            variants: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string", description: "Short title for this variant" },
                  content: { type: "string", description: "The full content" },
                  word_count: { type: "number", description: "Approximate word count" },
                },
              },
            },
          },
        },
      });

      // Save to history
      await base44.entities.ContentHistory.create({
        topic: params.topic,
        persona: activePersona,
        persona_label: persona.label,
        content_type: params.contentType,
        tone: params.tone,
        length: params.length,
        keywords: params.keywords,
        variants: result.variants,
        status: "completed",
      });

      return result.variants;
    },
    onSuccess: (data) => {
      setVariants(data);
      toast({ title: "Content generated successfully!", duration: 2000 });
    },
    onError: (error) => {
      toast({ title: "Generation failed", description: error.message, variant: "destructive" });
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <PersonaSelector activePersona={activePersona} onSelect={setActivePersona} />
      <GenerationForm
        activePersona={activePersona}
        onGenerate={(params) => generateMutation.mutate(params)}
        isGenerating={generateMutation.isPending}
      />

      {/* Loading state */}
      {generateMutation.isPending && (
        <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Generating 3 variants...</p>
        </div>
      )}

      {/* Variants */}
      {variants.length > 0 && !generateMutation.isPending && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
            <span className="w-3 h-px bg-muted-foreground inline-block" />
            Generated Variants
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {variants.map((v, i) => (
              <VariantCard
                key={i}
                variant={v}
                index={i}
                onExpand={setExpandedVariant}
                onExport={setExportVariant}
              />
            ))}
          </div>
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
    </div>
  );
}
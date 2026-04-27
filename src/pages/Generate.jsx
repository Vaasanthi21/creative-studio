import React, { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { generateContent, saveToHistory } from "@/services/aiService";
import { supabase } from "@/api/supabaseClient";
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
      const toneLabel =
        params.tone < 30 ? "formal" : params.tone < 70 ? "balanced" : "casual";

      const lengthLabel =
        params.length < 30
          ? "short (100-150 words)"
          : params.length < 70
          ? "medium (200-300 words)"
          : "extended (400-600 words)";

      // 🔥 SINGLE MODE
      if (params.mode === "single") {
        const prompt = `You are a content creator for the "${persona.label}" brand (${persona.description}).

Generate 3 distinct variants of a "${params.contentType}" about:
"${params.topic}"

Tone: ${toneLabel}
Target length: ${lengthLabel}
${params.keywords ? `Keywords: ${params.keywords}` : ""}

Respond in JSON format:
{
  "variants": [
    { "title": "", "content": "", "word_count": 0 }
  ]
}`;

        const result = await generateContent({ prompt });
        
        await saveToHistory(
          {
            topic: params.topic,
            persona: activePersona,
            persona_label: persona.label,
            content_type: params.contentType,
            tone: params.tone,
            length: params.length,
            keywords: params.keywords,
            variants: result,
            status: "completed",
          },
          supabase
        );

        return result;
      }

      // 🔥 BATCH MODE
      if (params.mode === "batch") {
        const allResults = [];

        for (let topic of params.topics) {
          const prompt = `You are a content creator for the "${persona.label}" brand (${persona.description}).

Generate 3 distinct variants of a "${params.contentType}" about:
"${topic}"

Tone: ${toneLabel}
Target length: ${lengthLabel}
${params.keywords ? `Keywords: ${params.keywords}` : ""}

Respond in JSON format:
{
  "variants": [
    { "title": "", "content": "", "word_count": 0 }
  ]
}`;

          const result = await generateContent({ prompt });

          // tag each variant with topic
          const tagged = result.map((v) => ({
            ...v,
            topic,
          }));

          allResults.push(...tagged);
        }

        return allResults;
      }
    },

    onSuccess: (data) => {
      setVariants(data);
      toast({ title: "Content generated successfully!", duration: 2000 });
    },

    onError: (error) => {
      let errorMessage = error.message || "Unknown error";

      if (error.message?.includes("API key")) {
        errorMessage = "AI API key not configured.";
      }

      toast({
        title: "Generation failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <PersonaSelector
        activePersona={activePersona}
        onSelect={setActivePersona}
      />

      <GenerationForm
        activePersona={activePersona}
        onGenerate={(params) => generateMutation.mutate(params)}
        isGenerating={generateMutation.isPending}
      />

      {/* Loading */}
      {generateMutation.isPending && (
        <div className="bg-card border border-border rounded-lg p-12 flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Generating content...
          </p>
        </div>
      )}

      {/* Results */}
      {variants.length > 0 && !generateMutation.isPending && (
        <div className="space-y-3">
          <p className="text-[10px] font-semibold uppercase text-muted-foreground">
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
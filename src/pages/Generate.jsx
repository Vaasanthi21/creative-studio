import React, { useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { generateContent, saveToHistory } from "@/services/aiService";
import { supabase } from "@/api/supabaseClient";
import { useMutation } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import PersonaSelector from "@/components/generate/PersonaSelector";
import GenerationForm from "@/components/generate/GenerationForm";
import VariantCard from "@/components/generate/VariantCard";
import VariantExpandedModal from "@/components/generate/VariantExpandedModal";
import ExportDialog from "@/components/dialogs/ExportDialog";
import { Loader2 } from "lucide-react";

const PLATFORM_DETAILS = {
  linkedin: {
    label: "LinkedIn",
    description: "professional, business-focused audience",
  },
  instagram: {
    label: "Instagram",
    description: "visual-first, engaging social audience",
  },
  facebook: {
    label: "Facebook",
    description: "community-focused and conversational audience",
  },
  youtube: {
    label: "YouTube",
    description: "video-focused audience with engaging titles and descriptions",
  },
};

export default function Generate() {
  const { activePersona, setActivePersona } = useOutletContext();
  const platform =
  PLATFORM_DETAILS[activePersona] || PLATFORM_DETAILS.linkedin;

  const [variants, setVariants] = useState([]);
  const [batchItems, setBatchItems] = useState([]);
  const cancelRef = useRef(false);
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
        const prompt = `You are a social media content creator.
        
        Platform: ${platform.label}
        Audience style: ${platform.description}
        Content format: ${params.contentType}

Generate 3 distinct variants about:
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
            persona_label: platform.label,
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

      // 🔥 BATCH MODE (UPDATED)
      if (params.mode === "batch") {
        cancelRef.current = false;
        const initialItems = params.topics.map((t) => ({
          topic: t,
          status: "pending",
          variants: [],
        }));

        setBatchItems(initialItems);

        const allResults = [];

        for (let i = 0; i < params.topics.length; i++) {
          if (cancelRef.current) {
            setBatchItems((prev) =>
              prev.map((item, idx) =>
                idx >= i && item.status === "pending"
                  ? { ...item, status: "cancelled" }
                  : item
              )
            );
            break;
          }

          const topic = params.topics[i];

          // mark processing
          setBatchItems((prev) =>
            prev.map((item, idx) =>
              idx === i ? { ...item, status: "processing" } : item
            )
          );

          try {
            const prompt = `You are a social media content creator.
            
            Platform: ${platform.label}
            Audience style: ${platform.description}
            Content format: ${params.contentType}

Generate 3 distinct variants about:
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
            
            // mark completed
            setBatchItems((prev) =>
              prev.map((item, idx) =>
                idx === i
                  ? { ...item, status: "completed", variants: result }
                  : item
              )
            );

            allResults.push(...result);

            // ✅ SAVE EACH TOPIC TO HISTORY
            await saveToHistory(
              {
                topic,
                persona: activePersona,
                persona_label: platform.label,
                content_type: params.contentType,
                tone: params.tone,
                length: params.length,
                keywords: params.keywords,
                variants: result,
                status: "completed",
              },
              supabase
            );
          } catch (err) {
            setBatchItems((prev) =>
              prev.map((item, idx) =>
                idx === i ? { ...item, status: "failed" } : item
              )
            );
          }
        }

        return allResults;
      }
    },

    onSuccess: (data) => {
      setVariants(data);
      toast({
         title: "Content generated successfully!",
         duration: 3000 
      });
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
        duration: 4000,
      });
    },
  });

  return (
    <div className="p-4 md:p-6 space-y-5 max-w-5xl mx-auto">
      <PersonaSelector
        activePlatform={activePersona}
        onSelect={setActivePersona}
      />

      <GenerationForm
        activePersona={activePersona}
        onGenerate={(params) => generateMutation.mutate(params)}
        isGenerating={generateMutation.isPending}
      />

      {/* 🔴 Cancel Button */}
      {generateMutation.isPending && batchItems.length > 0 && (
        <div className="flex justify-end">
          <button
          type="button"
          onClick={() => {
            cancelRef.current = true;
          }}
          className="px-4 py-2 rounded-md border border-red-500/30 bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* 🔵 Batch Progress */}
      {batchItems.length > 0 && (
        <div className="space-y-2">
          {batchItems.map((item, idx) => (
            <div key={idx} className="text-sm border p-2 rounded">
              <strong>{item.topic}</strong> — {item.status}
            </div>
          ))}
        </div>
      )}

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
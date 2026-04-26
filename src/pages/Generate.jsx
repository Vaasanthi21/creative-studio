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
      const toneLabel = params.tone < 30 ? "formal" : params.tone < 70 ? "balanced" : "casual";
      const lengthLabel = params.length < 30 ? "short (100-150 words)" : params.length < 70 ? "medium (200-300 words)" : "extended (400-600 words)";

      const prompt = `You are a content creator for the "${persona.label}" brand (${persona.description}).

Generate 3 distinct variants of a "${params.contentType}" about the following topic:
"${params.topic}"

Tone: ${toneLabel}
Target length per variant: ${lengthLabel}
${params.keywords ? `Keywords to include: ${params.keywords}` : ""}

For each variant, provide a different angle or approach. Make sure the content is professional, engaging, and brand-appropriate.

Respond in JSON format with this exact structure:
{
  "variants": [
    {
      "title": "Short title for variant 1",
      "content": "Full content for variant 1",
      "word_count": 150
    },
    {
      "title": "Short title for variant 2",
      "content": "Full content for variant 2",
      "word_count": 180
    },
    {
      "title": "Short title for variant 3",
      "content": "Full content for variant 3",
      "word_count": 160
    }
  ]
}`;

      console.log('Starting AI content generation...');

      try {
        // Generate content using AI service
        const variants = await generateContent({ prompt });
        console.log('AI Generation Result:', variants);

        // Save to history
        await saveToHistory({
          topic: params.topic,
          persona: activePersona,
          persona_label: persona.label,
          content_type: params.contentType,
          tone: params.tone,
          length: params.length,
          keywords: params.keywords,
          variants: variants,
          status: "completed",
        }, supabase);

        return variants;
      } catch (error) {
        console.error('Generation error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      setVariants(data);
      toast({ title: "Content generated successfully!", duration: 2000 });
    },
    onError: (error) => {
      console.error('Mutation error:', error);
      let errorMessage = error.message || "Unknown error occurred";
      
      // Provide helpful messages based on error type
      if (error.message?.includes('API key')) {
        errorMessage = "AI API key not configured. Please add VITE_AI_API_KEY to .env.local. Get a free key at https://openrouter.ai/";
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
      }
      
      toast({ 
        title: "Generation failed", 
        description: errorMessage, 
        variant: "destructive",
        duration: 8000 
      });
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
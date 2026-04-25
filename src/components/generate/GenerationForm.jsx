import React, { useState, useEffect, useCallback } from "react";
import { getPersonaById } from "@/lib/personas";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Loader2 } from "lucide-react";

export default function GenerationForm({ activePersona, onGenerate, isGenerating }) {
  const persona = getPersonaById(activePersona);
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState(persona.contentTypes[0]);
  const [tone, setTone] = useState([50]);
  const [length, setLength] = useState([50]);
  const [keywords, setKeywords] = useState("");

  useEffect(() => {
    setContentType(persona.contentTypes[0]);
  }, [activePersona]);

  const charCount = topic.length;
  const isValid = topic.trim().length > 0 && contentType;

  const handleSubmit = useCallback(() => {
    if (!isValid || isGenerating) return;
    onGenerate({
      topic: topic.trim(),
      contentType,
      tone: tone[0],
      length: length[0],
      keywords: keywords.trim(),
    });
  }, [topic, contentType, tone, length, keywords, isValid, isGenerating, onGenerate]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleSubmit]);

  const toneLabel = tone[0] < 30 ? "Formal" : tone[0] < 70 ? "Balanced" : "Casual";
  const lengthLabel = length[0] < 30 ? "Short" : length[0] < 70 ? "Medium" : "Extended";

  return (
    <div className="bg-card border border-border rounded-lg p-5 space-y-5">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
        <span className="w-3 h-px bg-muted-foreground inline-block" />
        Generation Parameters
      </p>

      {/* Topic */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Topic *
          </Label>
          <span className={`text-[10px] ${charCount > 450 ? "text-destructive" : "text-muted-foreground"}`}>
            {charCount}/500
          </span>
        </div>
        <Textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value.slice(0, 500))}
          placeholder="What would you like to generate content about?"
          className="bg-muted border-border text-foreground text-sm resize-none h-20 placeholder:text-muted-foreground"
        />
      </div>

      {/* Content type + Tone + Length */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Content Type *
          </Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="bg-muted border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {persona.contentTypes.map((ct) => (
                <SelectItem key={ct} value={ct}>
                  {ct}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Keywords (optional)
          </Label>
          <Input
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="e.g. AI, future, skills"
            className="bg-muted border-border text-sm placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Tone
            </Label>
            <span className="text-[11px] text-foreground font-medium">{toneLabel}</span>
          </div>
          <Slider
            value={tone}
            onValueChange={setTone}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Formal</span>
            <span>Casual</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Length
            </Label>
            <span className="text-[11px] text-foreground font-medium">{lengthLabel}</span>
          </div>
          <Slider
            value={length}
            onValueChange={setLength}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>Short</span>
            <span>Extended</span>
          </div>
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isValid || isGenerating}
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm h-10"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Content
            <kbd className="ml-2 text-[10px] opacity-60 hidden sm:inline">⌘ Enter</kbd>
          </>
        )}
      </Button>
    </div>
  );
}
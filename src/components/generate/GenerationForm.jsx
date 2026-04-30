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

const MAX_BATCH_TOPICS = 10;

export default function GenerationForm({ activePersona, onGenerate, isGenerating }) {
  
  const [mode, setMode] = useState("single");
  const [topic, setTopic] = useState("");
  const [batchTopics, setBatchTopics] = useState("");
  const [tone, setTone] = useState([50]);
  const [length, setLength] = useState([50]);
  const [keywords, setKeywords] = useState("");
  const [contentType, setContentType] = useState("text");

  const batchLines = batchTopics
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const batchOverLimit = batchLines.length > MAX_BATCH_TOPICS;
  const charCount = topic.length;

  const isValid =
    mode === "single"
      ? topic.trim().length > 0 && contentType
      : batchLines.length > 0 && !batchOverLimit && contentType;

  const handleSubmit = useCallback(() => {
    if (!isValid || isGenerating) return;

    onGenerate({
      mode,
      topic: topic.trim(),
      topics: batchLines,
      contentType,
      tone: tone[0],
      length: length[0],
      keywords: keywords.trim(),
    });
  }, [
    mode,
    topic,
    batchLines,
    contentType,
    tone,
    length,
    keywords,
    isValid,
    isGenerating,
    onGenerate,
  ]);

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

      {/* Mode */}
      <div className="grid grid-cols-2 gap-2 bg-muted p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setMode("single")}
          className={`rounded-md py-2 text-sm font-medium transition-colors ${
            mode === "single"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Single Post
        </button>

        <button
          type="button"
          onClick={() => setMode("batch")}
          className={`rounded-md py-2 text-sm font-medium transition-colors ${
            mode === "batch"
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Batch Generation
        </button>
      </div>

      {/* Single Topic */}
      {mode === "single" && (
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
      )}

      {/* Batch Topics */}
      {mode === "batch" && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Batch Topics *
            </Label>
            <span className={`text-[10px] ${batchOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
              {batchLines.length}/{MAX_BATCH_TOPICS}
            </span>
          </div>

          <Textarea
            value={batchTopics}
            onChange={(e) => setBatchTopics(e.target.value)}
            placeholder={`Enter up to ${MAX_BATCH_TOPICS} topics, one per line...\n\nExample:\nAI career tips for students\nHow startups can use automation\nLinkedIn growth strategy for founders`}
            className="bg-muted border-border text-foreground text-sm resize-none h-32 placeholder:text-muted-foreground"
          />

          {batchOverLimit && (
            <p className="text-xs text-destructive">
              You can add only {MAX_BATCH_TOPICS} topics. Remove {batchLines.length - MAX_BATCH_TOPICS} topic
              {batchLines.length - MAX_BATCH_TOPICS > 1 ? "s" : ""} to continue.
            </p>
          )}
        </div>
      )}

      {/* Content type + Keywords */}
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
              <SelectItem value="text">Text Only</SelectItem>
              <SelectItem value="image">Image</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="text-image">Text + Image</SelectItem>
              <SelectItem value="text-video">Text + Video</SelectItem>
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

      {/* Tone + Length */}
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
            {mode === "batch" ? "Generating Batch..." : "Generating..."}
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            {mode === "batch" ? "Start Batch Generation" : "Generate Content"}
            <kbd className="ml-2 text-[10px] opacity-60 hidden sm:inline">⌘ Enter</kbd>
          </>
        )}
      </Button>
    </div>
  );
}
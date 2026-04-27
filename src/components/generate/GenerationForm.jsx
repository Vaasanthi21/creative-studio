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

export default function GenerationForm({ activePersona, onGenerate, isGenerating, onBatchGenerate }) {
  const persona = getPersonaById(activePersona);
  const [topic, setTopic] = useState("");
  const [batchMode, setBatchMode] = useState(false);
  const [batchTopics, setBatchTopics] = useState("");
  const [platform, setPlatform] = useState("LinkedIn");
  const [contentType, setContentType] = useState(persona.contentTypes[0]);
  const [tone, setTone] = useState([50]);
  const [length, setLength] = useState([50]);
  const [keywords, setKeywords] = useState("");

  const platforms = [
    "LinkedIn",
    "Instagram",
    "Facebook",
    "Twitter/X",
    "YouTube",
  ];

  const contentTypesByPlatform = {
    LinkedIn: ["LinkedIn Post", "Article", "Carousel Content"],
    Instagram: ["Image Caption", "Reel Script", "Carousel Content", "Story Text"],
    Facebook: ["Facebook Caption", "Post", "Event Description"],
    "Twitter/X": ["Twitter Thread", "Tweet", "Twitter Poll"],
    YouTube: ["YouTube Description", "Video Script", "Shorts Script"],
  };

  useEffect(() => {
    setContentType(contentTypesByPlatform[platform][0]);
  }, [platform]);

  useEffect(() => {
    setContentType(persona.contentTypes[0]);
  }, [activePersona]);

  const charCount = topic.length;
  const batchTopicsList = batchTopics
    .split('\n')
    .map(t => t.trim())
    .filter(t => t.length > 0);
  const isValid = batchMode ? batchTopicsList.length > 0 : topic.trim().length > 0 && contentType;

  const handleSubmit = useCallback(() => {
    if (!isValid || isGenerating) return;
    
    if (batchMode) {
      onBatchGenerate({
        topics: batchTopicsList,
        platform,
        contentType,
        tone: tone[0],
        length: length[0],
        keywords: keywords.trim(),
      });
    } else {
      onGenerate({
        topic: topic.trim(),
        platform,
        contentType,
        tone: tone[0],
        length: length[0],
        keywords: keywords.trim(),
      });
    }
  }, [topic, batchMode, batchTopicsList, platform, contentType, tone, length, keywords, isValid, isGenerating, onGenerate, onBatchGenerate]);

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
            {batchMode ? "Topics (one per line) *" : "Topic *"}
          </Label>
          {!batchMode && (
            <span className={`text-[10px] ${charCount > 450 ? "text-destructive" : "text-muted-foreground"}`}>
              {charCount}/500
            </span>
          )}
        </div>
        {batchMode ? (
          <Textarea
            value={batchTopics}
            onChange={(e) => setBatchTopics(e.target.value)}
            placeholder={"AI in healthcare\nMachine learning basics\nFuture of technology\nDigital transformation"}
            className="bg-muted border-border text-foreground text-sm resize-none h-32 placeholder:text-muted-foreground"
          />
        ) : (
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value.slice(0, 500))}
            placeholder="What would you like to generate content about?"
            className="bg-muted border-border text-foreground text-sm resize-none h-20 placeholder:text-muted-foreground"
          />
        )}
        {batchMode && (
          <p className="text-[10px] text-muted-foreground">
            {batchTopicsList.length} topic{batchTopicsList.length !== 1 ? 's' : ''} entered
          </p>
        )}
      </div>

      {/* Batch mode toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setBatchMode(!batchMode)}
          className={cn(
            "text-xs px-3 py-1.5 rounded-md border transition-colors",
            batchMode
              ? "bg-primary/10 border-primary/30 text-primary"
              : "bg-muted border-border text-muted-foreground hover:text-foreground"
          )}
        >
          {batchMode ? "Batch Mode ON" : "Batch Mode OFF"}
        </button>
        {batchMode && (
          <p className="text-[10px] text-muted-foreground">
            Generate content for multiple topics at once
          </p>
        )}
      </div>

      {/* Platform + Content type + Keywords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Platform *
          </Label>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="bg-muted border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platforms.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Content Type *
          </Label>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="bg-muted border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {contentTypesByPlatform[platform].map((ct) => (
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
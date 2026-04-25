import React from "react";
import { PERSONAS } from "@/lib/personas";
import { GraduationCap, Youtube, Briefcase, Building2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap = {
  GraduationCap,
  Youtube,
  Briefcase,
  Building2,
};

export default function PersonaSelector({ activePersona, onSelect }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
        <span className="w-3 h-px bg-muted-foreground inline-block" />
        Select Persona
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PERSONAS.map((persona) => {
          const Icon = iconMap[persona.icon];
          const isActive = activePersona === persona.id;
          return (
            <TooltipProvider key={persona.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelect(persona.id)}
                    className={`flex flex-col gap-3 p-4 rounded-lg border text-left transition-all duration-150 ${
                      isActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border bg-card hover:bg-muted hover:border-muted-foreground/30 hover:-translate-y-0.5"
                    }`}
                  >
                    <div
                      className="w-9 h-9 rounded-md border flex items-center justify-center"
                      style={{
                        borderColor: persona.color,
                        color: persona.color,
                      }}
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs font-display font-semibold text-foreground">
                        {persona.label}
                      </p>
                      <p className="text-[11px] text-secondary-foreground leading-snug mt-0.5">
                        {persona.description}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {persona.dots.map((dot, i) => (
                        <span
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{ background: dot }}
                        />
                      ))}
                    </div>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-semibold text-xs mb-1">{persona.label}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Content types: {persona.contentTypes.join(", ")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    </div>
  );
}
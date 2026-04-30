import React from "react";
import { platforms } from "@/lib/personas";
import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const iconMap = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
};

export default function PersonaSelector({ activePlatform, onSelect }) {
  return (
    <div className="bg-card border border-border rounded-lg p-5">
      <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3 flex items-center gap-1.5">
        <span className="w-3 h-px bg-muted-foreground inline-block" />
        Select Platform
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {platforms.map((platform) => {
          const Icon = iconMap[platform.id];
          const isActive = activePlatform === platform.id;

          return (
            <TooltipProvider key={platform.id} delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onSelect(platform.id)}
                    className={`flex flex-col gap-3 p-4 rounded-lg border text-left transition-all duration-150 ${
                      isActive
                        ? "border-primary bg-primary/5 scale-[1.02]"
                        : "border-border bg-card hover:bg-muted/70 hover:border-primary/40 hover:-translate-y-1 hover:shadow-md"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-md border flex items-center justify-center bg-primary/10"
                      style={{
                        borderColor: platform.color,
                        color: platform.color,
                      }}
                    >
                      {Icon && <Icon className="w-5 h-5" />}
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {platform.label}
                      </p>
                      <p className="text-[11px] text-secondary-foreground leading-snug mt-0.5">
                        {platform.description}
                      </p>
                    </div>
                  </button>
                </TooltipTrigger>

                <TooltipContent 
                 side="bottom" 
                 className="max-w-xs bg-primary text-primary-foreground border-none shadow-lg"
                >
                  <p className="font-semibold text-sm text-primary-foreground mb-1">
                    {platform.label}
                  </p>
                  <p className="text-xs text-primary-foreground/90">
                    {platform.description}
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
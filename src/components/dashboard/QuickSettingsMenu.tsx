import { useState } from "react";
import { Settings, Type, AlignLeft, Target, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface QuickSettingsMenuProps {
  currentTone: string;
  currentLength: string;
  includeCTA: boolean;
  onSettingChange: (setting: string, value: any) => void;
  onRegenerateAll: () => void;
}

export const QuickSettingsMenu = ({
  currentTone,
  currentLength,
  includeCTA,
  onSettingChange,
  onRegenerateAll,
}: QuickSettingsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toneOptions = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'thought-leader', label: 'Thought Leader' },
  ];

  const lengthOptions = [
    { value: 'short', label: 'Short' },
    { value: 'medium', label: 'Medium' },
    { value: 'long', label: 'Long' },
  ];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 right-4 w-8 h-8 rounded-full transition-all duration-300",
            "text-text-muted hover:text-brand-purple hover:bg-brand-purple/10",
            isOpen && "rotate-15 text-brand-purple"
          )}
        >
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent
        align="end"
        className="w-[220px] bg-navy-800 border border-brand-purple/30 shadow-glow animate-scale-in"
      >
        {/* Adjust Tone */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-white hover:bg-white/10">
            <Type className="w-4 h-4 mr-2" />
            <span>Adjust Tone</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-navy-800 border-brand-purple/30">
            {toneOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSettingChange('tone', option.value)}
                className={cn(
                  "text-white hover:bg-white/10",
                  currentTone === option.value && "bg-brand-purple/20 text-brand-purple"
                )}
              >
                {option.label}
                {currentTone === option.value && (
                  <span className="ml-auto text-brand-purple">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Change Length */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="text-white hover:bg-white/10">
            <AlignLeft className="w-4 h-4 mr-2" />
            <span>Change Length</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="bg-navy-800 border-brand-purple/30">
            {lengthOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSettingChange('length', option.value)}
                className={cn(
                  "text-white hover:bg-white/10",
                  currentLength === option.value && "bg-brand-purple/20 text-brand-purple"
                )}
              >
                {option.label}
                {currentLength === option.value && (
                  <span className="ml-auto text-brand-purple">✓</span>
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Toggle CTA */}
        <DropdownMenuItem
          onClick={() => onSettingChange('includeCTA', !includeCTA)}
          className="text-white hover:bg-white/10"
        >
          <Target className="w-4 h-4 mr-2" />
          <span>Toggle CTA</span>
          <span className="ml-auto">
            <div className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center",
              includeCTA ? "bg-brand-purple border-brand-purple" : "border-white/30"
            )}>
              {includeCTA && <span className="text-white text-xs">✓</span>}
            </div>
          </span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-white/10" />

        {/* Regenerate All */}
        <DropdownMenuItem
          onClick={onRegenerateAll}
          className="text-red-400 hover:bg-red-400/10 hover:text-red-300"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          <span>Regenerate All</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
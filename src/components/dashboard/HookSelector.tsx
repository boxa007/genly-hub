import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Hook {
  id: number;
  text: string;
  fullText: string;
}

interface HookSelectorProps {
  hooks: string[];
  postBody: string;
  onSelectHook: (index: number) => void;
}

export const HookSelector = ({ hooks, postBody, onSelectHook }: HookSelectorProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [previewIndex, setPreviewIndex] = useState<number>(-1);

  const hooksData: Hook[] = hooks.map((hook, index) => ({
    id: index,
    text: hook.split('\n\n')[0].slice(0, 80) + (hook.length > 80 ? '...' : ''),
    fullText: hook,
  }));

  const handlePreview = (index: number) => {
    setPreviewIndex(index);
    setSelectedIndex(index);
  };

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && selectedIndex > 0) {
      setSelectedIndex(selectedIndex - 1);
      setPreviewIndex(selectedIndex - 1);
    } else if (direction === 'next' && selectedIndex < hooks.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      setPreviewIndex(selectedIndex + 1);
    }
  };

  const handleUseHook = () => {
    if (selectedIndex >= 0) {
      onSelectHook(selectedIndex);
    }
  };

  return (
    <div className="card-glass rounded-2xl p-8 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-white">Choose Your Hook</h2>
        <p className="text-text-secondary text-sm">
          Select the opening that best captures attention
        </p>
      </div>

      {/* Hook Cards */}
      <div className="space-y-3">
        {hooksData.map((hook, index) => (
          <div
            key={hook.id}
            onClick={() => handlePreview(index)}
            className={cn(
              "relative p-4 rounded-lg border transition-all duration-300 cursor-pointer group",
              selectedIndex === index
                ? "border-2 border-brand-purple bg-brand-purple/10 shadow-glow"
                : "border-white/10 bg-white/5 hover:border-brand-purple/50 hover:scale-[1.01]"
            )}
          >
            <div className="flex items-start space-x-3">
              {/* Radio Button */}
              <div
                className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200",
                  selectedIndex === index
                    ? "border-brand-purple bg-brand-purple"
                    : "border-white/30 bg-transparent"
                )}
              >
                {selectedIndex === index && (
                  <div className="w-2 h-2 rounded-full bg-white animate-scale-in" />
                )}
              </div>

              {/* Hook Preview */}
              <div className="flex-1">
                <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                  {hook.fullText}
                </p>
              </div>
            </div>

            {/* Selected Indicator */}
            {selectedIndex === index && (
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-brand-purple flex items-center justify-center animate-scale-in">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          onClick={() => handleNavigate('prev')}
          disabled={selectedIndex <= 0}
          className="flex-1 border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <Button
          onClick={handleUseHook}
          disabled={selectedIndex < 0}
          className="flex-[2] btn-hero"
        >
          <Check className="w-5 h-5 mr-2" />
          Use This Hook
        </Button>

        <Button
          variant="outline"
          onClick={() => handleNavigate('next')}
          disabled={selectedIndex >= hooks.length - 1}
          className="flex-1 border-white/20 text-white hover:bg-white/10 disabled:opacity-30"
        >
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="flex justify-center space-x-2">
        {hooks.map((_, index) => (
          <div
            key={index}
            className={cn(
              "w-2 h-2 rounded-full transition-all duration-300",
              selectedIndex === index
                ? "bg-brand-purple w-6"
                : "bg-white/20 hover:bg-white/40 cursor-pointer"
            )}
            onClick={() => handlePreview(index)}
          />
        ))}
      </div>
    </div>
  );
};
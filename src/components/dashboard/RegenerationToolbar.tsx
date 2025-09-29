import { RefreshCw, Image as ImageIcon, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RegenerationToolbarProps {
  onRegenerateText: () => void;
  onRegenerateImage: () => void;
  onEditContent: () => void;
  hasImage: boolean;
  isRegenerating: 'text' | 'image' | 'all' | null;
}

export const RegenerationToolbar = ({
  onRegenerateText,
  onRegenerateImage,
  onEditContent,
  hasImage,
  isRegenerating,
}: RegenerationToolbarProps) => {
  return (
    <div className="sticky top-0 z-10 bg-navy-700/95 backdrop-blur-md border-b border-white/10 rounded-t-2xl shadow-lg animate-slide-down">
      <div className="px-6 py-4">
        <div className="flex items-center space-x-3">
          {/* Regenerate Text */}
          <Button
            onClick={onRegenerateText}
            disabled={isRegenerating !== null}
            className={cn(
              "flex-1 h-10 border-2 transition-all duration-300",
              isRegenerating === 'text'
                ? "border-brand-purple bg-brand-purple/20 text-brand-purple"
                : "border-brand-purple bg-transparent text-brand-purple hover:bg-brand-purple hover:text-white"
            )}
            variant="outline"
          >
            {isRegenerating === 'text' ? (
              <div className="w-4 h-4 border-2 border-brand-purple/20 border-t-brand-purple rounded-full animate-spin mr-2" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm font-medium">Regenerate Text</span>
          </Button>

          {/* Regenerate Image */}
          <Button
            onClick={onRegenerateImage}
            disabled={!hasImage || isRegenerating !== null}
            className={cn(
              "flex-1 h-10 border-2 transition-all duration-300",
              isRegenerating === 'image'
                ? "border-brand-cyan bg-brand-cyan/20 text-brand-cyan"
                : "border-brand-cyan bg-transparent text-brand-cyan hover:bg-brand-cyan hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            )}
            variant="outline"
          >
            {isRegenerating === 'image' ? (
              <div className="w-4 h-4 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin mr-2" />
            ) : (
              <ImageIcon className="w-4 h-4 mr-2" />
            )}
            <span className="text-sm font-medium">Regenerate Image</span>
          </Button>

          {/* Edit Content */}
          <Button
            onClick={onEditContent}
            disabled={isRegenerating !== null}
            className={cn(
              "flex-1 h-10 border-2 border-brand-purple bg-transparent text-brand-purple transition-all duration-300",
              "hover:bg-brand-purple hover:text-white"
            )}
            variant="outline"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Edit Content</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
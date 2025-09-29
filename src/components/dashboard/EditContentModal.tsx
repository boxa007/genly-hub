import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditContentModalProps {
  open: boolean;
  onClose: () => void;
  content: string;
  onSave: (newContent: string) => void;
}

const MAX_CHARS = 3000;
const WARNING_THRESHOLD = 2700;

export const EditContentModal = ({
  open,
  onClose,
  content,
  onSave,
}: EditContentModalProps) => {
  const [editedContent, setEditedContent] = useState(content);
  const charCount = editedContent.length;
  const isNearLimit = charCount >= WARNING_THRESHOLD;
  const isOverLimit = charCount > MAX_CHARS;

  useEffect(() => {
    setEditedContent(content);
  }, [content]);

  const handleSave = () => {
    if (!isOverLimit) {
      onSave(editedContent);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-navy-800 border border-white/20 text-white animate-scale-in">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white flex items-center justify-between">
            Edit Post Content
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Textarea */}
          <div className="relative">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your LinkedIn post content..."
              className="min-h-[300px] bg-navy-900 text-white border-white/20 focus:border-brand-purple focus:ring-brand-purple/30 resize-none font-sans leading-relaxed"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>

          {/* Character Counter */}
          <div className="flex items-center justify-between">
            <div className="text-xs text-text-muted">
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs">CMD+Enter</kbd> to save • 
              <kbd className="px-2 py-1 bg-white/10 rounded text-xs ml-1">ESC</kbd> to cancel
            </div>
            <div className={cn(
              "text-sm font-medium transition-colors",
              isOverLimit
                ? "text-error"
                : isNearLimit
                ? "text-warning"
                : "text-text-secondary"
            )}>
              {charCount} / {MAX_CHARS}
              {isNearLimit && !isOverLimit && (
                <span className="ml-2 text-warning text-xs">
                  Approaching LinkedIn limit
                </span>
              )}
              {isOverLimit && (
                <span className="ml-2 text-error text-xs">
                  Over LinkedIn limit
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isOverLimit}
              className="flex-1 btn-hero disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper function
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
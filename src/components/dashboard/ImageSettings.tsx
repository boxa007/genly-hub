import { useState, useCallback } from "react";
import { Image as ImageIcon, Upload, X, Paperclip } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface ImageData {
  mode: 'generate' | 'upload';
  style?: string;
  template?: string;
  generatedUrl?: string;
  file?: File;
  preview?: string;
  filename?: string;
  size?: number;
  dimensions?: { width: number; height: number };
}

interface ImageSettingsProps {
  onImageChange: (image: ImageData | null) => void;
  currentImage: ImageData | null;
}

const imageStyles = [
  { value: 'realistic_photo', label: '📷 Realistic Photo' },
  { value: 'abstract', label: '🎨 Abstract' },
  { value: 'illustration', label: '✏️ Illustration' },
  { value: 'minimalist', label: '⚪ Minimalist' },
  { value: 'corporate', label: '💼 Corporate' }
];

const imageTemplates = [
  { value: 'none', label: '🖼️ No Template' },
  { value: 'quote_card', label: '💬 Quote Card' },
  { value: 'split_screen', label: '⬅️➡️ Split Screen' },
  { value: 'profile_feature', label: '👤 Profile Feature' },
  { value: 'data_viz', label: '📊 Data Visualization' },
  { value: 'before_after', label: '🔄 Before/After' }
];

export const ImageSettings = ({ onImageChange, currentImage }: ImageSettingsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const generateImage = currentImage?.mode === 'generate';

  const handleToggleMode = (checked: boolean) => {
    onImageChange({
      mode: checked ? 'generate' : 'upload',
      style: checked ? 'realistic_photo' : undefined,
      template: checked ? 'none' : undefined,
      generatedUrl: undefined,
      file: undefined,
      preview: undefined,
    });
  };

  const handleStyleChange = (value: string) => {
    onImageChange({
      ...currentImage,
      mode: 'generate',
      style: value,
    } as ImageData);
  };

  const handleTemplateChange = (value: string) => {
    onImageChange({
      ...currentImage,
      mode: 'generate',
      template: value,
    } as ImageData);
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid format",
        description: "Please upload PNG, JPG, GIF or WebP only",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Maximum file size is 10MB",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback(async (file: File) => {
    if (!validateFile(file)) return;

    const preview = URL.createObjectURL(file);
    
    // Get image dimensions
    const img = new Image();
    img.src = preview;
    await new Promise((resolve) => { img.onload = resolve; });

    if (img.width < 400 || img.height < 400) {
      toast({
        title: "Image too small",
        description: "Minimum dimensions are 400×400px",
        variant: "destructive",
      });
      URL.revokeObjectURL(preview);
      return;
    }

    onImageChange({
      mode: 'upload',
      file,
      preview,
      filename: file.name,
      size: file.size,
      dimensions: { width: img.width, height: img.height },
    });

    toast({
      title: "Image uploaded",
      description: `${file.name} uploaded successfully`,
    });
  }, [onImageChange, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }, [handleFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file);
  };

  const handleRemoveFile = () => {
    if (currentImage?.preview) {
      URL.revokeObjectURL(currentImage.preview);
    }
    onImageChange({
      mode: 'upload',
      file: undefined,
      preview: undefined,
      filename: undefined,
      size: undefined,
      dimensions: undefined,
    });
  };

  return (
    <div className="card-glass rounded-2xl p-8 space-y-6 transition-all duration-300">
      {/* Header */}
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="text-xl font-semibold text-white flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-brand-cyan" />
          Image Settings
        </h2>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Content */}
      <div 
        className={`space-y-6 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {/* Toggle Switch */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
          <Label className="text-white font-medium">Generate Image</Label>
          <Switch
            checked={generateImage}
            onCheckedChange={handleToggleMode}
            className="data-[state=checked]:bg-brand-purple"
          />
        </div>

        {/* Generate Mode */}
        {generateImage && (
          <div className="space-y-4 animate-fade-in">
            {/* Image Style */}
            <div>
              <Label className="text-white font-medium">Image Style</Label>
              <Select
                value={currentImage?.style || 'realistic_photo'}
                onValueChange={handleStyleChange}
              >
                <SelectTrigger className="input-glass mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-white/20">
                  {imageStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value} className="text-white">
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Image Template */}
            <div>
              <Label className="text-white font-medium">Image Template</Label>
              <Select
                value={currentImage?.template || 'none'}
                onValueChange={handleTemplateChange}
              >
                <SelectTrigger className="input-glass mt-2 h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-navy-800 border-white/20">
                  {imageTemplates.map((template) => (
                    <SelectItem key={template.value} value={template.value} className="text-white">
                      {template.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-text-muted mt-2">
                Templates add text overlays and structured layouts
              </p>
            </div>
          </div>
        )}

        {/* Upload Mode */}
        {!generateImage && (
          <div className="animate-fade-in">
            {!currentImage?.preview ? (
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`relative h-[180px] border-2 border-dashed rounded-xl transition-all duration-300 ${
                  isDragging
                    ? 'border-brand-purple bg-brand-purple/5 scale-[1.02]'
                    : 'border-brand-blue bg-transparent hover:bg-brand-purple/5 hover:border-brand-purple'
                }`}
              >
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Paperclip className={`w-12 h-12 text-brand-purple transition-transform duration-300 ${isDragging ? 'rotate-12 scale-110' : ''}`} />
                  <div className="text-center">
                    <p className="text-text-secondary text-base">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-text-muted text-sm mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                  <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4 p-4 rounded-lg bg-white/5 border border-white/10 animate-scale-in">
                <img
                  src={currentImage.preview}
                  alt="Upload preview"
                  className="w-[120px] h-[120px] object-cover rounded-lg"
                />
                <div className="flex-1">
                  <p className="text-white font-medium">{currentImage.filename}</p>
                  <p className="text-text-secondary text-sm">
                    {(currentImage.size! / 1024).toFixed(1)} KB
                  </p>
                  {currentImage.dimensions && (
                    <p className="text-text-muted text-xs mt-1">
                      {currentImage.dimensions.width} × {currentImage.dimensions.height} px
                    </p>
                  )}
                  <div className="flex space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRemoveFile}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                      className="border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      Replace
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
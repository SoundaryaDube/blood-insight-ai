import { useState } from "react";
import { Upload, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isAnalyzing: boolean;
}

export const FileUpload = ({ onFileSelect, isAnalyzing }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ["application/pdf", "text/csv", "image/png", "image/jpeg", "image/jpg"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, CSV, PNG, or JPG file.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-12 md:p-16 transition-all duration-300 ${
        dragActive
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-border bg-gradient-to-br from-card to-muted/20 hover:border-primary/50 hover:shadow-soft"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.csv,.png,.jpg,.jpeg"
        onChange={handleFileInput}
        disabled={isAnalyzing}
      />
      <label
        htmlFor="file-upload"
        className="flex flex-col items-center justify-center cursor-pointer"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
          <Upload className="w-16 h-16 text-primary relative z-10" />
        </div>
        <p className="text-xl font-semibold text-foreground mb-3">
          Drop your blood report here or click to browse
        </p>
        <p className="text-sm text-muted-foreground mb-4">
          Supports PDF, CSV, PNG, and JPG (max 10MB)
        </p>
        <div className="flex gap-2 flex-wrap justify-center">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">PDF</span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">CSV</span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">PNG</span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">JPG</span>
        </div>
      </label>
      {isAnalyzing && (
        <div className="absolute inset-0 bg-background/95 backdrop-blur-sm rounded-xl flex items-center justify-center">
          <div className="text-center">
            <div className="relative mb-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-base font-medium text-foreground mb-1">Analyzing your report...</p>
            <p className="text-sm text-muted-foreground">This may take a few moments</p>
          </div>
        </div>
      )}
    </div>
  );
};

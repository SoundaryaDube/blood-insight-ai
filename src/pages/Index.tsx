import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { AnalysisResults, AnalysisResult } from "@/components/AnalysisResults";
import { Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const { toast } = useToast();

  const analyzeReport = async (file: File) => {
    setIsAnalyzing(true);
    setSelectedFile(file);

    try {
      // Convert file to base64 for sending to edge function
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64 = reader.result as string;
        
        const { data, error } = await supabase.functions.invoke('analyze-blood-report', {
          body: { 
            file: base64,
            fileName: file.name,
            fileType: file.type
          }
        });

        if (error) {
          toast({
            title: "Analysis failed",
            description: error.message || "Failed to analyze the report. Please try again.",
            variant: "destructive",
          });
          setIsAnalyzing(false);
          return;
        }

        setResults(data.results || []);
        toast({
          title: "Analysis complete",
          description: "Your blood report has been analyzed successfully.",
        });
      };

      reader.onerror = () => {
        toast({
          title: "File reading failed",
          description: "Failed to read the file. Please try again.",
          variant: "destructive",
        });
      };
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-6">
              <Activity className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Blood Report Analysis
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Upload your blood test results and get AI-powered insights about potential health issues, 
              including iron deficiency and other blood-related conditions.
            </p>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container mx-auto px-4 py-12 max-w-4xl">
        <FileUpload onFileSelect={analyzeReport} isAnalyzing={isAnalyzing} />
        
        {selectedFile && !isAnalyzing && (
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Analyzing: <span className="font-medium text-foreground">{selectedFile.name}</span>
            </p>
          </div>
        )}

        {results.length > 0 && <AnalysisResults results={results} />}
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Accurate Analysis</h3>
            <p className="text-sm text-muted-foreground">
              AI-powered analysis of your blood test results with high accuracy
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Multiple Formats</h3>
            <p className="text-sm text-muted-foreground">
              Support for PDF, CSV, and image formats (PNG, JPG)
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-2">Quick Results</h3>
            <p className="text-sm text-muted-foreground">
              Get detailed insights and recommendations in seconds
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

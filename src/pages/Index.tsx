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
      <section className="relative bg-gradient-hero py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full"></div>
                <Activity className="w-20 h-20 text-primary relative z-10" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Advanced Blood Report
              <span className="block bg-gradient-primary bg-clip-text text-transparent">Analysis</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Upload your blood test results and receive instant AI-powered insights. 
              Detect iron deficiency, abnormalities, and get personalized health recommendations.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-soft">
                <div className="w-2 h-2 bg-success-green rounded-full"></div>
                <span className="text-foreground font-medium">Instant Results</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-soft">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-foreground font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-full border border-border shadow-soft">
                <div className="w-2 h-2 bg-warning-orange rounded-full"></div>
                <span className="text-foreground font-medium">Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className="container mx-auto px-4 py-16 max-w-5xl -mt-8 relative z-20">
        <div className="bg-card rounded-2xl shadow-medium p-8 md:p-12 border border-border animate-fade-in">
          <FileUpload onFileSelect={analyzeReport} isAnalyzing={isAnalyzing} />
          
          {selectedFile && !isAnalyzing && (
            <div className="mt-6 text-center animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Analyzing: <span className="font-semibold text-foreground">{selectedFile.name}</span>
              </p>
            </div>
          )}

          {results.length > 0 && <AnalysisResults results={results} />}
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Choose Our Analysis Platform?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Get comprehensive insights from your blood reports with advanced AI technology
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Accurate Analysis</h3>
            <p className="text-muted-foreground leading-relaxed">
              Advanced AI algorithms analyze your blood test results with medical-grade accuracy
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <div className="w-12 h-12 bg-success-green/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-success-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Multiple Formats</h3>
            <p className="text-muted-foreground leading-relaxed">
              Upload PDF, CSV, PNG, or JPG files - our system handles all common report formats
            </p>
          </div>
          <div className="bg-card p-8 rounded-xl border border-border shadow-soft hover:shadow-medium transition-shadow duration-300">
            <div className="w-12 h-12 bg-warning-orange/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-warning-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Instant Results</h3>
            <p className="text-muted-foreground leading-relaxed">
              Receive detailed health insights and personalized recommendations within seconds
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;

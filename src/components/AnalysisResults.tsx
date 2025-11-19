import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

export interface AnalysisResult {
  issue: string;
  severity: "high" | "medium" | "low" | "normal";
  description: string;
  recommendation: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="w-5 h-5 text-destructive" />;
      case "medium":
        return <Info className="w-5 h-5 text-warning-orange" />;
      case "low":
        return <Info className="w-5 h-5 text-primary" />;
      default:
        return <CheckCircle className="w-5 h-5 text-success-green" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium":
        return "bg-[hsl(var(--warning-orange))]/10 text-[hsl(var(--warning-orange))] border-[hsl(var(--warning-orange))]/20";
      case "low":
        return "bg-primary/10 text-primary border-primary/20";
      default:
        return "bg-[hsl(var(--success-green))]/10 text-[hsl(var(--success-green))] border-[hsl(var(--success-green))]/20";
    }
  };

  return (
    <div className="space-y-4 mt-8">
      <h2 className="text-2xl font-bold text-foreground">Analysis Results</h2>
      {results.map((result, index) => (
        <Card key={index} className="border-border">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getSeverityIcon(result.severity)}
                <CardTitle className="text-lg">{result.issue}</CardTitle>
              </div>
              <Badge variant="outline" className={getSeverityColor(result.severity)}>
                {result.severity.toUpperCase()}
              </Badge>
            </div>
            <CardDescription>{result.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-muted/50 p-4 rounded-md">
              <p className="text-sm font-medium text-foreground mb-1">Recommendation:</p>
              <p className="text-sm text-muted-foreground">{result.recommendation}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

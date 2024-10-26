import { useState } from 'react';
import { ProjectAnalysis } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { generateContent } from '@/lib/api';

export default function ProjectAnalyzer() {
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProject = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze this code and provide recommendations for:
      1. Required dependencies and potential vulnerabilities
      2. Suitable license based on dependencies
      3. Recommended .gitignore patterns
      4. Important README sections

      Code:
      ${code}

      Return the analysis in a structured JSON format.`;

      const result = await generateContent(prompt);
      setAnalysis(JSON.parse(result));
    } catch (error) {
      console.error('Error analyzing project:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Project Code</label>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your project code here..."
          className="h-40"
        />
      </div>

      <Button onClick={analyzeProject} disabled={isAnalyzing}>
        {isAnalyzing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {isAnalyzing ? 'Analyzing...' : 'Analyze Project'}
      </Button>

      {analysis && (
        <div className="space-y-4">
          {/* Dependencies */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Dependencies</h3>
            {analysis.dependencies.map((dep) => (
              <Alert key={dep.name} variant={dep.vulnerabilities ? "destructive" : "default"}>
                {dep.vulnerabilities ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                <AlertTitle>{dep.name}@{dep.version}</AlertTitle>
                {dep.vulnerabilities && (
                  <AlertDescription>
                    Vulnerabilities found: {dep.vulnerabilities.join(', ')}
                  </AlertDescription>
                )}
              </Alert>
            ))}
          </div>

          {/* License Recommendations */}
          <div>
            <h3 className="text-lg font-semibold mb-2">License Recommendations</h3>
            {analysis.licenses.map((license) => (
              <Alert key={license.name}>
                <AlertTitle>{license.name}</AlertTitle>
                <AlertDescription>
                  Compatible with: {license.compatibility.join(', ')}
                </AlertDescription>
              </Alert>
            ))}
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Alert>
                <AlertTitle>.gitignore Patterns</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {analysis.recommendations.gitignore.map((pattern, i) => (
                      <li key={i}>{pattern}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertTitle>README Sections</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {analysis.recommendations.readme.map((section, i) => (
                      <li key={i}>{section}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              <Alert>
                <AlertTitle>License Suggestions</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside">
                    {analysis.recommendations.license.map((license, i) => (
                      <li key={i}>{license}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
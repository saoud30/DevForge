"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { generateWithAI } from '@/lib/api';

const ReadmeGenerator = () => {
  const [projectContext, setProjectContext] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!projectContext.trim()) {
      toast({
        title: "Error",
        description: "Please enter project context",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Generate a README.md for a project with the following context: ${projectContext}. The README should include sections for Project Title, Description, Installation, Usage, Contributing, and License. Make it concise and informative.`;
      
      const result = await generateWithAI(prompt, 'GEMINI');
      
      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedContent(result.content);
    } catch (error) {
      toast({
        title: "Error in README Generator",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'README.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectContext" className="block text-sm font-medium text-gray-700 mb-1">
          Project Context
        </label>
        <Input
          id="projectContext"
          value={projectContext}
          onChange={(e) => setProjectContext(e.target.value)}
          placeholder="Enter project context..."
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate README'}
      </Button>
      {generatedContent && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Generated README</h3>
            <Button onClick={handleDownload}>Download README.md</Button>
          </div>
          <div className="border rounded-md p-4 bg-gray-50">
            <Textarea
              value={generatedContent}
              readOnly
              className="w-full h-64 font-mono text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ReadmeGenerator;
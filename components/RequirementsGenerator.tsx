"use client";

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { generateWithAI } from '@/lib/api';

const RequirementsGenerator = () => {
  const [pythonScript, setPythonScript] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!pythonScript.trim()) {
      toast({
        title: "Error",
        description: "Please enter a Python script",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Given the following Python script, generate a requirements.txt file listing all the necessary dependencies:\n\n${pythonScript}\n\nOnly include direct dependencies, not built-in modules. Format the output as a valid requirements.txt file.`;
      
      const result = await generateWithAI(prompt, 'GEMINI');
      
      if (result.error) {
        throw new Error(result.error);
      }

      setGeneratedContent(result.content);
    } catch (error) {
      toast({
        title: "Error in requirements.txt Generator",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requirements.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="pythonScript" className="block text-sm font-medium text-gray-700 mb-1">
          Python Script
        </label>
        <Textarea
          id="pythonScript"
          value={pythonScript}
          onChange={(e) => setPythonScript(e.target.value)}
          placeholder="Paste your Python script here..."
          className="h-40"
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate requirements.txt'}
      </Button>
      {generatedContent && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Generated requirements.txt</h3>
            <Button onClick={handleDownload}>Download requirements.txt</Button>
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

export default RequirementsGenerator;
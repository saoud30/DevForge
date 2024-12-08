"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { generateWithAI, AI_MODELS } from '@/lib/api';

const GitignoreGenerator = () => {
  const [template, setTemplate] = useState('');
  const [customFiles, setCustomFiles] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<keyof typeof AI_MODELS>('GEMINI');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!template) {
      toast({
        title: "Error",
        description: "Please select a template",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Generate a .gitignore file for a ${template} project${customFiles ? ` with these additional patterns: ${customFiles}` : ''}.
Return ONLY the patterns, one per line, without any explanations or comments.`;
      
      const response = await generateWithAI(prompt, selectedModel);
      if (response.error) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
        return;
      }
      setGeneratedContent(response.content.trim());
    } catch (error) {
      console.error('Error generating .gitignore:', error);
      toast({
        title: "Error",
        description: "Failed to generate .gitignore content",
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
    a.download = '.gitignore';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="template" className="block text-sm font-medium text-gray-700 mb-1">
          Project Template
        </label>
        <Select onValueChange={setTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="node">Node.js</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="react">React</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="customFiles" className="block text-sm font-medium text-gray-700 mb-1">
          Custom Files (optional)
        </label>
        <Input
          id="customFiles"
          value={customFiles}
          onChange={(e) => setCustomFiles(e.target.value)}
          placeholder="Enter custom files or patterns..."
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate .gitignore'}
      </Button>
      {generatedContent && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Generated .gitignore</h3>
            <Button onClick={handleDownload}>Download .gitignore</Button>
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

export default GitignoreGenerator;
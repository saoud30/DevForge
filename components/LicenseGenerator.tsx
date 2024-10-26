"use client";

import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { generateContent } from '@/lib/api';

const LicenseGenerator = () => {
  const [licenseType, setLicenseType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!licenseType || !projectName || !authorName) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const prompt = `Generate a ${licenseType} license for the project "${projectName}" by ${authorName}. Include the current year in the license text.`;
      const content = await generateContent(prompt);
      setGeneratedContent(content);
    } catch (error) {
      toast({
        title: "Error in LICENSE Generator",
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
    a.download = 'LICENSE';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="licenseType" className="block text-sm font-medium text-gray-700 mb-1">
          License Type
        </label>
        <Select onValueChange={setLicenseType}>
          <SelectTrigger>
            <SelectValue placeholder="Select a license type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="MIT">MIT License</SelectItem>
            <SelectItem value="Apache-2.0">Apache License 2.0</SelectItem>
            <SelectItem value="GPL-3.0">GNU General Public License v3.0</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name
        </label>
        <Input
          id="projectName"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          placeholder="Enter project name..."
        />
      </div>
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium text-gray-700 mb-1">
          Author Name
        </label>
        <Input
          id="authorName"
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          placeholder="Enter author name..."
        />
      </div>
      <Button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate LICENSE'}
      </Button>
      {generatedContent && (
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Generated LICENSE</h3>
            <Button onClick={handleDownload}>Download LICENSE</Button>
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

export default LicenseGenerator;
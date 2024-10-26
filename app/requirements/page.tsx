"use client";

import { useState } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { generateContent } from '@/lib/api';
import Layout from '@/components/Layout';

export default function RequirementsPage() {
  const [pythonScript, setPythonScript] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedFile, setCopiedFile] = useState(false);
  const [copiedDirect, setCopiedDirect] = useState(false);

  const handleGenerate = async () => {
    if (!pythonScript.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Given the following Python script, generate a requirements.txt file listing all the necessary dependencies:\n\n${pythonScript}\n\nOnly include direct dependencies, not built-in modules. Format the output as a valid requirements.txt file without any markdown formatting or backticks.`;
      const content = await generateContent(prompt);
      setGeneratedContent(content.replace(/```/g, '').trim());
    } catch (error) {
      console.error('Error generating requirements.txt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'requirements.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyFileCommand = () => {
    navigator.clipboard.writeText('pip install -r requirements.txt');
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const copyDirectCommand = () => {
    // Convert requirements.txt format to space-separated packages
    const packages = generatedContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => line.split('==')[0].trim())
      .join(' ');
    
    navigator.clipboard.writeText(`pip install ${packages}`);
    setCopiedDirect(true);
    setTimeout(() => setCopiedDirect(false), 2000);
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">PyDeps - Python Dependencies Manager</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="pythonScript" className="block text-sm font-medium mb-1">Python Script</label>
          <textarea
            id="pythonScript"
            value={pythonScript}
            onChange={(e) => setPythonScript(e.target.value)}
            placeholder="Paste your Python script here..."
            className="w-full h-40 p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate requirements.txt'}
        </button>
      </div>
      {generatedContent && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
              <h3 className="text-xl font-semibold">Generated requirements.txt</h3>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                <Download size={20} />
                <span>Download</span>
              </button>
            </div>
            <pre className="p-4 whitespace-pre-wrap">{generatedContent}</pre>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-4">Installation Instructions</h3>
              
              <div className="space-y-6">
                {/* Method 1: Using requirements.txt */}
                <div>
                  <h4 className="text-md font-medium mb-2">Method 1: Using requirements.txt</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    After saving the requirements.txt file, run the following command:
                  </p>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <code className="text-sm font-mono">pip install -r requirements.txt</code>
                    <button
                      onClick={copyFileCommand}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      {copiedFile ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Method 2: Direct installation */}
                <div>
                  <h4 className="text-md font-medium mb-2">Method 2: Direct Installation</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Alternatively, install all packages directly with this command:
                  </p>
                  <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <code className="text-sm font-mono">
                      pip install {generatedContent
                        .replace(/```/g, '')
                        .split('\n')
                        .filter(line => line.trim())
                        .map(line => line.split('==')[0].trim())
                        .join(' ')}
                    </code>
                    <button
                      onClick={copyDirectCommand}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                    >
                      {copiedDirect ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
"use client";

import { useState } from 'react';
import { Download, Info } from 'lucide-react';
import { generateContent } from '@/lib/api';
import Layout from '@/components/Layout';

export default function GitignorePage() {
  const [template, setTemplate] = useState('');
  const [customFiles, setCustomFiles] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!template) return;

    setIsLoading(true);
    try {
      const prompt = `Generate a .gitignore file for a ${template} project with ONLY these patterns: ${customFiles}. Return ONLY the patterns, one per line, without any explanations or comments.`;
      const content = await generateContent(prompt);
      setGeneratedContent(content.trim());
    } catch (error) {
      console.error('Error generating .gitignore:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = '.gitignore';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">GitGuardian - Protect Your Repository</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="template" className="block text-sm font-medium mb-1">Project Template</label>
          <select
            id="template"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="">Select a template</option>
            <option value="Node.js">Node.js</option>
            <option value="Python">Python</option>
            <option value="React">React</option>
            <option value="Vue">Vue.js</option>
            <option value="Angular">Angular</option>
            <option value="Django">Django</option>
            <option value="Flask">Flask</option>
            <option value="Ruby">Ruby</option>
            <option value="Rails">Ruby on Rails</option>
            <option value="Java">Java</option>
            <option value="Spring">Spring Boot</option>
            <option value="Android">Android</option>
            <option value="iOS">iOS/Swift</option>
            <option value="Flutter">Flutter</option>
            <option value="Unity">Unity</option>
            <option value="WordPress">WordPress</option>
            <option value="Laravel">Laravel</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="customFiles" className="block text-sm font-medium">Custom Files</label>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Info size={14} className="mr-1" />
              <span>Separate patterns with commas</span>
            </div>
          </div>
          <input
            type="text"
            id="customFiles"
            value={customFiles}
            onChange={(e) => setCustomFiles(e.target.value)}
            placeholder="e.g., *.log, .env, build/, dist/"
            className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate .gitignore'}
        </button>
      </div>
      {generatedContent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold">Generated .gitignore</h3>
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
      )}
    </Layout>
  );
}
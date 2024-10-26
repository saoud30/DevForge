"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Download } from 'lucide-react';
import { generateContent } from '@/lib/api';
import Layout from '@/components/Layout';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const MarkdownPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

export default function Home() {
  const [markdown, setMarkdown] = useState('# Welcome to ReadMagic\n\nCraft your enchanting README here!');
  const [aiPrompt, setAiPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([markdown], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'README.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsLoading(true);
    try {
      const prompt = `Generate a README.md for a project with the following context: ${aiPrompt}. The README should include sections for Project Title, Description, Installation, Usage, Contributing, and License. Make it concise and informative.`;
      const content = await generateContent(prompt);
      setMarkdown(content);
    } catch (error) {
      console.error('Error generating README:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">ReadMagic - Craft Your README</h2>
        <div className="flex items-center bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="Describe your project to summon a magical README..."
            className="flex-grow p-3 rounded-l-lg bg-transparent focus:outline-none"
          />
          <button
            onClick={handleAiGenerate}
            disabled={isLoading}
            className="bg-primary text-white px-6 py-3 rounded-r-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold">Editor</h3>
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              <Download size={20} />
              <span>Download</span>
            </button>
          </div>
          <MDEditor
            value={markdown}
            onChange={(value) => setMarkdown(value || '')}
            preview="edit"
            height={400}
            className="w-full"
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <h3 className="text-xl font-semibold p-4 bg-gray-50 dark:bg-gray-700">Preview</h3>
          <div className="h-[400px] overflow-auto p-4">
            <MarkdownPreview 
              source={markdown} 
              style={{ 
                backgroundColor: 'transparent',
                color: 'inherit'
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
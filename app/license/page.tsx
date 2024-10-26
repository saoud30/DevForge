"use client";

import { useState } from 'react';
import { Download } from 'lucide-react';
import { generateContent } from '@/lib/api';
import Layout from '@/components/Layout';

export default function LicensePage() {
  const [licenseType, setLicenseType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [generatedContent, setGeneratedContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 25 }, (_, i) => currentYear - i);

  const handleGenerate = async () => {
    if (!licenseType || !projectName || !authorName) return;

    setIsLoading(true);
    try {
      const prompt = `Generate a ${licenseType} license for the project "${projectName}" by ${authorName}. Use the year ${year} in the license text.`;
      const content = await generateContent(prompt);
      setGeneratedContent(content);
    } catch (error) {
      console.error('Error generating LICENSE:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'LICENSE';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-8">LegalForge - License Generator</h2>
      <div className="space-y-4 mb-8">
        <div>
          <label htmlFor="licenseType" className="block text-sm font-medium mb-1">License Type</label>
          <select
            id="licenseType"
            value={licenseType}
            onChange={(e) => setLicenseType(e.target.value)}
            className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          >
            <option value="">Select a license type</option>
            <option value="MIT">MIT License</option>
            <option value="Apache-2.0">Apache License 2.0</option>
            <option value="GPL-3.0">GNU General Public License v3.0</option>
          </select>
        </div>
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Enter project name..."
            className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        </div>
        <div>
          <label htmlFor="authorName" className="block text-sm font-medium mb-1">Author Name</label>
          <input
            type="text"
            id="authorName"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Enter author name..."
            className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          />
        </div>
        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-1">Copyright Year</label>
          <select
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-200 disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate LICENSE'}
        </button>
      </div>
      {generatedContent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold">Generated LICENSE</h3>
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
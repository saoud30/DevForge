"use client";

import React from 'react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { FileText, GitBranch, Package, Shield, Code, Search, Book, LucideProps } from 'lucide-react';
import Layout from '@/components/Layout';
import GridBackground from '@/components/GridBackground';
import { TabContent } from '@/lib/content';
import { AI_MODELS, generateWithAI } from '@/lib/api';

const ThemedIcons = {
  FileText: (props: LucideProps) => <FileText {...props} />,
  GitBranch: (props: LucideProps) => <GitBranch {...props} />,
  Package: (props: LucideProps) => <Package {...props} />,
  Shield: (props: LucideProps) => <Shield {...props} />,
  Code: (props: LucideProps) => <Code {...props} />,
  Search: (props: LucideProps) => <Search {...props} />,
  Book: (props: LucideProps) => <Book {...props} />
};

interface FeatureCardProps {
  icon: keyof typeof ThemedIcons;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  const Icon = ThemedIcons[icon];
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300">{description}</p>
    </motion.div>
  );
};

interface ContentOption {
  id: string;
  label: string;
  prompt?: string;
}

interface TabContentItem {
  title: string;
  description: string;
  defaultContent?: string;
  placeholder?: string;
  options?: readonly ContentOption[];
}

type TabContentType = typeof TabContent;
type TabContentKeys = keyof TabContentType;

const hasOptions = (content: TabContentItem): content is TabContentItem & { options: ContentOption[] } => {
  return Array.isArray(content.options) && content.options.length > 0;
};

export default function Home() {
  const [markdown, setMarkdown] = useState<string>(TabContent.readme.defaultContent || '');
  const [codeInput, setCodeInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [activeTab, setActiveTab] = useState('readme');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedModel, setSelectedModel] = useState<keyof typeof AI_MODELS>('GEMINI');
  const [generatedOutput, setGeneratedOutput] = useState('');
  const [requirementsOutput, setRequirementsOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [licenseForm, setLicenseForm] = useState({
    type: '',
    projectName: '',
    author: '',
    year: new Date().getFullYear().toString()
  });
  const [gitignoreForm, setGitignoreForm] = useState({
    template: '',
    customFiles: ''
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setCodeInput('');
    setGeneratedOutput('');
    setAiPrompt('');
    setSelectedOption('');

    // Set initial content based on tab
    if (tab === 'readme') {
      setMarkdown(TabContent.readme.defaultContent || '');
    }
  };

  const handleAiGenerate = async () => {
    const currentContent = TabContent[activeTab as TabContentKeys];
    
    if (!selectedOption && hasOptions(currentContent)) {
      setError('Please select a template first');
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    try {
      let promptText = '';
      
      if (hasOptions(currentContent)) {
        const selectedOpt = currentContent.options.find(o => o.id === selectedOption);
        if (selectedOpt?.prompt) {
          promptText = `${selectedOpt.prompt}\n${aiPrompt || codeInput}`;
        }
      } else {
        promptText = aiPrompt || codeInput;
      }

      console.log('Generating with prompt:', promptText);
      const result = await generateWithAI(promptText, selectedModel);
      
      if (result.error) {
        setError(result.error);
        console.error('Generation error:', result.error);
        return;
      }

      setGeneratedOutput(result.content);
      if (activeTab === 'readme') {
        setMarkdown(result.content);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error generating content:', err);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleRequirementsGenerate = async () => {
    if (!codeInput.trim()) {
      setError('Please paste your code in the editor first');
      return;
    }

    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    try {
      const prompt = `Analyze the following code and generate a comprehensive requirements.txt or package.json file with all necessary dependencies and their versions. Include both direct dependencies and dev dependencies. Here's the code:\n\n${codeInput}`;

      console.log('Generating requirements with code analysis...');
      const result = await generateWithAI(prompt, selectedModel);
      
      if (result.error) {
        setError(result.error);
        console.error('Generation error:', result.error);
        return;
      }

      setRequirementsOutput(result.content);
      setGeneratedOutput(result.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error generating requirements:', err);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleLicenseGenerate = async () => {
    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    try {
      const option = TabContent.license.options.find(opt => opt.id === licenseForm.type);
      if (!option) {
        console.error('No license type selected');
        return;
      }

      const prompt = option.prompt
        .replace('{projectName}', licenseForm.projectName)
        .replace('{author}', licenseForm.author)
        .replace('{year}', licenseForm.year);

      const response = await generateWithAI(prompt, selectedModel);
      if (response.error) {
        setError(response.error);
        console.error(response.error);
        return;
      }

      setGeneratedOutput(response.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error generating license:', err);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleGitignoreGenerate = async () => {
    setIsLoading(true);
    setIsGenerating(true);
    setError(null);
    try {
      const option = TabContent.gitignore.options.find(opt => opt.id === gitignoreForm.template);
      if (!option) {
        console.error('No template selected');
        return;
      }

      const prompt = option.prompt.replace('{customPatterns}', gitignoreForm.customFiles || 'No additional patterns');

      const response = await generateWithAI(prompt, selectedModel);
      if (response.error) {
        setError(response.error);
        console.error(response.error);
        return;
      }

      setGeneratedOutput(response.content);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      console.error('Error generating .gitignore:', err);
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedOutput], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = activeTab === 'readme' ? 'README.md' :
                     activeTab === 'gitignore' ? '.gitignore' :
                     activeTab === 'license' ? 'LICENSE' :
                     'generated.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const modelOptions = [
    { value: 'GEMINI', label: 'Gemini Pro' },
    { value: 'XAI', label: 'X-AI' }
  ] as const;

  const ModelSelector = () => (
    <div className="flex items-center space-x-4 mb-4">
      <span className="text-purple-300">Select AI Model:</span>
      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value as keyof typeof AI_MODELS)}
        className="bg-purple-500/10 text-purple-200 rounded-lg px-4 py-2 border border-purple-500/20"
      >
        {modelOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const OptionSelector = ({ options }: { options: ContentOption[] }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {options.map((option: ContentOption) => (
        <button
          key={option.id}
          onClick={() => setSelectedOption(option.id)}
          className={`p-4 rounded-lg transition-colors ${
            selectedOption === option.id
              ? 'bg-purple-500 text-white'
              : 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-200'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  const activeContent = TabContent[activeTab as TabContentKeys] as TabContentItem;

  return (
    <Layout>
      <GridBackground />
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-purple-300 text-transparent bg-clip-text">
            DevForge
          </h1>
          <p className="text-gray-400 dark:text-gray-300 mb-8">
            Forge your project essentials with AI-powered precision
          </p>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <FeatureCard 
          icon="FileText"
          title="README Generator"
          description="Create professional README files with AI assistance"
        />
        <FeatureCard 
          icon="Code"
          title="Code Generation"
          description="Generate code, tests, and boilerplate with AI"
        />
        <FeatureCard 
          icon="Search"
          title="Code Analysis"
          description="Get insights, security checks, and best practices"
        />
        <FeatureCard 
          icon="Book"
          title="Documentation"
          description="Generate comprehensive API and code documentation"
        />
      </div>

      {/* Main Content */}
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-500/20 p-6 mb-8">
        {/* Tab Navigation */}
        <div className="flex items-center justify-center space-x-4 mb-8 flex-wrap gap-y-4">
          {[
            { id: 'readme', icon: 'FileText', label: 'README' },
            { id: 'gitignore', icon: 'GitBranch', label: '.gitignore' },
            { id: 'requirements', icon: 'Package', label: 'Requirements' },
            { id: 'license', icon: 'Shield', label: 'License' },
            { id: 'codeGen', icon: 'Code', label: 'Code Gen' },
            { id: 'analysis', icon: 'Search', label: 'Analysis' },
            { id: 'docs', icon: 'Book', label: 'Docs' }
          ].map(({ id, icon, label }) => {
            const Icon = ThemedIcons[icon as keyof typeof ThemedIcons];
            return (
              <button
                key={id}
                onClick={() => handleTabChange(id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all ${
                  activeTab === id 
                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/25 scale-105' 
                    : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">{activeContent.title}</h2>
            <p className="text-gray-400">{activeContent.description}</p>
          </div>

          {/* Model Selector */}
          <ModelSelector />

          {/* Option Selector - only show for non-gitignore and non-license tabs */}
          {hasOptions(activeContent) && activeTab !== 'gitignore' && activeTab !== 'license' && (
            <OptionSelector options={activeContent.options} />
          )}

          {/* AI Input */}
          <div className="mb-8">
            <div className="flex items-center bg-gray-800/50 rounded-xl shadow-inner border border-purple-500/20">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Enter your prompt or requirements"
                className="flex-grow p-4 rounded-l-xl bg-transparent focus:outline-none text-white placeholder-gray-500"
              />
              <button
                onClick={handleAiGenerate}
                disabled={isLoading || isGenerating}
                className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-4 rounded-r-xl hover:bg-purple-600 transition duration-200 disabled:opacity-50 shadow-lg shadow-purple-500/25"
              >
                {isGenerating ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>

          {/* Editor and Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Editor Section */}
            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-purple-500/20">
              <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
                <h3 className="text-xl font-semibold text-white">
                  {activeTab === 'requirements' ? 'Code Editor' : 
                   activeTab === 'codeGen' ? 'Code Input' :
                   activeTab === 'analysis' ? 'Code Analysis' :
                   activeTab === 'docs' ? 'Documentation Input' :
                   activeTab === 'readme' ? 'README Editor' :
                   activeTab === 'license' ? 'License Details' :
                   activeTab === 'gitignore' ? 'Gitignore Template' :
                   'Editor'}
                </h3>
                {((generatedOutput && activeTab !== 'license') || activeTab === 'readme') && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 shadow-lg shadow-purple-500/25"
                  >
                    <ThemedIcons.FileText className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
              {activeTab === 'requirements' ? (
                <div className="p-4">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder="Paste your code here for analysis..."
                    className="w-full h-96 bg-gray-900/50 text-white p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none font-mono"
                  />
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={handleRequirementsGenerate}
                      disabled={isGenerating || !codeInput.trim()}
                      className={`px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors ${
                        isGenerating || !codeInput.trim() ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {isGenerating ? 'Analyzing...' : 'Generate Requirements'}
                    </button>
                  </div>
                </div>
              ) : activeTab === 'readme' ? (
                <MDEditor
                  value={generatedOutput || markdown}
                  onChange={(value) => {
                    if (generatedOutput) {
                      setGeneratedOutput(value || '');
                    } else {
                      setMarkdown(value || '');
                    }
                  }}
                  preview="edit"
                  height={400}
                  className="w-full !bg-transparent"
                />
              ) : activeTab === 'license' ? (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">License Type</label>
                      <select
                        value={licenseForm.type}
                        onChange={(e) => setLicenseForm({...licenseForm, type: e.target.value})}
                        className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/20 focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Select a license type</option>
                        {TabContent.license.options.map(option => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-2">Project Name</label>
                      <input
                        type="text"
                        value={licenseForm.projectName}
                        onChange={(e) => setLicenseForm({...licenseForm, projectName: e.target.value})}
                        placeholder="Enter project name..."
                        className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/20 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Author Name</label>
                      <input
                        type="text"
                        value={licenseForm.author}
                        onChange={(e) => setLicenseForm({...licenseForm, author: e.target.value})}
                        placeholder="Enter author name..."
                        className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/20 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Copyright Year</label>
                      <select
                        value={licenseForm.year}
                        onChange={(e) => setLicenseForm({...licenseForm, year: e.target.value})}
                        className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/20 focus:outline-none focus:border-purple-500"
                      >
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleLicenseGenerate}
                    disabled={!licenseForm.type}
                    className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {isGenerating ? 'Generating...' : 'Generate License'}
                  </button>
                </div>
              ) : activeTab === 'gitignore' ? (
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Project Template</label>
                      <select
                        value={gitignoreForm.template}
                        onChange={(e) => setGitignoreForm({...gitignoreForm, template: e.target.value})}
                        className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/20 focus:outline-none focus:border-purple-500"
                      >
                        <option value="">Select a template</option>
                        {TabContent.gitignore.options.map(option => (
                          <option key={option.id} value={option.id}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-white mb-2">
                        Custom Files
                        <span className="ml-2 text-sm text-gray-400">Separate patterns with commas</span>
                      </label>
                      <input
                        type="text"
                        value={gitignoreForm.customFiles}
                        onChange={(e) => setGitignoreForm({...gitignoreForm, customFiles: e.target.value})}
                        placeholder="e.g., *.log, .env, build/, dist/"
                        className="w-full bg-gray-700/50 text-white rounded-lg px-4 py-2 border border-purple-500/20 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleGitignoreGenerate}
                    disabled={!gitignoreForm.template}
                    className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                  >
                    {isGenerating ? 'Generating...' : 'Generate .gitignore'}
                  </button>
                </div>
              ) : (
                <div className="p-4">
                  <textarea
                    value={codeInput}
                    onChange={(e) => setCodeInput(e.target.value)}
                    placeholder={activeContent.placeholder}
                    className="w-full h-[400px] bg-transparent border border-purple-500/20 rounded-lg p-4 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              )}
            </div>

            {/* Preview Section */}
            <div className="bg-gray-800/50 rounded-xl overflow-hidden border border-purple-500/20">
              <div className="flex justify-between items-center p-4 border-b border-purple-500/20">
                <h3 className="text-xl font-semibold text-white">Preview</h3>
                {generatedOutput && (
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition duration-200 shadow-lg shadow-purple-500/25"
                  >
                    <ThemedIcons.FileText className="w-5 h-5" />
                    <span>Download</span>
                  </button>
                )}
              </div>
              <div className="p-4">
                {activeTab === 'requirements' ? (
                  <pre className="whitespace-pre-wrap font-mono text-white">
                    {requirementsOutput || 'Generated requirements will appear here...'}
                  </pre>
                ) : activeTab === 'readme' ? (
                  <MarkdownPreview 
                    source={markdown} 
                    style={{ 
                      backgroundColor: 'transparent',
                      color: 'inherit'
                    }}
                  />
                ) : (
                  <MarkdownPreview 
                    source={activeTab === 'readme' ? markdown : (generatedOutput || '# Generated output will appear here')} 
                    style={{ 
                      backgroundColor: 'transparent',
                      color: 'inherit'
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
            {error}
          </div>
        )}
      </div>
    </Layout>
  );
}
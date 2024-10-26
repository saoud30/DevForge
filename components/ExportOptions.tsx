import { Download, FileJson, FileText, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface ExportOptionsProps {
  content: string;
  filename: string;
}

export default function ExportOptions({ content, filename }: ExportOptionsProps) {
  const [copied, setCopied] = useState(false);

  const downloadTxt = () => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const downloadJson = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify({ content }, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `${filename}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm" onClick={downloadTxt}>
        <FileText className="h-4 w-4 mr-2" />
        Download TXT
      </Button>
      <Button variant="outline" size="sm" onClick={downloadJson}>
        <FileJson className="h-4 w-4 mr-2" />
        Download JSON
      </Button>
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        {copied ? (
          <Check className="h-4 w-4 mr-2" />
        ) : (
          <Copy className="h-4 w-4 mr-2" />
        )}
        {copied ? 'Copied!' : 'Copy'}
      </Button>
    </div>
  );
}
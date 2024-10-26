import { useState, useEffect } from 'react';
import { Template, CustomTemplate } from '@/lib/types';

const CUSTOM_TEMPLATES_KEY = 'devforge_custom_templates';

export function useTemplates() {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(CUSTOM_TEMPLATES_KEY);
    if (saved) {
      setCustomTemplates(JSON.parse(saved));
    }
  }, []);

  const saveTemplate = (template: Omit<CustomTemplate, 'id' | 'createdAt' | 'lastModified'>) => {
    const newTemplate: CustomTemplate = {
      ...template,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastModified: Date.now(),
    };

    setCustomTemplates(prev => {
      const updated = [...prev, newTemplate];
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateTemplate = (id: string, updates: Partial<CustomTemplate>) => {
    setCustomTemplates(prev => {
      const updated = prev.map(template => 
        template.id === id 
          ? { ...template, ...updates, lastModified: Date.now() }
          : template
      );
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteTemplate = (id: string) => {
    setCustomTemplates(prev => {
      const updated = prev.filter(template => template.id !== id);
      localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const exportTemplates = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(customTemplates, null, 2)], { 
      type: 'application/json' 
    });
    element.href = URL.createObjectURL(file);
    element.download = 'devforge-templates.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const importTemplates = async (file: File) => {
    try {
      const content = await file.text();
      const templates = JSON.parse(content) as CustomTemplate[];
      setCustomTemplates(prev => {
        const updated = [...prev, ...templates];
        localStorage.setItem(CUSTOM_TEMPLATES_KEY, JSON.stringify(updated));
        return updated;
      });
      return true;
    } catch (error) {
      console.error('Error importing templates:', error);
      return false;
    }
  };

  return {
    customTemplates,
    saveTemplate,
    updateTemplate,
    deleteTemplate,
    exportTemplates,
    importTemplates,
  };
}
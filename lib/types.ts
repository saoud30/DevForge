export interface HistoryItem {
  id: string;
  type: 'readme' | 'gitignore' | 'license' | 'requirements';
  content: string;
  timestamp: number;
  title: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
}

export interface CustomTemplate extends Template {
  userId: string;
  createdAt: number;
  lastModified: number;
}

export interface ProjectAnalysis {
  dependencies: {
    name: string;
    version: string;
    vulnerabilities?: string[];
  }[];
  licenses: {
    name: string;
    compatibility: string[];
  }[];
  recommendations: {
    gitignore: string[];
    readme: string[];
    license: string[];
  };
}

export const FILE_TYPES = {
  README: 'readme',
  GITIGNORE: 'gitignore',
  LICENSE: 'license',
  REQUIREMENTS: 'requirements'
} as const;
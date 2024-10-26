export const readmeTemplates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'A clean, simple README template',
    content: `# Project Name\n\nBrief description of the project.\n\n## Installation\n\n## Usage\n\n## License`
  },
  {
    id: 'detailed',
    name: 'Detailed',
    description: 'A comprehensive README template',
    content: `# Project Name\n\n## Description\n\n## Features\n\n## Installation\n\n## Usage\n\n## Contributing\n\n## Tests\n\n## License`
  },
  {
    id: 'opensource',
    name: 'Open Source',
    description: 'Perfect for open source projects',
    content: `# Project Name\n\n## About\n\n## Getting Started\n\n## Contributing\n\n## Code of Conduct\n\n## License`
  }
];

export const gitignoreTemplates = [
  {
    id: 'node',
    name: 'Node.js',
    description: 'Standard Node.js template',
    content: `node_modules/\n.env\n.DS_Store\ndist/\nbuild/`
  },
  {
    id: 'python',
    name: 'Python',
    description: 'Standard Python template',
    content: `__pycache__/\n*.py[cod]\n.env\nvenv/\n.pytest_cache/`
  },
  {
    id: 'web',
    name: 'Web Project',
    description: 'Template for web projects',
    content: `node_modules/\ndist/\n.env\n.DS_Store\n*.log`
  }
];
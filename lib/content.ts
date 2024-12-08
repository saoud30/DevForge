export const TabContent = {
    readme: {
      title: 'README Generator',
      description: 'Create professional README files with AI assistance',
      options: [
        {
          id: 'structural',
          label: 'Structural Template',
          prompt: `Create a professional README.md for my project with the following structure:
  - Centered title with emoji and project name
  - Brief description highlighting key capabilities
  - Shield badges for technologies and license
  - Clear feature list with emojis for each feature
  - Tech stack section showing all technologies used
  - Detailed getting started guide with code blocks
  - Screenshots section
  - Standard sections for Contributing, License, and Support
  - Social links and author credits at the bottom
  
  Include modern styling with HTML center tags and proper markdown formatting.`
        },
        {
          id: 'features',
          label: 'Features-First Template',
          prompt: `Generate a README.md that emphasizes features and technical capabilities:
  - Format with modern GitHub-style markdown
  - Start with eye-catching badges showing tech stack
  - Include a compelling project tagline
  - Create detailed feature descriptions with emoji icons for key features
  - Add installation instructions with environment setup
  - Include placeholder sections for screenshots
  - End with contribution guidelines and license
  
  Focus on making features engaging and clear for developers.
  Important: Include code blocks for installation steps and env setup.`
        },
        {
          id: 'visual',
          label: 'Visual-Rich Template',
          prompt: `Design a visually appealing README.md that prioritizes layout and formatting:
  - Create an aesthetically pleasing header with centered project name
  - Add colorful shield.io badges for technologies, status, and license
  - Structure content with clear H2 headers using emoji icons
  - Include key sections:
    * Project introduction with tagline
    * Features list with descriptive emoji bullets
    * Getting started guide with bash commands
    * Screenshot placeholders
    * Future roadmap
    * Contact information
  - End with centered footer including social links
  
  Style using HTML center tags and markdown formatting
  Note: Focus on spacing, alignment, and visual hierarchy`
        },
        {
          id: 'modern-interactive',
          label: 'Modern Interactive Template',
          prompt: `Create an engaging and interactive README.md with modern elements:
  - Start with an animated GIF or SVG logo placeholder
  - Add dynamic elements:
    * Expandable sections using HTML details/summary
    * Interactive table of contents with jump links
    * Collapsible code examples
    * Quick start command copy buttons
  - Include modern sections:
    * 🎯 Key Features with usage examples
    * 🚀 Quick Start guide
    * 🎨 UI/UX screenshots gallery
    * 🔧 Configuration options table
    * 📈 Performance metrics
    * 🤝 Community & Support links
    * 🗺️ Project roadmap
  - Add engagement elements:
    * Star History chart
    * Contributors section
    * Discord/Community badges
    * Documentation links
  
  Style with modern HTML and CSS-in-markdown techniques
  Focus on user interaction and engagement
  Include dark/light mode compatible elements`
        }
      ],
      defaultContent: `# 🚀 Project Name
  
  <div align="center">
  
  ![Project Status](https://img.shields.io/badge/status-active-success.svg)
  ![License](https://img.shields.io/badge/license-MIT-blue.svg)
  
  A powerful description of your amazing project.
  
  </div>
  
  ## ✨ Features
  
  - 🎯 Feature 1
  - ⚡ Feature 2
  - 🔒 Feature 3
  
  ## 🛠️ Installation
  
  \`\`\`bash
  npm install
  npm run dev
  \`\`\`
  
  ## 📖 Usage
  
  ## 🤝 Contributing
  
  ## 📝 License
  
  ## 📧 Contact`,
      placeholder: 'Describe your project (e.g., name, features, tech stack)...'
    },
    gitignore: {
      title: '.gitignore Generator',
      description: 'Generate .gitignore files for your project',
      options: [
        {
          id: 'python',
          label: 'Python',
          prompt: 'Generate a .gitignore file for a Python project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'node',
          label: 'Node.js',
          prompt: 'Generate a .gitignore file for a Node.js project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'react',
          label: 'React',
          prompt: 'Generate a .gitignore file for a React project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'vue',
          label: 'Vue.js',
          prompt: 'Generate a .gitignore file for a Vue.js project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'angular',
          label: 'Angular',
          prompt: 'Generate a .gitignore file for an Angular project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'django',
          label: 'Django',
          prompt: 'Generate a .gitignore file for a Django project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'flutter',
          label: 'Flutter',
          prompt: 'Generate a .gitignore file for a Flutter project with the following custom patterns:\n{customPatterns}'
        },
        {
          id: 'dotnet',
          label: '.NET',
          prompt: 'Generate a .gitignore file for a .NET project with the following custom patterns:\n{customPatterns}'
        }
      ],
      defaultContent: '',
      placeholder: 'Enter additional files or patterns to ignore (e.g., *.log, .env, build/, dist/)'
    },
    requirements: {
      title: 'Requirements Generator',
      description: 'List your project dependencies with ease',
      defaultContent: '# Dependencies\nnext.js\ntailwindcss\nframer-motion',
      placeholder: 'Enter your project dependencies...'
    },
    license: {
      title: 'License Generator',
      description: 'Choose and generate appropriate licenses',
      options: [
        {
          id: 'mit',
          label: 'MIT License',
          prompt: 'Generate an MIT License with the following details:\nProject Name: {projectName}\nAuthor: {author}\nYear: {year}'
        },
        {
          id: 'apache',
          label: 'Apache License 2.0',
          prompt: 'Generate an Apache 2.0 License with the following details:\nProject Name: {projectName}\nAuthor: {author}\nYear: {year}'
        },
        {
          id: 'gpl3',
          label: 'GNU General Public License v3.0',
          prompt: 'Generate a GNU GPL v3.0 License with the following details:\nProject Name: {projectName}\nAuthor: {author}\nYear: {year}'
        },
        {
          id: 'bsd',
          label: 'BSD 3-Clause License',
          prompt: 'Generate a BSD 3-Clause License with the following details:\nProject Name: {projectName}\nAuthor: {author}\nYear: {year}'
        },
        {
          id: 'isc',
          label: 'ISC License',
          prompt: 'Generate an ISC License with the following details:\nProject Name: {projectName}\nAuthor: {author}\nYear: {year}'
        }
      ],
      defaultContent: '',
      placeholder: 'Select a license type and fill in the details...'
    },
    codeGen: {
      title: 'Code Generation',
      description: 'Generate code with AI assistance',
      options: [
        { id: 'unit-test', label: 'Unit Test Generation', prompt: 'Generate a unit test for the following code:\n' },
        { id: 'interface', label: 'TypeScript Interface', prompt: 'Generate TypeScript interfaces for the following code:\n' },
        { id: 'api', label: 'API Endpoint', prompt: 'Generate an API endpoint boilerplate for:\n' }
      ],
      defaultContent: '// Generated code will appear here',
      placeholder: 'Enter your code or requirements...'
    },
    analysis: {
      title: 'Smart Code Analysis',
      description: 'Analyze your code for improvements',
      options: [
        { id: 'quality', label: 'Code Quality Assessment', prompt: 'Analyze code quality and suggest improvements:\n' },
        { id: 'security', label: 'Security Scan', prompt: 'Scan for security vulnerabilities in:\n' },
        { id: 'performance', label: 'Performance Check', prompt: 'Suggest performance optimizations for:\n' },
        { id: 'practices', label: 'Best Practices', prompt: 'Recommend best practices for:\n' }
      ],
      defaultContent: '# Code Analysis Report\n\n## Findings\n\n## Recommendations',
      placeholder: 'Paste your code for analysis...'
    },
    docs: {
      title: 'Advanced Documentation',
      description: 'Generate comprehensive documentation',
      options: [
        { id: 'api-docs', label: 'API Documentation', prompt: 'Generate API documentation for:\n' },
        { id: 'comments', label: 'Code Comments', prompt: 'Generate detailed comments for:\n' },
        { id: 'function-docs', label: 'Function Documentation', prompt: 'Generate function documentation for:\n' },
        { id: 'architecture', label: 'Architecture Diagrams', prompt: 'Generate architecture diagram in markdown for:\n' }
      ],
      defaultContent: '# Documentation\n\n## Overview\n\n## Details',
      placeholder: 'Enter your code or API endpoints...'
    }
  } as const;
  

import React, { useState, useEffect } from 'react';
import { PortfolioData, Theme, Project, Experience } from './types';
import Editor from './components/Editor';
import PortfolioPreview from './components/PortfolioPreview';
import { Layout, Palette, Sparkles, Download, Eye, PenTool, Moon, Sun } from 'lucide-react';

const INITIAL_DATA: PortfolioData = {
  name: 'Alex Rivera',
  title: 'Senior Frontend Engineer',
  bio: 'Building user-centric digital experiences with modern technologies.',
  email: 'alex@example.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  twitter: 'https://twitter.com',
  profilePictureUrl: 'https://picsum.photos/600/600?grayscale&random=99',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
  projects: [
    {
      id: '1',
      title: 'E-commerce Platform',
      description: 'A full-featured shopping experience built with React and Stripe integration.',
      technologies: ['React', 'Node.js', 'Stripe'],
      link: '#',
      githubRepo: 'https://github.com/example/shop',
      imageUrl: 'https://picsum.photos/800/600?random=1'
    }
  ],
  experiences: [
    {
      id: '1',
      company: 'TechFlow Inc.',
      role: 'Frontend Developer',
      period: '2021 - Present',
      description: 'Led the redesign of the core product dashboard using modern UI patterns.'
    }
  ]
};

const App: React.FC = () => {
  const [data, setData] = useState<PortfolioData>(INITIAL_DATA);
  const [theme, setTheme] = useState<Theme>(Theme.MODERN);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const updateData = (newData: Partial<PortfolioData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleExportPDF = () => {
    // We use the browser's print engine which is the most reliable way 
    // to generate searchable, high-quality PDFs from web content.
    // The @media print styles in index.html take care of the layout.
    window.print();
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'}`}>
      {/* Navigation Header */}
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white">PortfoliAI</span>
          </div>

          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'editor' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <PenTool className="w-4 h-4" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === 'preview' ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="bg-white dark:bg-slate-800 dark:text-white border border-slate-300 dark:border-slate-700 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={Theme.MODERN}>Modern Theme</option>
              <option value={Theme.MINIMAL}>Minimal Theme</option>
              <option value={Theme.CREATIVE}>Creative Theme</option>
            </select>
            <button 
              onClick={handleExportPDF}
              className="flex items-center gap-2 bg-slate-900 dark:bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)]">
          {/* Editor Side */}
          <section className={`${activeTab === 'editor' ? 'block' : 'hidden lg:block'} overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300 editor-container`}>
            <Editor data={data} updateData={updateData} isDarkMode={isDarkMode} />
          </section>

          {/* Preview Side */}
          <section className={`${activeTab === 'preview' ? 'block' : 'hidden lg:block'} overflow-y-auto bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm relative transition-colors duration-300 preview-container`}>
            <div className="sticky top-0 right-0 left-0 bg-slate-50 dark:bg-slate-800 border-b dark:border-slate-700 p-2 flex justify-center text-xs text-slate-400 font-medium z-10 transition-colors duration-300 preview-header-bar">
              LIVE PREVIEW - {theme.toUpperCase()} - {isDarkMode ? 'DARK' : 'LIGHT'}
            </div>
            <PortfolioPreview data={data} theme={theme} isDarkMode={isDarkMode} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;

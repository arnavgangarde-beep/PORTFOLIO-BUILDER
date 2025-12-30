
import React, { useState } from 'react';
import { PortfolioData, Theme } from '../types';
import { Github, Linkedin, Mail, ArrowUpRight, Send, CheckCircle2, Loader2, User, Twitter, BarChart3, ChevronRight, Trophy, BookOpen, X } from 'lucide-react';

interface PreviewProps {
  data: PortfolioData;
  theme: Theme;
  isDarkMode: boolean;
}

const ContactSection: React.FC<{ data: PortfolioData; theme: Theme; styles: any; isDarkMode: boolean }> = ({ data, theme, styles, isDarkMode }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setStatus('success');
    setFormData({ name: '', email: '', message: '' });
    
    setTimeout(() => setStatus('idle'), 5000);
  };

  const inputClass = theme === Theme.CREATIVE 
    ? `w-full p-3 border-2 ${isDarkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-900 bg-white text-slate-900'} focus:translate-x-1 focus:-translate-y-1 transition-transform outline-none` 
    : theme === Theme.MINIMAL
    ? `w-full py-2 border-b ${isDarkMode ? 'border-slate-700 text-white focus:border-indigo-400' : 'border-slate-200 text-slate-900 focus:border-slate-900'} outline-none transition-colors bg-transparent`
    : `w-full p-3 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'} border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all`;

  const labelClass = `text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1 block`;

  return (
    <section id="contact" className="py-12">
      <h3 className={styles.sectionHeading}>
        {theme === Theme.MODERN && <span className="w-12 h-1 bg-indigo-600 inline-block" />}
        Get In Touch
      </h3>
      
      <div className={`grid ${theme === Theme.MODERN ? 'lg:grid-cols-2 gap-16' : 'grid-cols-1 max-w-2xl mx-auto'} items-start`}>
        <div className="space-y-6">
          <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
            Have a project in mind or just want to say hi? My inbox is always open!
          </p>
          <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400 font-medium">
            <Mail className="w-5 h-5" />
            <a href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>
          </div>
        </div>

        <div className={theme === Theme.MODERN ? `${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'} p-8 rounded-3xl border` : ""}>
          {status === 'success' ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h4 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Message Sent!</h4>
              <p className="text-slate-500 text-sm">Thanks for reaching out. I'll get back to you soon.</p>
              <button 
                onClick={() => setStatus('idle')}
                className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className={labelClass}>Name</label>
                <input
                  required
                  type="text"
                  placeholder="Your Name"
                  className={inputClass}
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input
                  required
                  type="email"
                  placeholder="hello@example.com"
                  className={inputClass}
                  value={formData.email}
                  onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className={labelClass}>Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="What's on your mind?"
                  className={inputClass}
                  value={formData.message}
                  onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className={`w-full flex items-center justify-center gap-2 py-4 px-6 font-bold transition-all disabled:opacity-50 ${
                  theme === Theme.CREATIVE 
                    ? `bg-indigo-600 text-white border-2 ${isDarkMode ? 'border-slate-700' : 'border-slate-900'} shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1`
                    : theme === Theme.MINIMAL
                    ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                    : "bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none"
                }`}
              >
                {status === 'sending' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Send Message
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

const PortfolioPreview: React.FC<PreviewProps> = ({ data, theme, isDarkMode }) => {
  const [activeStoryId, setActiveStoryId] = useState<string | null>(null);

  const getThemeStyles = () => {
    switch (theme) {
      case Theme.MINIMAL:
        return {
          container: "max-w-3xl mx-auto py-20 px-6 font-sans",
          header: `space-y-6 mb-20 ${isDarkMode ? 'text-white' : 'text-slate-900'}`,
          name: "text-4xl font-light tracking-tight mb-2",
          title: `text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-8`,
          bio: `text-lg leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-600'}`,
          sectionHeading: `text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-100'} mb-10 border-b pb-2`,
          card: "group mb-12",
          cardTitle: `text-xl font-medium mb-2 group-hover:text-indigo-400 transition-colors ${isDarkMode ? 'text-white' : 'text-slate-900'}`,
          footer: `mt-32 pt-12 border-t ${isDarkMode ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'} text-sm flex justify-between`
        };
      case Theme.CREATIVE:
        return {
          container: "max-w-6xl mx-auto py-20 px-8 font-serif",
          header: "text-center mb-24",
          name: `text-7xl font-bold italic mb-4 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-900'}`,
          title: `text-2xl font-sans uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`,
          bio: `text-2xl leading-relaxed max-w-2xl mx-auto mt-12 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`,
          sectionHeading: `text-4xl font-bold mb-16 relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-4 ${isDarkMode ? 'after:bg-indigo-900/50 text-white' : 'after:bg-indigo-100 text-slate-900'} after:-z-10`,
          card: `bg-white dark:bg-slate-800 p-8 border-2 ${isDarkMode ? 'border-slate-700 shadow-[8px_8px_0px_0px_rgba(30,41,59,1)]' : 'border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]'} hover:translate-x-2 hover:-translate-y-2 transition-transform`,
          cardTitle: `text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`,
          footer: "mt-40 text-center space-y-4"
        };
      case Theme.MODERN:
      default:
        return {
          container: "max-w-5xl mx-auto py-16 px-8 space-y-24",
          header: "grid lg:grid-cols-[1.5fr_1fr] gap-12 items-center",
          name: `text-6xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`,
          title: "text-xl text-indigo-600 dark:text-indigo-400 font-semibold mb-6",
          bio: `text-lg leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`,
          sectionHeading: `flex items-center gap-4 text-2xl font-bold mb-10 ${isDarkMode ? 'text-white' : 'text-slate-900'}`,
          card: `${isDarkMode ? 'bg-slate-800/50 hover:bg-slate-800 border-slate-700' : 'bg-slate-50/50 hover:bg-white border-transparent hover:border-slate-100'} rounded-2xl p-6 hover:shadow-xl transition-all border overflow-hidden`,
          cardTitle: `text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`,
          footer: `mt-24 pt-12 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} flex flex-col items-center gap-8`
        };
    }
  };

  const getStoryStyles = () => {
    if (theme === Theme.CREATIVE) {
      return {
        container: `mb-6 p-6 border-2 ${isDarkMode ? 'border-indigo-400 bg-slate-800 text-slate-100 shadow-[4px_4px_0px_0px_rgba(129,140,248,0.5)]' : 'border-slate-900 bg-white text-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]'}`,
        header: `font-serif font-black italic text-xl mb-4 flex items-center gap-2 ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`,
        label: `font-serif font-bold uppercase text-[10px] tracking-widest block mb-1 ${isDarkMode ? 'text-indigo-400' : 'text-slate-400'}`,
        content: `font-serif text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`
      };
    }
    if (theme === Theme.MINIMAL) {
      return {
        container: `mb-6 p-6 border-l-2 ${isDarkMode ? 'border-indigo-500 bg-slate-800/30 text-slate-200' : 'border-slate-900 bg-slate-50 text-slate-700'}`,
        header: "font-sans font-bold text-sm mb-4 flex items-center gap-2 uppercase tracking-tighter",
        label: `font-sans font-bold uppercase text-[9px] tracking-widest block mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`,
        content: `font-sans text-sm leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`
      };
    }
    // Modern Default
    return {
      container: `mb-6 p-6 rounded-2xl animate-in slide-in-from-top-4 duration-300 ${isDarkMode ? 'bg-indigo-950/40 text-slate-100 border border-indigo-900/50' : 'bg-indigo-50 text-indigo-900 border border-indigo-100'}`,
      header: "font-bold flex items-center gap-2 mb-4",
      label: `font-mono uppercase text-[9px] block mb-1 opacity-70`,
      content: `text-sm leading-relaxed ${isDarkMode ? 'text-slate-200' : 'text-indigo-900'}`
    };
  };

  const styles = getThemeStyles();
  const storyStyles = getStoryStyles();

  // Helper to see if a skill is "proven" by any project
  const isSkillProven = (skill: string) => {
    return data.projects.some(p => p.skillsTagged?.includes(skill));
  };

  return (
    <div className={`${isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'} transition-colors duration-300 min-h-full ${styles.container}`}>
      {/* Hero Section */}
      <header className={styles.header}>
        <div>
          <h2 className={styles.title}>{data.title}</h2>
          <h1 className={styles.name}>{data.name}</h1>
          
          {/* Brand Keywords */}
          {data.brandKeywords && data.brandKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {data.brandKeywords.map((kw, i) => (
                <span key={i} className={`text-[10px] px-2 py-0.5 rounded-full border ${isDarkMode ? 'border-indigo-900/50 bg-indigo-900/10 text-indigo-300' : 'border-indigo-100 bg-indigo-50 text-indigo-600'} font-bold uppercase tracking-wider`}>
                  {kw}
                </span>
              ))}
            </div>
          )}

          <p className={styles.bio}>{data.bio}</p>
          <div className="flex gap-4 mt-8">
            <a href={`mailto:${data.email}`} className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-indigo-600 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white'}`}><Mail className="w-5 h-5" /></a>
            <a href={data.github} target="_blank" className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-white hover:text-black' : 'bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white'}`}><Github className="w-5 h-5" /></a>
            <a href={data.linkedin} target="_blank" className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white'}`}><Linkedin className="w-5 h-5" /></a>
            {data.twitter && (
               <a href={data.twitter} target="_blank" className={`p-2 rounded-full transition-all ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-sky-500 hover:text-white' : 'bg-slate-100 text-slate-600 hover:bg-sky-500 hover:text-white'}`}><Twitter className="w-5 h-5" /></a>
            )}
          </div>
        </div>
        
        {/* Profile Picture in Preview */}
        <div className="relative">
          <div className={`w-full aspect-square ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-50'} rounded-3xl overflow-hidden relative border-2 ${isDarkMode ? 'border-slate-700' : 'border-indigo-100'}`}>
            {data.profilePictureUrl ? (
              <img src={data.profilePictureUrl} className={`w-full h-full object-cover transition-all ${isDarkMode ? 'opacity-70' : 'opacity-100'}`} alt={data.name} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-300">
                <User className="w-20 h-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent pointer-events-none" />
          </div>
          {theme === Theme.MODERN && (
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-yellow-400 rounded-2xl -z-10 rotate-12 opacity-50" />
          )}
        </div>
      </header>

      {/* Skills Coverage */}
      <section>
        <h3 className={styles.sectionHeading}>
          {theme === Theme.MODERN && <span className="w-12 h-1 bg-indigo-600 dark:bg-indigo-400 inline-block" />}
          Proven Expertise
        </h3>
        <div className="flex flex-wrap gap-4">
          {data.skills.map((skill, i) => {
            const proven = isSkillProven(skill);
            return (
              <div key={i} className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all group ${
                proven 
                  ? `${isDarkMode ? 'bg-indigo-900/30 text-indigo-300 border-indigo-800' : 'bg-indigo-50 text-indigo-700 border-indigo-100'} border ring-2 ring-indigo-500/10`
                  : `${isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'} border opacity-60`
              }`}>
                {skill}
                {proven && <Trophy className="w-3 h-3 absolute -top-1 -right-1 text-yellow-500 animate-bounce" />}
                {proven && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    Proven in project works
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Experience */}
      <section>
        <h3 className={styles.sectionHeading}>
          {theme === Theme.MODERN && <span className="w-12 h-1 bg-indigo-600 dark:bg-indigo-400 inline-block" />}
          Career Journey
        </h3>
        <div className="space-y-12">
          {data.experiences.map((exp) => (
            <div key={exp.id} className={theme === Theme.MINIMAL ? styles.card : "flex gap-8 group"}>
              {theme === Theme.MODERN && (
                <div className={`text-sm font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} w-32 pt-2`}>{exp.period}</div>
              )}
              <div className="flex-1">
                <h4 className={styles.cardTitle}>{exp.role}</h4>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-indigo-600 dark:text-indigo-400 font-medium">{exp.company}</span>
                  {theme === Theme.MINIMAL && <span className="text-xs text-slate-400 font-mono">{exp.period}</span>}
                </div>
                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed text-sm`}>
                  {exp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section>
        <h3 className={styles.sectionHeading}>
          {theme === Theme.MODERN && <span className="w-12 h-1 bg-indigo-600 dark:bg-indigo-400 inline-block" />}
          Selected Works
        </h3>
        <div className={`grid ${theme === Theme.CREATIVE ? 'grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
          {data.projects.map((proj) => (
            <div key={proj.id} className={styles.card}>
              <div className={`mb-6 overflow-hidden rounded-xl border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} aspect-[4/3] relative`}>
                <img 
                  src={proj.imageUrl} 
                  alt={proj.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {proj.story && (
                  <button 
                    onClick={() => setActiveStoryId(activeStoryId === proj.id ? null : proj.id)}
                    className="absolute bottom-4 right-4 p-2 bg-white/90 dark:bg-slate-900/90 rounded-full shadow-lg text-indigo-600 dark:text-indigo-400 flex items-center gap-2 text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all group"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300">View Story</span>
                  </button>
                )}
              </div>

              {/* Story Overlay/Section */}
              {activeStoryId === proj.id && proj.story && (
                <div className={storyStyles.container}>
                  <div className="flex justify-between items-start">
                    <h5 className={storyStyles.header}><Trophy className="w-4 h-4" /> The Story</h5>
                    <button onClick={() => setActiveStoryId(null)} className="opacity-70 hover:opacity-100 p-1"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="grid grid-cols-1 gap-5">
                    <div className={storyStyles.content}>
                      <span className={storyStyles.label}>Problem</span>
                      {proj.story.problem}
                    </div>
                    <div className={storyStyles.content}>
                      <span className={storyStyles.label}>Approach</span>
                      {proj.story.approach}
                    </div>
                    <div className={storyStyles.content}>
                      <span className={storyStyles.label}>Solution</span>
                      {proj.story.solution}
                    </div>
                    <div className={storyStyles.content}>
                      <span className={storyStyles.label}>Outcome</span>
                      {proj.story.outcome}
                    </div>
                  </div>
                </div>
              )}

              <h4 className={styles.cardTitle}>{proj.title}</h4>
              <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} text-sm leading-relaxed mb-6`}>
                {proj.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {proj.technologies.map((t, i) => (
                  <span key={i} className={`text-[10px] uppercase tracking-wider font-bold ${isDarkMode ? 'text-slate-500 border-slate-700' : 'text-slate-400 border-slate-200'} border px-1.5 py-0.5 rounded`}>
                    {t}
                  </span>
                ))}
              </div>

              {proj.skillsTagged && proj.skillsTagged.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-6">
                   {proj.skillsTagged.map(s => (
                     <span key={s} className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                       <CheckCircle2 className="w-2.5 h-2.5" /> {s}
                     </span>
                   ))}
                </div>
              )}

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <a href={proj.link} className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:gap-2 transition-all">
                    View Live <ArrowUpRight className="w-4 h-4" />
                  </a>
                  {proj.githubRepo && (
                    <a href={proj.githubRepo} target="_blank" className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-all">
                      Code <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <ContactSection data={data} theme={theme} styles={styles} isDarkMode={isDarkMode} />

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
           &copy; {new Date().getFullYear()} {data.name}. Created with PortfoliAI.
        </div>
        <div className="flex gap-6 text-xs">
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Contact</a>
        </div>
      </footer>
    </div>
  );
};

export default PortfolioPreview;

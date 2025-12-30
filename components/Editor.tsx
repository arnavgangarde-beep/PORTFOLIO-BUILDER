
import React, { useState, useRef } from 'react';
import { PortfolioData, Project, Experience } from '../types';
import { enhanceBio, enhanceProjectDescription, suggestSkills, generateProjectStory, suggestBrandKeywords } from '../services/geminiService';
import { User, Briefcase, Code, FolderGit2, Plus, Trash2, Sparkles, Loader2, Mail, Camera, Image as ImageIcon, X, Github, Linkedin, Twitter, BookOpen, BarChart3, Tag, ExternalLink } from 'lucide-react';

interface EditorProps {
  data: PortfolioData;
  updateData: (newData: Partial<PortfolioData>) => void;
  isDarkMode: boolean;
}

const Editor: React.FC<EditorProps> = ({ data, updateData, isDarkMode }) => {
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleAIAction = async (key: string, action: () => Promise<any>) => {
    setLoadingMap(prev => ({ ...prev, [key]: true }));
    try {
      await action();
    } catch (error) {
      console.error("AI Action Failed", error);
    } finally {
      setLoadingMap(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        callback(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      title: 'New Project',
      description: 'Describe your amazing work...',
      technologies: [],
      skillsTagged: [],
      link: '',
      githubRepo: '',
      imageUrl: `https://picsum.photos/800/600?random=${data.projects.length + 1}`
    };
    updateData({ projects: [...data.projects, newProject] });
  };

  const handleAddExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: 'Company Name',
      role: 'Job Title',
      period: 'Start - End',
      description: 'Role achievements and responsibilities...'
    };
    updateData({ experiences: [...data.experiences, newExp] });
  };

  const sectionHeadingClass = "flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold border-b border-slate-100 dark:border-slate-800 pb-2";
  const inputBaseClass = "w-full border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100";
  const labelClass = "text-xs font-medium text-slate-500 dark:text-slate-400 uppercase";

  return (
    <div className={`p-6 space-y-10 ${isDarkMode ? 'dark' : ''}`}>
      {/* Profile Section */}
      <section className="space-y-6">
        <div className={sectionHeadingClass}>
          <User className="w-5 h-5" />
          <h2>Personal Profile</h2>
        </div>

        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-indigo-100 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              {data.profilePictureUrl ? (
                <img src={data.profilePictureUrl} className="w-full h-full object-cover" alt="Profile" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <User className="w-8 h-8" />
                </div>
              )}
            </div>
            <button
              onClick={() => profileInputRef.current?.click()}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-full"
            >
              <Camera className="w-6 h-6" />
            </button>
            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleImageUpload(e, (url) => updateData({ profilePictureUrl: url }))}
            />
          </div>
          <span className="text-xs text-slate-500 font-medium">Click to upload profile picture</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Full Name</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => updateData({ name: e.target.value })}
              className={inputBaseClass}
            />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Current Title</label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateData({ title: e.target.value })}
              className={inputBaseClass}
            />
          </div>
        </div>

        {/* Brand Keywords Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={labelClass}>Brand Keywords</label>
            <button
              onClick={() => handleAIAction('brand', async () => {
                const keywords = await suggestBrandKeywords(data.title, data.bio);
                updateData({ brandKeywords: keywords });
              })}
              disabled={loadingMap['brand']}
              className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-1 hover:underline"
            >
              {loadingMap['brand'] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              AI Suggest Keywords
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.brandKeywords?.map((kw, i) => (
              <span key={i} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs border border-indigo-100 dark:border-indigo-800 flex items-center gap-1">
                {kw}
                <button onClick={() => updateData({ brandKeywords: data.brandKeywords?.filter((_, j) => i !== j) })} className="hover:text-red-500"><X className="w-3 h-3" /></button>
              </span>
            ))}
            <input
              type="text"
              placeholder="Add keyword..."
              className="text-xs border-b border-slate-200 dark:border-slate-700 bg-transparent outline-none px-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val) {
                    updateData({ brandKeywords: [...(data.brandKeywords || []), val] });
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <label className={labelClass}>Bio / Summary</label>
            <button
              onClick={() => handleAIAction('bio', async () => {
                const enhanced = await enhanceBio(data.name, data.title, data.bio);
                if (enhanced) updateData({ bio: enhanced });
              })}
              disabled={loadingMap['bio']}
              className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-1 hover:underline disabled:opacity-50"
            >
              {loadingMap['bio'] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              Enhance with AI
            </button>
          </div>
          <textarea
            rows={4}
            value={data.bio}
            onChange={(e) => updateData({ bio: e.target.value })}
            className={`${inputBaseClass} resize-none`}
          />
        </div>
      </section>

      {/* Socials & Contact */}
      <section className="space-y-4">
        <div className={sectionHeadingClass}>
          <Mail className="w-5 h-5" />
          <h2>Contact & Links</h2>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-1">
            <label className={labelClass}>Contact Email (Destination)</label>
            <div className="relative">
               <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
               <input
                type="email"
                value={data.email}
                onChange={(e) => updateData({ email: e.target.value })}
                className={`${inputBaseClass} pl-10`}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className={labelClass}>GitHub URL</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.github}
                  onChange={(e) => updateData({ github: e.target.value })}
                  className={`${inputBaseClass} pl-10`}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>LinkedIn URL</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.linkedin}
                  onChange={(e) => updateData({ linkedin: e.target.value })}
                  className={`${inputBaseClass} pl-10`}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Twitter URL</label>
              <div className="relative">
                <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={data.twitter}
                  onChange={(e) => updateData({ twitter: e.target.value })}
                  className={`${inputBaseClass} pl-10`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Code className="w-5 h-5" />
            <h2>Skills</h2>
          </div>
          <button
            onClick={() => handleAIAction('skills', async () => {
              const suggested = await suggestSkills(data.title);
              updateData({ skills: [...new Set([...data.skills, ...suggested])] });
            })}
            disabled={loadingMap['skills']}
            className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-1 hover:underline disabled:opacity-50"
          >
            {loadingMap['skills'] ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            Suggest Skills
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <div key={index} className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md text-sm border border-slate-200 dark:border-slate-700">
              {skill}
              <button
                onClick={() => updateData({ skills: data.skills.filter((_, i) => i !== index) })}
                className="text-slate-400 hover:text-red-500"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
          <input
            type="text"
            placeholder="Add skill..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const val = (e.target as HTMLInputElement).value;
                if (val) {
                  updateData({ skills: [...data.skills, val] });
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            className="border border-dashed border-slate-300 dark:border-slate-700 bg-transparent rounded-md px-2 py-1 text-sm outline-none dark:text-white"
          />
        </div>
      </section>

      {/* Experience Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <Briefcase className="w-5 h-5" />
            <h2>Experience</h2>
          </div>
          <button
            onClick={handleAddExperience}
            className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>
        {data.experiences.map((exp, idx) => (
          <div key={exp.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 relative group bg-slate-50/30 dark:bg-slate-800/20">
            <button
              onClick={() => updateData({ experiences: data.experiences.filter(e => e.id !== exp.id) })}
              className="absolute top-4 right-4 text-slate-300 dark:text-slate-600 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Company"
                value={exp.company}
                onChange={(e) => {
                  const newList = [...data.experiences];
                  newList[idx].company = e.target.value;
                  updateData({ experiences: newList });
                }}
                className="bg-transparent font-medium outline-none focus:text-indigo-600 dark:focus:text-indigo-400 dark:text-white"
              />
              <input
                type="text"
                placeholder="Period"
                value={exp.period}
                onChange={(e) => {
                  const newList = [...data.experiences];
                  newList[idx].period = e.target.value;
                  updateData({ experiences: newList });
                }}
                className="bg-transparent text-sm text-slate-500 dark:text-slate-400 outline-none text-right"
              />
            </div>
            <input
              type="text"
              placeholder="Role"
              value={exp.role}
              onChange={(e) => {
                const newList = [...data.experiences];
                newList[idx].role = e.target.value;
                updateData({ experiences: newList });
              }}
              className="w-full text-sm outline-none bg-transparent dark:text-slate-300"
            />
            <textarea
              rows={2}
              placeholder="Description"
              value={exp.description}
              onChange={(e) => {
                const newList = [...data.experiences];
                newList[idx].description = e.target.value;
                updateData({ experiences: newList });
              }}
              className="w-full text-xs text-slate-600 dark:text-slate-400 outline-none bg-transparent resize-none border-t border-slate-100 dark:border-slate-700 pt-2"
            />
          </div>
        ))}
      </section>

      {/* Projects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold">
            <FolderGit2 className="w-5 h-5" />
            <h2>Projects</h2>
          </div>
          <button
            onClick={handleAddProject}
            className="text-indigo-600 dark:text-indigo-400 text-xs flex items-center gap-1 hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add Project
          </button>
        </div>
        {data.projects.map((proj, idx) => (
          <div key={proj.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4 bg-slate-50/30 dark:bg-slate-800/20">
            <div className="flex justify-between items-center">
              <input
                type="text"
                placeholder="Project Title"
                value={proj.title}
                onChange={(e) => {
                  const newList = [...data.projects];
                  newList[idx].title = e.target.value;
                  updateData({ projects: newList });
                }}
                className="bg-transparent font-bold text-slate-800 dark:text-white outline-none text-lg"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleAIAction(`story-${proj.id}`, async () => {
                    const story = await generateProjectStory(proj.title, proj.description);
                    if (story) {
                      const newList = [...data.projects];
                      newList[idx].story = story;
                      updateData({ projects: newList });
                    }
                  })}
                  disabled={loadingMap[`story-${proj.id}`]}
                  className="p-1.5 rounded-md text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 flex items-center gap-1 text-xs"
                  title="Generate AI Story"
                >
                  {loadingMap[`story-${proj.id}`] ? <Loader2 className="w-4 h-4 animate-spin" /> : <BookOpen className="w-4 h-4" />}
                  Story
                </button>
                <button
                  onClick={() => updateData({ projects: data.projects.filter(p => p.id !== proj.id) })}
                  className="p-1.5 text-slate-300 dark:text-slate-600 hover:text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Story Preview/Editor if exists */}
            {proj.story && (
              <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-900/50 text-[11px] space-y-2">
                <p className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI Project Storytelling</p>
                <div className="grid grid-cols-2 gap-2">
                  <div><span className="font-semibold block opacity-60 uppercase">Problem</span>{proj.story.problem}</div>
                  <div><span className="font-semibold block opacity-60 uppercase">Approach</span>{proj.story.approach}</div>
                  <div><span className="font-semibold block opacity-60 uppercase">Solution</span>{proj.story.solution}</div>
                  <div><span className="font-semibold block opacity-60 uppercase">Outcome</span>{proj.story.outcome}</div>
                </div>
              </div>
            )}

            {/* Project Image Upload */}
            <div className="relative group/img aspect-video rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
              {proj.imageUrl ? (
                <img src={proj.imageUrl} className="w-full h-full object-cover" alt={proj.title} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
              <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer gap-2 text-xs font-bold">
                <ImageIcon className="w-4 h-4" />
                Change Image
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (url) => {
                    const newList = [...data.projects];
                    newList[idx].imageUrl = url;
                    updateData({ projects: newList });
                  })}
                />
              </label>
            </div>

            <textarea
              rows={2}
              placeholder="Brief description..."
              value={proj.description}
              onChange={(e) => {
                const newList = [...data.projects];
                newList[idx].description = e.target.value;
                updateData({ projects: newList });
              }}
              className="w-full text-sm text-slate-600 dark:text-slate-400 outline-none bg-transparent resize-none border-b border-slate-100 dark:border-slate-700 pb-2"
            />

            {/* Project Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={labelClass}>Live Demo URL</label>
                <div className="relative">
                  <ExternalLink className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="https://..."
                    value={proj.link}
                    onChange={(e) => {
                      const newList = [...data.projects];
                      newList[idx].link = e.target.value;
                      updateData({ projects: newList });
                    }}
                    className={`${inputBaseClass} pl-8 text-xs py-1.5`}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className={labelClass}>GitHub Repo URL</label>
                <div className="relative">
                  <Github className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={proj.githubRepo}
                    onChange={(e) => {
                      const newList = [...data.projects];
                      newList[idx].githubRepo = e.target.value;
                      updateData({ projects: newList });
                    }}
                    className={`${inputBaseClass} pl-8 text-xs py-1.5`}
                  />
                </div>
              </div>
            </div>

            {/* Skill Tagging for Projects */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1"><Tag className="w-3 h-3" /> Skill-Project Matching</label>
              <div className="flex flex-wrap gap-1.5">
                {data.skills.map(skill => (
                  <button
                    key={skill}
                    onClick={() => {
                      const newList = [...data.projects];
                      const currentSkills = proj.skillsTagged || [];
                      if (currentSkills.includes(skill)) {
                        newList[idx].skillsTagged = currentSkills.filter(s => s !== skill);
                      } else {
                        newList[idx].skillsTagged = [...currentSkills, skill];
                      }
                      updateData({ projects: newList });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition-all ${
                      proj.skillsTagged?.includes(skill)
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "border-slate-200 dark:border-slate-700 text-slate-500 hover:border-indigo-400"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
               <input
                type="text"
                placeholder="Tech stacks (Enter)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const val = (e.target as HTMLInputElement).value;
                    if (val) {
                      const newList = [...data.projects];
                      newList[idx].technologies = [...proj.technologies, val];
                      updateData({ projects: newList });
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
                className="text-xs border-b border-slate-200 dark:border-slate-700 bg-transparent outline-none py-1 dark:text-slate-400 flex-1"
              />
              <div className="flex flex-wrap gap-1">
                {proj.technologies.map((t, ti) => (
                  <span key={ti} className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 flex items-center gap-1">
                    {t}
                    <button onClick={() => {
                      const newList = [...data.projects];
                      newList[idx].technologies = proj.technologies.filter((_, i) => i !== ti);
                      updateData({ projects: newList });
                    }}><X className="w-2 h-2" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Editor;

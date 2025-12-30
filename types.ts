
export interface ProjectStory {
  problem?: string;
  approach?: string;
  solution?: string;
  outcome?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  skillsTagged?: string[]; // For Skill-Project Matching
  link: string;
  imageUrl: string;
  story?: ProjectStory;
  githubRepo?: string;
  stats?: {
    stars?: number;
    forks?: number;
  };
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  brandKeywords?: string[];
  email: string;
  github: string;
  linkedin: string;
  twitter?: string;
  profilePictureUrl?: string;
  skills: string[];
  projects: Project[];
  experiences: Experience[];
}

export enum Theme {
  MODERN = 'modern',
  MINIMAL = 'minimal',
  CREATIVE = 'creative'
}

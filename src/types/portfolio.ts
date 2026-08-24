export interface StatItem {
  label: string
  value: number
  prefix?: string
  suffix?: string
  description?: string
}

export interface Profile {
  name: string
  displayLogo: string
  role: string
  headline: string
  badge: string
  currentCompany: string
  companyUrl?: string
  location: string
  level: string
  bio: string
  stats: StatItem[]
}

export interface SkillItem {
  name: string
  description: string
  badge: string
  badgeVariant: 'core' | 'meta' | 'stack' | 'safe' | 'base' | 'css' | 'pre' | 'vcs'
  iconUrl?: string
  customIconText?: string
  iconBgColor?: string
  iconTextColor?: string
}

export interface SkillCluster {
  clusterNumber: string
  title: string
  skills: SkillItem[]
}

export interface ProjectDiff {
  filename: string
  additions: number
  deletions: number
  highlights: string[]
}

export interface Project {
  id: string
  projectNumber: string
  title: string
  badge: string
  typeBadge?: string
  description: string
  stack: string[]
  liveUrl?: string
  repoUrl?: string
  diff?: ProjectDiff
  isCurrentSite?: boolean
}

export interface ExperienceDiff {
  filename: string
  additions: number
  deletions: number
  highlights: string[]
}

export interface Experience {
  id: string
  missionNumber: string
  role: string
  company: string
  companyUrl?: string
  location: string
  department?: string
  period: string
  statusBadge?: string
  isCurrent?: boolean
  commitHash?: string
  description: string
  diff?: ExperienceDiff
  tags: string[]
}

export interface SocialLink {
  platform: string
  url: string
  label: string
  iconName?: string
  isMailto?: boolean
}

export interface PortfolioData {
  profile: Profile
  skillsConstellation: SkillCluster[]
  selectedWork: Project[]
  careerMissionLog: Experience[]
  socialLinks: SocialLink[]
  marqueeItems: string[]
}

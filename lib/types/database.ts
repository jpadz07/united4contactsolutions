export interface HeaderData {
  id?: number;
  company_name: string;
  tagline: string;
  logo?: string; // base64 data URL or image URL
  updated_at?: string;
}

export interface HeroData {
  id?: number;
  headline: string;
  subheadline: string;
  description: string;
  cta_primary: string;
  cta_secondary: string;
  updated_at?: string;
}

export interface CoreValue {  
  id?: number;
  icon: string; // base64 or URL
  title: string;
  description: string;
  color: string;
  order: number;
  updated_at?: string;
}

export interface AboutData {
  id?: number;
  description: string;
  mission: string;
  vision: string;
  updated_at?: string;
}

export interface Service {
  id?: number;
  title: string;
  description: string;
  icon: string; // base64 or URL
  features: string[];
  order: number;
  updated_at?: string;
}

export interface TeamMember {
  id?: number;
  name: string;
  role: string;
  icon: string; // base64 or URL
  bio: string;
  skills: string[];
  experience: string;
  email: string;
  projects: string[];
  updated_at?: string;
}

export interface Project {
  id?: number;
  title: string;
  category: string;
  color: string;
  order: number;
  updated_at?: string;
}

export interface Testimonial {
  id?: number;
  name: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  result: string;
  avatar: string; // base64 or URL
  order: number;
  updated_at?: string;
}


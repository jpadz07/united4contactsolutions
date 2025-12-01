-- Create tables for United4ContactSolutions CMS

-- Header table
CREATE TABLE IF NOT EXISTS header (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL DEFAULT 'United4ContactSolutions',
  tagline TEXT NOT NULL DEFAULT 'Unity • Precision • Integrity • Impact',
  logo TEXT, -- base64 data URL or image URL
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero section table
CREATE TABLE IF NOT EXISTS hero (
  id SERIAL PRIMARY KEY,
  headline TEXT NOT NULL,
  subheadline TEXT NOT NULL,
  description TEXT NOT NULL,
  cta_primary TEXT NOT NULL DEFAULT 'Schedule Consultation',
  cta_secondary TEXT NOT NULL DEFAULT 'View Services',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Core Values table
CREATE TABLE IF NOT EXISTS core_values (
  id SERIAL PRIMARY KEY,
  icon TEXT NOT NULL, -- base64 or URL
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL, -- Tailwind gradient classes
  "order" INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- About section table
CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  description TEXT NOT NULL,
  mission TEXT NOT NULL,
  vision TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL, -- base64 or URL
  features JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of feature strings
  "order" INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team table
CREATE TABLE IF NOT EXISTS team (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  icon TEXT NOT NULL, -- base64 or URL
  bio TEXT NOT NULL,
  skills JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of skill strings
  experience TEXT NOT NULL,
  email TEXT NOT NULL,
  projects JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of project strings
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  color TEXT NOT NULL, -- Tailwind gradient classes
  "order" INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  company TEXT NOT NULL,
  quote TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  result TEXT NOT NULL,
  avatar TEXT NOT NULL, -- base64 or URL
  "order" INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_core_values_order ON core_values("order");
CREATE INDEX IF NOT EXISTS idx_services_order ON services("order");
CREATE INDEX IF NOT EXISTS idx_projects_order ON projects("order");
CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials("order");

-- Enable Row Level Security (RLS) - you can adjust policies as needed
ALTER TABLE header ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero ENABLE ROW LEVEL SECURITY;
ALTER TABLE core_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE team ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (for landing page)
-- Admin write access should be handled through service role key
CREATE POLICY "Allow public read access" ON header FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON hero FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON core_values FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON about FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON team FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON testimonials FOR SELECT USING (true);


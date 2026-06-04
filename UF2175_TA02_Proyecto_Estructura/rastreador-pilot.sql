-- ============================================================================

-- ----------------------------------------------------------------------------
-- 001_create_users
-- ----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('candidate', 'company', 'headhunter', 'admin');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'candidate',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 002_create_candidates
-- ----------------------------------------------------------------------------
CREATE TYPE work_modality AS ENUM ('remote', 'hybrid', 'on-site');

CREATE TABLE IF NOT EXISTS candidates (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  bio TEXT,
  location VARCHAR(150),
  experience_years SMALLINT DEFAULT 0,
  preferred_modality work_modality,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 003_create_companies
-- ----------------------------------------------------------------------------
CREATE TYPE company_size AS ENUM ('startup', 'small', 'medium', 'large', 'enterprise');

CREATE TABLE IF NOT EXISTS companies (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  description TEXT,
  industry VARCHAR(100),
  size company_size,
  location VARCHAR(150),
  website VARCHAR(300),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 004_create_headhunters
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS headhunters (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(150) NOT NULL,
  agency VARCHAR(150),
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 005_create_technologies
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS technologies (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  category VARCHAR(100)
);

-- ----------------------------------------------------------------------------
-- 006_create_benefits
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS benefits (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT
);

-- ----------------------------------------------------------------------------
-- 007_create_company_technologies
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_technologies (
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  technology_id INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, technology_id)
);

-- ----------------------------------------------------------------------------
-- 008_create_company_benefits
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_benefits (
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  benefit_id INTEGER NOT NULL REFERENCES benefits(id) ON DELETE CASCADE,
  PRIMARY KEY (company_id, benefit_id)
);

-- ----------------------------------------------------------------------------
-- 009_create_job_offers
-- ----------------------------------------------------------------------------
CREATE TYPE offer_status AS ENUM ('draft', 'active', 'paused', 'closed');
CREATE TYPE contract_type AS ENUM ('full-time', 'part-time');

CREATE TABLE IF NOT EXISTS job_offers (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  headhunter_id INTEGER REFERENCES headhunters(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  modality work_modality,
  income INTEGER,
  location VARCHAR(150),
  contract_type contract_type,
  status offer_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT offer_has_publisher CHECK (company_id IS NOT NULL OR headhunter_id IS NOT NULL)
);

-- ----------------------------------------------------------------------------
-- 010_create_offer_technologies
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS offer_technologies (
  offer_id INTEGER NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
  technology_id INTEGER NOT NULL REFERENCES technologies(id) ON DELETE CASCADE,
  PRIMARY KEY (offer_id, technology_id)
);

-- ----------------------------------------------------------------------------
-- 011_create_applications
-- ----------------------------------------------------------------------------
CREATE TYPE application_status AS ENUM ('applied', 'interview', 'rejected', 'accepted');

CREATE TABLE IF NOT EXISTS applications (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  offer_id INTEGER NOT NULL REFERENCES job_offers(id) ON DELETE CASCADE,
  status application_status NOT NULL DEFAULT 'applied',
  cover_letter TEXT,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (candidate_id, offer_id)
);

-- ----------------------------------------------------------------------------
-- 012_create_interviews
-- ----------------------------------------------------------------------------
CREATE TYPE interview_type AS ENUM ('phone', 'video','on-site');
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'no-show');

CREATE TABLE IF NOT EXISTS interviews (
  id SERIAL PRIMARY KEY,
  application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  scheduled_at TIMESTAMPTZ,
  type interview_type,
  notes TEXT,
  status interview_status NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 013_create_favorites
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id SERIAL PRIMARY KEY,
  candidate_id INTEGER NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (candidate_id, company_id)
);

-- ----------------------------------------------------------------------------
-- 014_create_company_reviews
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS company_reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  title VARCHAR(200),
  overall_rating SMALLINT NOT NULL CHECK (overall_rating BETWEEN 1 AND 5),
  work_env_rating SMALLINT CHECK (work_env_rating BETWEEN 1 AND 5),
  growth_rating SMALLINT CHECK (growth_rating BETWEEN 1 AND 5),
  salary_rating SMALLINT CHECK (salary_rating BETWEEN 1 AND 5),
  interview_rating SMALLINT CHECK (interview_rating BETWEEN 1 AND 5),
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 015_create_review_comments
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS review_comments (
  id SERIAL PRIMARY KEY,
  review_id INTEGER NOT NULL REFERENCES company_reviews(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 016_create_salaries
-- ----------------------------------------------------------------------------
CREATE TYPE experience_level AS ENUM ('junior', 'mid', 'senior');

CREATE TABLE IF NOT EXISTS salaries (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  technology_id INTEGER REFERENCES technologies(id) ON DELETE SET NULL,
  role_name VARCHAR(150) NOT NULL,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  experience_level experience_level,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- ============================================================================
-- Datos de prueba (15 INSERTs)
-- Orden respetando dependencias de claves foráneas.
-- Asume una base de datos vacía (los SERIAL empiezan en 1).
-- ============================================================================

-- 1) users  (ids 1..6)
INSERT INTO users (email, password_hash, role) VALUES
  ('ana.garcia@example.com',     '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('luis.martin@example.com',    '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('contact@techcorp.example',   '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('hr@dataworks.example',       '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('recruiter@talenthub.example','$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('admin@platform.example',     '$2b$10$abcdefghijklmnopqrstuv', 'admin');

-- 2) candidates  (ids 1..2)
INSERT INTO candidates (user_id, full_name, bio, location, experience_years, preferred_modality) VALUES
  (1, 'Ana García',  'Backend developer con foco en PostgreSQL.', 'Madrid',    5, 'remote'),
  (2, 'Luis Martín', 'Frontend developer enfocado en React.',     'Barcelona', 3, 'hybrid');

-- 3) companies  (ids 1..2)
INSERT INTO companies (user_id, name, description, industry, size, location, website) VALUES
  (3, 'TechCorp',  'Empresa de desarrollo de software.', 'Software',       'medium',  'Madrid',   'https://techcorp.example'),
  (4, 'DataWorks', 'Consultora de analítica de datos.',  'Data Analytics', 'startup', 'Valencia', 'https://dataworks.example');

-- 4) headhunters  (id 1)
INSERT INTO headhunters (user_id, full_name, agency, bio) VALUES
  (5, 'Carlos Ruiz', 'TalentHub', 'Reclutador especializado en perfiles tech.');

-- 5) technologies  (ids 1..5)
INSERT INTO technologies (name, category) VALUES
  ('PostgreSQL', 'Database'),
  ('JavaScript', 'Language'),
  ('React',      'Frontend'),
  ('Node.js',    'Backend'),
  ('Python',     'Language');

-- 6) benefits  (ids 1..4)
INSERT INTO benefits (name, description) VALUES
  ('Remote work',      'Trabajo en remoto.'),
  ('Health insurance', 'Seguro médico privado.'),
  ('Flexible hours',   'Horario flexible.'),
  ('Training budget',  'Presupuesto anual de formación.');

-- 7) company_technologies
INSERT INTO company_technologies (company_id, technology_id) VALUES
  (1, 1),
  (1, 2),
  (1, 4),
  (2, 1),
  (2, 5);

-- 8) company_benefits
INSERT INTO company_benefits (company_id, benefit_id) VALUES
  (1, 1),
  (1, 2),
  (2, 3),
  (2, 4);

-- 9) job_offers  (ids 1..3)  -- cumple offer_has_publisher (company_id o headhunter_id)
INSERT INTO job_offers (company_id, headhunter_id, title, description, modality, income, location, contract_type, status) VALUES
  (1,    NULL, 'Senior Backend Developer', 'Desarrollo de APIs con Node.js y PostgreSQL.', 'remote', 55000, 'Madrid',   'full-time', 'active'),
  (2,    NULL, 'Data Engineer',            'Pipelines de datos con Python.',               'hybrid', 48000, 'Valencia', 'full-time', 'active'),
  (NULL, 1,    'Frontend Developer',       'Desarrollo de interfaces con React.',          'remote', 45000, NULL,       'full-time', 'active');

-- 10) offer_technologies
INSERT INTO offer_technologies (offer_id, technology_id) VALUES
  (1, 4),
  (1, 1),
  (2, 5),
  (3, 3),
  (3, 2);

-- 11) applications  (ids 1..3)  -- UNIQUE(candidate_id, offer_id)
INSERT INTO applications (candidate_id, offer_id, status, cover_letter) VALUES
  (1, 1, 'interview', 'Interesada en el puesto de backend.'),
  (2, 3, 'applied',   'Me encaja el stack de React.'),
  (1, 2, 'applied',   'Tengo experiencia con Python.');

-- 12) interviews  (id 1)
INSERT INTO interviews (application_id, scheduled_at, type, notes, status) VALUES
  (1, '2026-06-05 10:00:00+02', 'video', 'Primera entrevista técnica.', 'scheduled');

-- 13) favorites  -- UNIQUE(candidate_id, company_id)
INSERT INTO favorites (candidate_id, company_id) VALUES
  (1, 1),
  (2, 2);

-- 14) company_reviews  (ids 1..2)  -- ratings 1..5
INSERT INTO company_reviews (user_id, company_id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous) VALUES
  (1, 1, 'Buen ambiente de trabajo', 4, 5, 4, 3, 4, FALSE),
  (2, 2, 'Proyecto interesante',     5, 4, 5, 4, 5, TRUE);

-- 15) review_comments
INSERT INTO review_comments (review_id, user_id, content) VALUES
  (1, 3, 'Gracias por la reseña, valoramos el feedback.'),
  (2, 4, 'Nos alegra que el proyecto te resulte interesante.');

-- 16) salaries  -- experience_level: junior | mid | senior ; currency CHAR(3)
INSERT INTO salaries (company_id, technology_id, role_name, currency, experience_level) VALUES
  (1,    4,    'Backend Developer',  'EUR', 'senior'),
  (2,    5,    'Data Engineer',      'EUR', 'mid'),
  (NULL, 3,    'Frontend Developer', 'EUR', 'junior');


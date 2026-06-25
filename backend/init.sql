--init.sql
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
  amount INTEGER NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  experience_level experience_level,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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
INSERT INTO salaries (company_id, technology_id, role_name, amount, currency, experience_level) VALUES
  (1,    4,    'Backend Developer',  55000, 'EUR', 'senior'),
  (2,    5,    'Data Engineer',      48000, 'EUR', 'mid'),
  (NULL, 3,    'Frontend Developer', 45000, 'EUR', 'junior');


-- users  (ids 7..36)
INSERT INTO users (email, password_hash, role) VALUES
  ('marta.lopez@example.com',       '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('javier.sanchez@example.com',    '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('lucia.fernandez@example.com',   '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('pablo.gomez@example.com',       '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('sara.diaz@example.com',         '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('hugo.moreno@example.com',       '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('elena.jimenez@example.com',     '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('diego.alvarez@example.com',     '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('claudia.romero@example.com',    '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('adrian.navarro@example.com',    '$2b$10$abcdefghijklmnopqrstuv', 'candidate'),
  ('jobs@cloudnine.example',        '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('talent@byteforge.example',      '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('careers@nimbus.example',        '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('hr@quantumsoft.example',        '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('contact@pixellabs.example',     '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('jobs@datavault.example',        '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('hello@greenstack.example',      '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('rrhh@codeforge.example',        '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('team@skylineapps.example',      '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('info@deltatech.example',        '$2b$10$abcdefghijklmnopqrstuv', 'company'),
  ('sofia.gomez@hireup.example',    '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('diego.torres@peoplelink.example','$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('elena.navarro@toptalent.example','$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('pablo.diaz@recruitpro.example', '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('laura.ortiz@findr.example',     '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('marcos.gil@huntly.example',     '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('nuria.castro@talentia.example', '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('raul.serrano@nexushr.example',  '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('alba.reyes@matchpoint.example', '$2b$10$abcdefghijklmnopqrstuv', 'headhunter'),
  ('ivan.molina@selecta.example',   '$2b$10$abcdefghijklmnopqrstuv', 'headhunter');

-- candidates  (ids 3..12)  -> user_id 7..16
INSERT INTO candidates (user_id, full_name, bio, location, experience_years, preferred_modality) VALUES
  (7,  'Marta López',     'Arquitecta cloud con experiencia en AWS.',        'Valencia',  7, 'on-site'),
  (8,  'Javier Sánchez',  'Junior developer aprendiendo Node.js.',           'Sevilla',   2, 'remote'),
  (9,  'Lucía Fernández', 'Data analyst especializada en Python.',           'Bilbao',    4, 'hybrid'),
  (10, 'Pablo Gómez',     'DevOps con foco en Docker y Kubernetes.',         'Madrid',    6, 'remote'),
  (11, 'Sara Díaz',       'Fullstack developer con TypeScript.',             'Barcelona', 4, 'hybrid'),
  (12, 'Hugo Moreno',     'Mobile developer Android y Kotlin.',              'Málaga',    3, 'remote'),
  (13, 'Elena Jiménez',   'QA engineer con automatización de pruebas.',      'Zaragoza',  5, 'on-site'),
  (14, 'Diego Álvarez',   'Backend developer en Go y microservicios.',       'Madrid',    8, 'remote'),
  (15, 'Claudia Romero',  'UX/UI designer con base en frontend.',            'Valencia',  4, 'hybrid'),
  (16, 'Adrián Navarro',  'Data engineer con experiencia en pipelines.',     'Sevilla',   6, 'remote');

-- companies  (ids 3..12)  -> user_id 17..26
INSERT INTO companies (user_id, name, description, industry, size, location, website) VALUES
  (17, 'CloudNine',  'Servicios de infraestructura cloud.',      'Cloud Services', 'large',      'Barcelona', 'https://cloudnine.example'),
  (18, 'ByteForge',  'Desarrollo de producto a medida.',         'Software',       'small',      'Sevilla',   'https://byteforge.example'),
  (19, 'Nimbus',     'Plataforma SaaS B2B.',                     'SaaS',           'enterprise', 'Madrid',    'https://nimbus.example'),
  (20, 'QuantumSoft','Software de computación de alto rendimiento.','Software',     'medium',     'Bilbao',    'https://quantumsoft.example'),
  (21, 'PixelLabs',  'Estudio de diseño de producto digital.',   'Design',         'startup',    'Valencia',  'https://pixellabs.example'),
  (22, 'DataVault',  'Almacenamiento y seguridad de datos.',     'Data',           'large',      'Madrid',    'https://datavault.example'),
  (23, 'GreenStack', 'Software para sostenibilidad.',            'GreenTech',      'small',      'Zaragoza',  'https://greenstack.example'),
  (24, 'CodeForge',  'Consultora de desarrollo backend.',        'Software',       'medium',     'Málaga',    'https://codeforge.example'),
  (25, 'SkylineApps','Desarrollo de apps móviles.',              'Mobile',         'startup',    'Barcelona', 'https://skylineapps.example'),
  (26, 'DeltaTech',  'Integración de sistemas empresariales.',   'IT Services',    'enterprise', 'Madrid',    'https://deltatech.example');

-- headhunters  (ids 2..11)  -> user_id 27..36
INSERT INTO headhunters (user_id, full_name, agency, bio) VALUES
  (27, 'Sofía Gómez',    'HireUp',     'Especialista en selección de developers.'),
  (28, 'Diego Torres',   'PeopleLink', 'Reclutador de perfiles de datos.'),
  (29, 'Elena Navarro',  'TopTalent',  'Headhunter de perfiles senior.'),
  (30, 'Pablo Díaz',     'RecruitPro', 'Selección de perfiles frontend y backend.'),
  (31, 'Laura Ortiz',    'Findr',      'Reclutadora de perfiles cloud y DevOps.'),
  (32, 'Marcos Gil',     'Huntly',     'Especialista en perfiles mobile.'),
  (33, 'Nuria Castro',   'Talentia',   'Selección de perfiles QA y testing.'),
  (34, 'Raúl Serrano',   'NexusHR',    'Reclutador de perfiles fullstack.'),
  (35, 'Alba Reyes',     'MatchPoint', 'Headhunter de perfiles de producto.'),
  (36, 'Iván Molina',    'Selecta',    'Selección de perfiles de ingeniería.');

-- technologies  (ids 6..15)  -- nombres UNIQUE, sin colisionar con los 5 existentes
INSERT INTO technologies (name, category) VALUES
  ('TypeScript', 'Language'),
  ('Go',         'Language'),
  ('Rust',       'Language'),
  ('Java',       'Language'),
  ('Docker',     'DevOps'),
  ('Kubernetes', 'DevOps'),
  ('AWS',        'Cloud'),
  ('GraphQL',    'API'),
  ('MongoDB',    'Database'),
  ('Redis',      'Database');

-- benefits  (ids 5..14)  -- nombres UNIQUE, sin colisionar con los 4 existentes
INSERT INTO benefits (name, description) VALUES
  ('Stock options',      'Participación en acciones de la empresa.'),
  ('Gym membership',     'Acceso a gimnasio.'),
  ('Meal vouchers',      'Cheques restaurante.'),
  ('Paid time off',      'Días libres adicionales pagados.'),
  ('Parental leave',     'Permiso parental ampliado.'),
  ('Company laptop',     'Portátil de empresa.'),
  ('Annual bonus',       'Bonus anual por objetivos.'),
  ('Pension plan',       'Plan de pensiones.'),
  ('Childcare support',  'Ayuda para guardería.'),
  ('Commuter benefits',  'Ayuda al transporte.');

-- company_technologies  (+10 pares; PK company_id+technology_id, sin duplicar existentes)
INSERT INTO company_technologies (company_id, technology_id) VALUES
  (3,  3),
  (4,  6),
  (5,  7),
  (6,  8),
  (7,  9),
  (8,  10),
  (9,  11),
  (10, 12),
  (11, 13),
  (12, 14);

-- company_benefits  (+10 pares; PK company_id+benefit_id, sin duplicar existentes)
INSERT INTO company_benefits (company_id, benefit_id) VALUES
  (3,  5),
  (4,  6),
  (5,  7),
  (6,  8),
  (7,  9),
  (8,  10),
  (9,  11),
  (10, 12),
  (11, 13),
  (12, 14);

-- job_offers  (ids 4..13)  -- cumple offer_has_publisher (company_id o headhunter_id)
INSERT INTO job_offers (company_id, headhunter_id, title, description, modality, income, location, contract_type, status) VALUES
  (3,    NULL, 'Cloud Architect',        'Diseño de infraestructura cloud en AWS.',       'remote',  65000, 'Barcelona', 'full-time', 'active'),
  (4,    NULL, 'Mobile Developer',       'Desarrollo de apps Android con Kotlin.',        'hybrid',  42000, 'Sevilla',   'full-time', 'active'),
  (5,    NULL, 'QA Engineer',            'Automatización de pruebas.',                    'on-site', 40000, 'Madrid',    'full-time', 'paused'),
  (6,    NULL, 'Go Backend Developer',   'Microservicios en Go.',                         'remote',  58000, 'Bilbao',    'full-time', 'active'),
  (7,    NULL, 'UX/UI Designer',         'Diseño de interfaces de producto.',             'hybrid',  44000, 'Valencia',  'part-time', 'active'),
  (NULL, 2,    'Data Engineer',          'Pipelines de datos a gran escala.',             'remote',  52000, NULL,        'full-time', 'active'),
  (NULL, 3,    'DevOps Engineer',        'CI/CD con Docker y Kubernetes.',                'remote',  60000, 'Madrid',    'full-time', 'active'),
  (NULL, 4,    'Fullstack Developer',    'Desarrollo fullstack con TypeScript.',          'hybrid',  50000, 'Barcelona', 'full-time', 'draft'),
  (8,    NULL, 'Database Administrator', 'Administración de MongoDB y Redis.',            'on-site', 47000, 'Zaragoza',  'full-time', 'closed'),
  (9,    NULL, 'Java Developer',         'Desarrollo backend en Java.',                   'hybrid',  49000, 'Málaga',    'full-time', 'active');

-- offer_technologies  (+10 pares; PK offer_id+technology_id, sin duplicar existentes)
INSERT INTO offer_technologies (offer_id, technology_id) VALUES
  (4,  7),
  (5,  6),
  (6,  2),
  (7,  6),
  (8,  3),
  (9,  11),
  (10, 13),
  (11, 6),
  (12, 14),
  (13, 9);

-- applications  (ids 4..13)  -- UNIQUE(candidate_id, offer_id), sin duplicar existentes
INSERT INTO applications (candidate_id, offer_id, status, cover_letter) VALUES
  (3,  4,  'interview', 'Tengo experiencia en arquitectura cloud.'),
  (4,  5,  'applied',   'Me interesa el desarrollo mobile.'),
  (5,  6,  'accepted',  'Domino Go y microservicios.'),
  (6,  7,  'rejected',  'Me gustaría crecer en diseño de producto.'),
  (7,  8,  'applied',   'Experiencia sólida en QA y automatización.'),
  (8,  9,  'interview', 'He trabajado con pipelines de datos.'),
  (9,  10, 'applied',   'Manejo Docker y Kubernetes a diario.'),
  (10, 11, 'accepted',  'Perfil fullstack con TypeScript.'),
  (11, 12, 'applied',   'Experiencia administrando bases de datos.'),
  (12, 13, 'rejected',  'Desarrollo backend en Java desde hace años.');

-- interviews  (ids 2..11)  -> application_id de las nuevas (4..13)
INSERT INTO interviews (application_id, scheduled_at, type, notes, status) VALUES
  (4,  '2026-06-10 09:00:00+02', 'video',   'Entrevista técnica de arquitectura.', 'scheduled'),
  (5,  '2026-06-11 10:30:00+02', 'phone',   'Primer contacto telefónico.',         'completed'),
  (6,  '2026-06-12 12:00:00+02', 'on-site', 'Entrevista final presencial.',        'completed'),
  (7,  '2026-06-13 15:00:00+02', 'video',   'Cancelada por la empresa.',           'cancelled'),
  (8,  '2026-06-14 11:00:00+02', 'phone',   'El candidato no se presentó.',        'no-show'),
  (9,  '2026-06-15 16:30:00+02', 'video',   'Entrevista con el equipo de datos.',  'scheduled'),
  (10, '2026-06-16 09:30:00+02', 'on-site', 'Prueba técnica presencial.',          'completed'),
  (11, '2026-06-17 13:00:00+02', 'video',   'Entrevista de cierre.',               'scheduled'),
  (12, '2026-06-18 10:00:00+02', 'phone',   'Entrevista telefónica inicial.',      'completed'),
  (13, '2026-06-19 14:30:00+02', 'video',   'Entrevista técnica de Java.',         'scheduled');

-- favorites  (ids 3..12)  -- UNIQUE(candidate_id, company_id), sin duplicar existentes
INSERT INTO favorites (candidate_id, company_id) VALUES
  (3,  3),
  (4,  4),
  (5,  5),
  (6,  6),
  (7,  7),
  (8,  8),
  (9,  9),
  (10, 10),
  (11, 11),
  (12, 12);

-- company_reviews  (ids 3..12)  -- ratings 1..5 ; user_id = usuarios candidatos 7..16
INSERT INTO company_reviews (user_id, company_id, title, overall_rating, work_env_rating, growth_rating, salary_rating, interview_rating, anonymous) VALUES
  (7,  3,  'Buena cultura técnica',       4, 4, 4, 3, 4, FALSE),
  (8,  4,  'Equipo cercano',              5, 5, 4, 4, 5, FALSE),
  (9,  5,  'Procesos mejorables',         3, 3, 3, 3, 2, TRUE),
  (10, 6,  'Gran sitio para crecer',      5, 4, 5, 4, 4, FALSE),
  (11, 7,  'Diseño bien valorado',        4, 5, 4, 3, 4, FALSE),
  (12, 8,  'Carga de trabajo alta',       2, 2, 3, 3, 2, TRUE),
  (13, 9,  'Buen onboarding',             4, 4, 4, 4, 5, FALSE),
  (14, 10, 'Salarios competitivos',       5, 4, 4, 5, 4, FALSE),
  (15, 11, 'Ambiente startup dinámico',   4, 5, 5, 3, 4, FALSE),
  (16, 12, 'Estructura muy jerárquica',   3, 3, 2, 4, 3, TRUE);

-- review_comments  (ids 3..12)  -> review_id 3..12 ; user_id = usuarios empresa 17..26
INSERT INTO review_comments (review_id, user_id, content) VALUES
  (3,  17, 'Gracias por destacar nuestra cultura técnica.'),
  (4,  18, 'Nos alegra que valores al equipo.'),
  (5,  19, 'Tomamos nota para mejorar los procesos.'),
  (6,  20, 'Nos encanta ser un buen sitio para crecer.'),
  (7,  21, 'Gracias por reconocer el trabajo de diseño.'),
  (8,  22, 'Estamos revisando la carga de trabajo.'),
  (9,  23, 'Cuidamos mucho el onboarding, gracias.'),
  (10, 24, 'Apostamos por salarios competitivos.'),
  (11, 25, 'El dinamismo es parte de nuestro ADN.'),
  (12, 26, 'Trabajamos en aplanar la estructura.');

-- salaries  (ids 4..13)  -- experience_level: junior|mid|senior ; currency CHAR(3)
INSERT INTO salaries (company_id, technology_id, role_name, amount, currency, experience_level) VALUES
  (3,    7,    'Cloud Architect',        65000, 'EUR', 'senior'),
  (4,    3,    'Mobile Developer',       42000, 'EUR', 'mid'),
  (5,    NULL, 'QA Engineer',            40000, 'EUR', 'mid'),
  (6,    2,    'Go Backend Developer',   58000, 'EUR', 'senior'),
  (7,    3,    'UX/UI Designer',         44000, 'EUR', 'junior'),
  (8,    14,   'Database Administrator', 47000, 'EUR', 'senior'),
  (9,    11,   'Java Developer',         49000, 'EUR', 'mid'),
  (10,   6,    'DevOps Engineer',        60000, 'EUR', 'senior'),
  (11,   1,    'Data Engineer',          52000, 'EUR', 'mid'),
  (NULL, 6,    'Frontend Developer',     45000, 'EUR', 'junior');

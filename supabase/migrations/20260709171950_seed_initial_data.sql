-- ============================================================
-- Chemistry Educator Portal — Updated Seed Data Migration
-- All subjects now use ONLY the three canonical chemistry subjects:
--   'Physical Chemistry' | 'Organic Chemistry' | 'Inorganic Chemistry'
-- ============================================================

-- ─── Notes ───────────────────────────────────────────────
INSERT INTO public.notes (id, course, subject, chapter, title, description, file_url, file_size, download_count) VALUES
  ('note-jm-1',  'jee-main',     'Physical Chemistry',  'Electrostatics',        'Gauss''s Law and Field Formulations',                  'Detailed analysis of electric flux, Gaussian surfaces, and derivation of fields for symmetrical charge distributions.',      'gauss-law-formulations.pdf',            '2.4 MB', 342),
  ('note-jm-2',  'jee-main',     'Organic Chemistry',   'Reaction Mechanisms',   'Nucleophilic Substitution & Elimination Reactions',    'Comprehensive analysis of SN1, SN2, E1, and E2 mechanisms with stereochemistry implications and exam patterns.',              'nucleophilic-substitution-elimination.pdf', '1.8 MB', 512),
  ('note-jm-3',  'jee-main',     'Inorganic Chemistry', 'Coordination Compounds','Crystal Field Theory & Ligand Field Theory',           'Rigorous analysis of d-orbital splitting, colour in complexes, magnetic properties, and spectrochemical series.',            'crystal-field-theory.pdf',              '3.1 MB', 428),
  ('note-ja-1',  'jee-advanced', 'Physical Chemistry',  'Chemical Kinetics',     'Activation Energy & Arrhenius Equation',               'Rigorous mathematical formulations of rate laws, integrated rate expressions, temperature dependence, and catalysis.',       'activation-energy-arrhenius.pdf',       '4.2 MB', 289),
  ('note-ja-2',  'jee-advanced', 'Organic Chemistry',   'Aromatic Chemistry',    'Electrophilic Aromatic Substitution & Directing Effects','Advanced treatment of Wheland intermediate, resonance stabilisation, and predicting substitution patterns.',               'electrophilic-aromatic-substitution.pdf','3.8 MB', 310),
  ('note-nt-1',  'neet',         'Inorganic Chemistry', 'Periodic Table',        'Periodic Trends & Chemical Periodicity',               'Visual derivations of atomic radii, ionisation energies, electron affinities, and electronegativity across groups and periods.','periodic-trends-neet.pdf',              '2.9 MB', 615),
  ('note-nt-2',  'neet',         'Physical Chemistry',  'Thermodynamics',        'Enthalpy, Entropy & Gibbs Free Energy',                'Step-by-step derivations of Hess''s law, Born-Haber cycles, entropy calculations, and spontaneity criteria.',                'thermodynamics-gibbs.pdf',              '1.7 MB', 489),
  ('note-net-1', 'net',          'Physical Chemistry',  'Quantum Chemistry',     'Particle in a Box & Schrödinger Equation',             'Rigorous quantum mechanical treatment of the particle in a box model, normalisation, and energy eigenvalues.',                 'quantum-schrodinger.pdf',               '5.1 MB', 154),
  ('note-msc-1', 'msc-entrance', 'Organic Chemistry',   'Pericyclic Reactions',  'Woodward–Hoffmann Rules & Frontier Molecular Orbital Theory','Introduction to thermal vs. photochemical selection rules, electrocyclic reactions, and sigmatropic rearrangements.',    'woodward-hoffmann-pericyclic.pdf',      '3.4 MB', 198)
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  chapter = EXCLUDED.chapter,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- ─── Videos ──────────────────────────────────────────────
INSERT INTO public.videos (id, course, subject, chapter, title, youtube_link, thumbnail, description, duration) VALUES
  ('vid-jm-1', 'jee-main',     'Physical Chemistry',  'Electrostatics',          'Visualising Gauss''s Law & Electric Field Lines',       'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80', 'An intuitive, geometric lecture on electric field fluxes, Gauss''s surfaces, and electrostatic fields in conductors.', '45:12'),
  ('vid-jm-2', 'jee-main',     'Organic Chemistry',   'Hydrocarbons',            'Alkene Reactions: Addition Mechanisms Explained',       'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', 'Breaking down Markovnikov and anti-Markovnikov addition, halogenation, hydration, and ozonolysis step by step.',       '52:40'),
  ('vid-ja-1', 'jee-advanced', 'Physical Chemistry',  'Electrochemistry',        'Nernst Equation & Electrochemical Cell Analysis',       'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80', 'Solving complex electrochemical cell problems, standard reduction potentials, and concentration cell calculations.',    '1:12:15'),
  ('vid-nt-1', 'neet',         'Inorganic Chemistry', 'Hydrogen & Its Compounds','Hydrogen: Isotopes, Preparation & Industrial Uses',     'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', 'Visual breakdown of protium, deuterium, tritium properties, manufacture of hydrogen, and water chemistry.',             '38:50')
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  chapter = EXCLUDED.chapter,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- ─── PYQs ────────────────────────────────────────────────
INSERT INTO public.pyqs (id, course, subject, chapter, year, difficulty, question_url, solution_url, question_size, solution_size) VALUES
  ('pyq-jm-1', 'jee-main',     'Physical Chemistry',  'Electrostatics',         2024, 'Medium', 'pyq-jee-main-electrostatics-2024.pdf',     'sol-jee-main-electrostatics-2024.pdf',     '420 KB', '1.2 MB'),
  ('pyq-jm-2', 'jee-main',     'Organic Chemistry',   'Reaction Mechanisms',    2023, 'Hard',   'pyq-jee-main-mechanisms-2023.pdf',         'sol-jee-main-mechanisms-2023.pdf',         '510 KB', '1.5 MB'),
  ('pyq-ja-1', 'jee-advanced', 'Physical Chemistry',  'Chemical Kinetics',      2024, 'Hard',   'pyq-jee-adv-kinetics-2024.pdf',            'sol-jee-adv-kinetics-2024.pdf',            '620 KB', '2.1 MB'),
  ('pyq-ja-2', 'jee-advanced', 'Inorganic Chemistry', 'Coordination Compounds', 2022, 'Hard',   'pyq-jee-adv-coordination-2022.pdf',        'sol-jee-adv-coordination-2022.pdf',        '390 KB', '1.4 MB')
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  chapter = EXCLUDED.chapter,
  year = EXCLUDED.year,
  difficulty = EXCLUDED.difficulty;

-- ─── Practice Sheets ─────────────────────────────────────
INSERT INTO public.practice_sheets (id, course, subject, chapter, title, description, file_url, file_size) VALUES
  ('ps-jm-1', 'jee-main',     'Physical Chemistry',  'Electrostatics',         'Electrostatic Potential and Capacitors Drill',       '45 targeted multiple-choice questions on capacitor networks, dielectric insertions, and energy storage formulas.',      'ps-electrostatics-potentials.pdf', '1.1 MB'),
  ('ps-jm-2', 'jee-main',     'Organic Chemistry',   'Reaction Mechanisms',    'Organic Reaction Mechanisms Challenge Sheet',         'Practice set focusing on SN1/SN2 selectivity, carbocation stability, and stereochemical outcomes.',                    'ps-organic-mechanisms.pdf',        '950 KB'),
  ('ps-ja-1', 'jee-advanced', 'Inorganic Chemistry', 'Coordination Compounds', 'Coordination Chemistry Level-2 Practice',            'Multi-concept integer-type and paragraph problems on CFSE, spectrochemical series, and isomerism.',                    'ps-coordination-adv.pdf',          '1.6 MB')
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  chapter = EXCLUDED.chapter,
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- ─── Doubts ──────────────────────────────────────────────
INSERT INTO public.doubts (id, name, email, subject, question, attachment_name, answer_text, is_answered, created_at) VALUES
  (
    'doubt-1',
    'Siddharth Sharma',
    'siddharth.s@student.in',
    'JEE Advanced — Physical Chemistry',
    'In chemical kinetics, how do we correctly apply the Arrhenius equation when comparing two reactions at different temperatures? Specifically, how does the frequency factor A change with temperature?',
    'kinetics-diagram.jpg',
    'Excellent question, Siddharth. The frequency factor A is usually treated as temperature-independent in elementary analyses, but at a deeper level it contains a pre-exponential entropic term. For two reactions: use ln(k₂/k₁) = (Eₐ/R)(1/T₁ − 1/T₂) when A is constant. I have uploaded a comprehensive derivation under the Physical Chemistry Notes section.',
    TRUE,
    '2026-07-07T14:30:00Z'
  ),
  (
    'doubt-2',
    'Aditi Patel',
    'aditi.patel@gmail.com',
    'JEE Main — Organic Chemistry',
    'How do we predict the major product in a Diels–Alder reaction when the diene isn''t symmetric? Do we use FMO or resonance arguments?',
    NULL,
    NULL,
    FALSE,
    '2026-07-08T09:15:00Z'
  ),
  (
    'doubt-3',
    'Rohan Deshmukh',
    'rohan.d@netprep.org',
    'CSIR NET — Inorganic Chemistry',
    'In a complex [Co(NH₃)₄Cl₂]⁺, how do we determine which geometric isomer is more stable using Crystal Field Theory?',
    'complex_geometry.pdf',
    'For Rohan: 1) Draw both cis and trans isomers. 2) Calculate the CFSE contribution for each — in trans, the two Cl⁻ are opposite so their weak field effect is distributed differently. 3) Compare the overall stabilisation. Generally the cis isomer gains more CFSE due to stronger net ligand field from three NH₃ around each Co axis.',
    TRUE,
    '2026-07-05T11:00:00Z'
  ),
  (
    'doubt-4',
    'Meera Nair',
    'meera.nair@neetacademy.com',
    'NEET — Physical Chemistry',
    'Does buffer capacity change when we dilute a buffer? What happens to pH after dilution?',
    NULL,
    NULL,
    FALSE,
    '2026-07-08T18:45:00Z'
  )
ON CONFLICT (id) DO UPDATE SET
  subject = EXCLUDED.subject,
  question = EXCLUDED.question;

-- ─── Announcements ───────────────────────────────────────
INSERT INTO public.announcements (id, title, body, category, pinned, created_at) VALUES
  (
    'ann-1',
    'New JEE Advanced Coordination Chemistry notes are live',
    'A fresh, rigorous set of notes on crystal field theory and geometric isomerism has just been added to the JEE Advanced Inorganic Chemistry section. Pair it with the Level-2 practice sheet for best results.',
    'resource',
    TRUE,
    '2026-07-08T10:00:00Z'
  ),
  (
    'ann-2',
    'Doubt-clearing window: every Sunday, 6–8 PM',
    'From this week onwards, submitted doubts will be answered in a dedicated Sunday evening session. Post your questions before Saturday night to have them addressed first.',
    'schedule',
    FALSE,
    '2026-07-06T09:30:00Z'
  ),
  (
    'ann-3',
    'CSIR NET aspirants: revised Physical Chemistry roadmap',
    'The quantum chemistry sequence has been reordered for a smoother build-up. Start from the Schrödinger equation note before attempting the spectroscopy problems.',
    'exam',
    FALSE,
    '2026-07-02T14:15:00Z'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body;

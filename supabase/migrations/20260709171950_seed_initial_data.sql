-- ============================================================
-- Chemistry Educator Portal — Seed Data Migration
-- Mirrors the mock data from src/data.ts
-- ============================================================

-- ─── Notes ───────────────────────────────────────────────
INSERT INTO public.notes (id, course, subject, chapter, title, description, file_url, file_size, download_count) VALUES
  ('note-jm-1',  'jee-main',     'Chemistry', 'Electrostatics',     'Gauss''s Law and Field Formulations',          'Detailed analysis of electric flux, Gaussian surfaces, and derivation of fields for symmetrical charge distributions.', 'gauss-law-formulations.pdf',       '2.4 MB', 342),
  ('note-jm-2',  'jee-main',     'Chemistry', 'Kinematics',          'Projectile Motion on Inclined Planes',         'Mathematical breakdowns of trajectory parameters, maximum range derivations, and typical competitive exam patterns.', 'projectile-inclined-planes.pdf',   '1.8 MB', 512),
  ('note-jm-3',  'jee-main',     'Mathematics','Calculus',            'Limits, Continuity, and Differentiability',    'Rigorous epsilon-delta conceptual introductions, standard limits, and intermediate value theorem applications.',        'limits-continuity-guide.pdf',      '3.1 MB', 428),
  ('note-ja-1',  'jee-advanced', 'Chemistry', 'Rotational Dynamics', 'Rigid Body Collisions & Angular Impulse',      'Rigorous mathematical formulations of eccentric impacts, conservation laws during collisions, and rolling constraints.', 'rigid-body-collisions.pdf',        '4.2 MB', 289),
  ('note-ja-2',  'jee-advanced', 'Mathematics','Integral Calculus',   'Definite Integrals & Leibnitz Rule',           'Advanced integration reduction formulas, summation of series using integrals, and differentiation under the integral sign.', 'definite-integrals-leibnitz.pdf', '3.8 MB', 310),
  ('note-nt-1',  'neet',         'Chemistry', 'Optics',              'Wave Optics & Young''s Double Slit Experiment','Visual derivations of fringe width, coherence criteria, phase differences, and experimental modifications.',          'wave-optics-ydse.pdf',             '2.9 MB', 615),
  ('note-nt-2',  'neet',         'Chemistry', 'Thermodynamics',      'Carnot Engine & Thermodynamic Cycles',         'Step-by-step indicator diagrams, efficiency calculations, entropy statements, and physical significance.',            'carnot-engine-cycles.pdf',         '1.7 MB', 489),
  ('note-net-1', 'net',          'Mathematical Chemistry','Complex Analysis','Cauchy Residual Theorem and Contour Integration','Rigorous proof of the residue theorem and its application to evaluating complex trigonometric and improper integrals.','cauchy-residue-integration.pdf', '5.1 MB', 154),
  ('note-msc-1', 'msc-entrance', 'Classical Mechanics','Lagrangian Formalism','Euler-Lagrange Equations and Constraints','Introduction to generalized coordinates, virtual work principle, and Lagrangian derivations for double pendulums.','euler-lagrange-formalism.pdf', '3.4 MB', 198)
ON CONFLICT (id) DO NOTHING;

-- ─── Videos ──────────────────────────────────────────────
INSERT INTO public.videos (id, course, subject, chapter, title, youtube_link, thumbnail, description, duration) VALUES
  ('vid-jm-1', 'jee-main',     'Chemistry',  'Electrostatics',     'Visualizing Gauss''s Law & Field Lines',         'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80', 'An intuitive, geometric lecture on electric field fluxes, Gauss''s surfaces, and electrostatic fields in conductors.', '45:12'),
  ('vid-jm-2', 'jee-main',     'Mathematics','Calculus',            'Understanding Limits & Continuity Geometrically','https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80', 'Breaking down the concept of infinitesimals, limits, and continuous curves through dynamic graph visualizations.', '52:40'),
  ('vid-ja-1', 'jee-advanced', 'Chemistry',  'Rotational Dynamics', 'Rigorous Angular Momentum Conservation Analysis','https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80', 'Solving complex multi-body rotation problems, rolling with slipping, and torque-free precession conceptually.',        '1:12:15'),
  ('vid-nt-1', 'neet',         'Chemistry',  'Optics',              'Wave Optics: Interference & Polarization',       'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', 'Visual breakdown of coherent sources, double-slit patterns, polarization vectors, and Malus''s Law.',              '38:50')
ON CONFLICT (id) DO NOTHING;

-- ─── PYQs ────────────────────────────────────────────────
INSERT INTO public.pyqs (id, course, subject, chapter, year, difficulty, question_url, solution_url, question_size, solution_size) VALUES
  ('pyq-jm-1', 'jee-main',     'Chemistry',  'Electrostatics',     2024, 'Medium', 'pyq-jee-main-electrostatics-2024.pdf',  'sol-jee-main-electrostatics-2024.pdf', '420 KB', '1.2 MB'),
  ('pyq-jm-2', 'jee-main',     'Mathematics','Calculus',            2023, 'Hard',   'pyq-jee-main-calculus-2023.pdf',        'sol-jee-main-calculus-2023.pdf',       '510 KB', '1.5 MB'),
  ('pyq-ja-1', 'jee-advanced', 'Chemistry',  'Rotational Dynamics', 2024, 'Hard',   'pyq-jee-adv-rotational-2024.pdf',       'sol-jee-adv-rotational-2024.pdf',      '620 KB', '2.1 MB'),
  ('pyq-ja-2', 'jee-advanced', 'Chemistry',  'Thermodynamics',      2022, 'Hard',   'pyq-jee-adv-thermo-2022.pdf',           'sol-jee-adv-thermo-2022.pdf',          '390 KB', '1.4 MB')
ON CONFLICT (id) DO NOTHING;

-- ─── Practice Sheets ─────────────────────────────────────
INSERT INTO public.practice_sheets (id, course, subject, chapter, title, description, file_url, file_size) VALUES
  ('ps-jm-1', 'jee-main',     'Chemistry',  'Electrostatics',     'Electrostatic Potential and Capacitors Drill',  '45 targeted multiple-choice questions on capacitor networks, dielectric insertions, and energy storage formulas.', 'ps-electrostatics-potentials.pdf', '1.1 MB'),
  ('ps-jm-2', 'jee-main',     'Mathematics','Calculus',            'Differential Calculus Challenge Sheet',         'Practice set focusing on tangents and normals, maxima and minima theorems, and rate measures.',                    'ps-differential-calculus.pdf',     '950 KB'),
  ('ps-ja-1', 'jee-advanced', 'Chemistry',  'Rotational Dynamics', 'Rigid Body Dynamics Level-2 Practice',         'Multi-concept integer-type and paragraph problems on rolling on moving planks and gyroscopic torque.',             'ps-rigid-body-adv.pdf',            '1.6 MB')
ON CONFLICT (id) DO NOTHING;

-- ─── Doubts ──────────────────────────────────────────────
INSERT INTO public.doubts (id, name, email, subject, question, attachment_name, answer_text, is_answered, created_at) VALUES
  (
    'doubt-1',
    'Siddharth Sharma',
    'siddharth.s@student.in',
    'JEE Advanced Chemistry - Rotational Dynamics',
    'In a cylinder rolling without slipping down a movable wedge, how do we correctly formulate the constraint relation between the wedge acceleration and the rolling center acceleration?',
    'constraint-diagram.jpg',
    'Excellent question, Siddharth. To link the accelerations: 1) Express the velocity of the contact point of the cylinder with the wedge. 2) Since there is no slipping, this point''s relative velocity to the wedge must be zero along the tangent. 3) Differentiate this constraint relation. Remember to account for the wedge''s horizontal acceleration when translating coordinates from the ground frame to the wedge frame. I have uploaded a comprehensive step-by-step vector derivation under the Rotational Dynamics Notes section.',
    TRUE,
    '2026-07-07T14:30:00Z'
  ),
  (
    'doubt-2',
    'Aditi Patel',
    'aditi.patel@gmail.com',
    'JEE Main Mathematics - Calculus',
    'How do we evaluate the limit as x approaches 0 for (sin(x) - x) / x^3 without using L''Hopital''s Rule? Our class hasn''t covered derivatives yet.',
    NULL,
    NULL,
    FALSE,
    '2026-07-08T09:15:00Z'
  ),
  (
    'doubt-3',
    'Rohan Deshmukh',
    'rohan.d@netprep.org',
    'CSIR NET - Lagrangian Mechanics',
    'In a double pendulum system with equal masses and lengths, how does one decouple the small-angle Euler-Lagrange equations to find the normal modes of oscillation?',
    'normal_modes.pdf',
    'For small oscillations, Rohan: 1) Approximate the Lagrangian to quadratic order in the generalized coordinates and velocities. 2) Write the T (kinetic energy) and V (potential energy) matrices. 3) Solve the secular determinant equation det(V - w^2 T) = 0. This gives the normal frequencies. 4) Substitute these back to find the eigenvectors which yield the normal coordinates. The lower mode has masses in-phase, while the higher mode has them in anti-phase.',
    TRUE,
    '2026-07-05T11:00:00Z'
  ),
  (
    'doubt-4',
    'Meera Nair',
    'meera.nair@neetacademy.com',
    'NEET Chemistry - Wave Optics',
    'Does the fringe width in Young''s Double Slit Experiment change if the whole apparatus is immersed in water? How do we calculate the new fringe width?',
    NULL,
    NULL,
    FALSE,
    '2026-07-08T18:45:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Announcements ───────────────────────────────────────
INSERT INTO public.announcements (id, title, body, category, pinned, created_at) VALUES
  (
    'ann-1',
    'New JEE Advanced Rotational Dynamics notes are live',
    'A fresh, rigorous set of notes on rigid-body collisions and angular impulse has just been added to the JEE Advanced library. Pair it with the Level-2 practice sheet for best results.',
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
    'CSIR NET aspirants: revised spectroscopy roadmap',
    'The molecular spectroscopy sequence has been reordered for a smoother build-up. Start from the quantum foundations note before attempting the contour-integration problems.',
    'exam',
    FALSE,
    '2026-07-02T14:15:00Z'
  )
ON CONFLICT (id) DO NOTHING;

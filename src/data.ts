/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement } from './types';
import { SUBJECTS } from './constants/subjects';

export const EXAMS: ExamInfo[] = [
  {
    id: 'jee-main',
    title: 'JEE Main',
    description: 'Comprehensive resources for JEE Main Physical & Organic Chemistry, including concept sheets and mock drills.',
    icon: 'Atom'
  },
  {
    id: 'jee-advanced',
    title: 'JEE Advanced',
    description: 'Advanced-level problem-solving notes, multi-concept derivation guides, and deep-dive lectures.',
    icon: 'FlaskConical'
  },
  {
    id: 'neet',
    title: 'NEET Chemistry',
    description: 'Conceptual theory notes, formula sheets, and speed-accuracy practice booklets specialized for medical aspirants.',
    icon: 'Stethoscope'
  },
  {
    id: 'net',
    title: 'CSIR NET',
    description: 'Postgraduate-level quantum chemistry, thermodynamics, and molecular spectroscopy resources.',
    icon: 'Hexagon'
  },
  {
    id: 'msc-entrance',
    title: 'M.Sc Entrance',
    description: 'Unified syllabus notes for IIT JAM, TIFR, and central university entrance tests in physical sciences.',
    icon: 'GraduationCap'
  }
];

// Re-export for convenience
export { SUBJECTS };

export const INITIAL_NOTES: Note[] = [
  // JEE Main
  {
    id: 'note-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    title: "Gauss's Law and Field Formulations",
    description: 'Detailed analysis of electric flux, Gaussian surfaces, and derivation of fields for symmetrical charge distributions.',
    fileUrl: 'gauss-law-formulations.pdf',
    fileSize: '2.4 MB',
    downloadCount: 342
  },
  {
    id: 'note-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Reaction Mechanisms',
    title: 'Nucleophilic Substitution & Elimination Reactions',
    description: 'Comprehensive analysis of SN1, SN2, E1, and E2 mechanisms with stereochemistry implications and typical competitive exam patterns.',
    fileUrl: 'nucleophilic-substitution-elimination.pdf',
    fileSize: '1.8 MB',
    downloadCount: 512
  },
  {
    id: 'note-jm-3',
    course: 'jee-main',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    title: 'Crystal Field Theory & Ligand Field Theory',
    description: 'Rigorous analysis of d-orbital splitting, colour in complexes, magnetic properties, and spectrochemical series.',
    fileUrl: 'crystal-field-theory.pdf',
    fileSize: '3.1 MB',
    downloadCount: 428
  },

  // JEE Advanced
  {
    id: 'note-ja-1',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Kinetics',
    title: 'Activation Energy & Arrhenius Equation',
    description: 'Rigorous mathematical formulations of rate laws, integrated rate expressions, temperature dependence, and catalysis.',
    fileUrl: 'activation-energy-arrhenius.pdf',
    fileSize: '4.2 MB',
    downloadCount: 289
  },
  {
    id: 'note-ja-2',
    course: 'jee-advanced',
    subject: 'Organic Chemistry',
    chapter: 'Aromatic Chemistry',
    title: 'Electrophilic Aromatic Substitution & Directing Effects',
    description: 'Advanced treatment of Wheland intermediate, resonance stabilisation, and predicting substitution patterns.',
    fileUrl: 'electrophilic-aromatic-substitution.pdf',
    fileSize: '3.8 MB',
    downloadCount: 310
  },

  // NEET
  {
    id: 'note-nt-1',
    course: 'neet',
    subject: 'Inorganic Chemistry',
    chapter: 'Periodic Table',
    title: 'Periodic Trends & Chemical Periodicity',
    description: 'Visual derivations of atomic radii, ionisation energies, electron affinities, and electronegativity across groups and periods.',
    fileUrl: 'periodic-trends-neet.pdf',
    fileSize: '2.9 MB',
    downloadCount: 615
  },
  {
    id: 'note-nt-2',
    course: 'neet',
    subject: 'Physical Chemistry',
    chapter: 'Thermodynamics',
    title: 'Enthalpy, Entropy & Gibbs Free Energy',
    description: "Step-by-step derivations of Hess's law, Born-Haber cycles, entropy calculations, and spontaneity criteria.",
    fileUrl: 'thermodynamics-gibbs.pdf',
    fileSize: '1.7 MB',
    downloadCount: 489
  },

  // NET
  {
    id: 'note-net-1',
    course: 'net',
    subject: 'Physical Chemistry',
    chapter: 'Quantum Chemistry',
    title: 'Particle in a Box & Schrödinger Equation',
    description: 'Rigorous quantum mechanical treatment of the particle in a box model, normalisation, and energy eigenvalues.',
    fileUrl: 'quantum-schrodinger.pdf',
    fileSize: '5.1 MB',
    downloadCount: 154
  },

  // M.Sc Entrance
  {
    id: 'note-msc-1',
    course: 'msc-entrance',
    subject: 'Organic Chemistry',
    chapter: 'Pericyclic Reactions',
    title: "Woodward–Hoffmann Rules & Frontier Molecular Orbital Theory",
    description: 'Introduction to thermal vs. photochemical selection rules, electrocyclic reactions, cycloadditions, and sigmatropic rearrangements.',
    fileUrl: 'woodward-hoffmann-pericyclic.pdf',
    fileSize: '3.4 MB',
    downloadCount: 198
  }
];

export const INITIAL_VIDEOS: Video[] = [
  // JEE Main
  {
    id: 'vid-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    title: "Visualising Gauss's Law & Electric Field Lines",
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=600&q=80',
    description: "An intuitive, geometric lecture on electric field fluxes, Gauss's surfaces, and electrostatic fields in conductors.",
    duration: '45:12'
  },
  {
    id: 'vid-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Hydrocarbons',
    title: 'Alkene Reactions: Addition Mechanisms Explained',
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    description: 'Breaking down Markovnikov and anti-Markovnikov addition, halogenation, hydration, and ozonolysis step by step.',
    duration: '52:40'
  },

  // JEE Advanced
  {
    id: 'vid-ja-1',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Electrochemistry',
    title: 'Nernst Equation & Electrochemical Cell Analysis',
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=600&q=80',
    description: 'Solving complex electrochemical cell problems, standard reduction potentials, and concentration cell calculations.',
    duration: '1:12:15'
  },

  // NEET
  {
    id: 'vid-nt-1',
    course: 'neet',
    subject: 'Inorganic Chemistry',
    chapter: 'Hydrogen & Its Compounds',
    title: 'Hydrogen: Isotopes, Preparation & Industrial Uses',
    youtubeLink: 'https://www.youtube.com/watch?v=g-lWKa20Z5s',
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    description: 'Visual breakdown of protium, deuterium, tritium properties, manufacture of hydrogen, and water chemistry.',
    duration: '38:50'
  }
];

export const INITIAL_PYQS: PYQ[] = [
  // JEE Main
  {
    id: 'pyq-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    year: 2024,
    difficulty: 'Medium',
    questionUrl: 'pyq-jee-main-electrostatics-2024.pdf',
    solutionUrl: 'sol-jee-main-electrostatics-2024.pdf',
    questionSize: '420 KB',
    solutionSize: '1.2 MB'
  },
  {
    id: 'pyq-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Reaction Mechanisms',
    year: 2023,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-main-mechanisms-2023.pdf',
    solutionUrl: 'sol-jee-main-mechanisms-2023.pdf',
    questionSize: '510 KB',
    solutionSize: '1.5 MB'
  },

  // JEE Advanced
  {
    id: 'pyq-ja-1',
    course: 'jee-advanced',
    subject: 'Physical Chemistry',
    chapter: 'Chemical Kinetics',
    year: 2024,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-adv-kinetics-2024.pdf',
    solutionUrl: 'sol-jee-adv-kinetics-2024.pdf',
    questionSize: '620 KB',
    solutionSize: '2.1 MB'
  },
  {
    id: 'pyq-ja-2',
    course: 'jee-advanced',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    year: 2022,
    difficulty: 'Hard',
    questionUrl: 'pyq-jee-adv-coordination-2022.pdf',
    solutionUrl: 'sol-jee-adv-coordination-2022.pdf',
    questionSize: '390 KB',
    solutionSize: '1.4 MB'
  }
];

export const INITIAL_PRACTICE_SHEETS: PracticeSheet[] = [
  // JEE Main
  {
    id: 'ps-jm-1',
    course: 'jee-main',
    subject: 'Physical Chemistry',
    chapter: 'Electrostatics',
    title: 'Electrostatic Potential and Capacitors Drill',
    description: '45 targeted multiple-choice questions on capacitor networks, dielectric insertions, and energy storage formulas.',
    fileUrl: 'ps-electrostatics-potentials.pdf',
    fileSize: '1.1 MB'
  },
  {
    id: 'ps-jm-2',
    course: 'jee-main',
    subject: 'Organic Chemistry',
    chapter: 'Reaction Mechanisms',
    title: 'Organic Reaction Mechanisms Challenge Sheet',
    description: 'Practice set focusing on SN1/SN2 selectivity, carbocation stability, and stereochemical outcomes.',
    fileUrl: 'ps-organic-mechanisms.pdf',
    fileSize: '950 KB'
  },

  // JEE Advanced
  {
    id: 'ps-ja-1',
    course: 'jee-advanced',
    subject: 'Inorganic Chemistry',
    chapter: 'Coordination Compounds',
    title: 'Coordination Chemistry Level-2 Practice',
    description: 'Multi-concept integer-type and paragraph problems on CFSE, spectrochemical series, and isomerism.',
    fileUrl: 'ps-coordination-adv.pdf',
    fileSize: '1.6 MB'
  }
];

export const INITIAL_DOUBTS: Doubt[] = [
  {
    id: 'doubt-1',
    name: 'Siddharth Sharma',
    email: 'siddharth.s@student.in',
    subject: 'JEE Advanced — Physical Chemistry',
    question: 'In chemical kinetics, how do we correctly apply the Arrhenius equation when comparing two reactions at different temperatures? Specifically, how does the frequency factor A change with temperature?',
    attachmentName: 'kinetics-diagram.jpg',
    answerText: 'Excellent question, Siddharth. The frequency factor A is usually treated as temperature-independent in elementary analyses, but at a deeper level it contains a pre-exponential entropic term. For two reactions: use ln(k₂/k₁) = (Eₐ/R)(1/T₁ − 1/T₂) when A is constant. I have uploaded a comprehensive derivation under the Physical Chemistry Notes section.',
    isAnswered: true,
    createdAt: '2026-07-07T14:30:00Z'
  },
  {
    id: 'doubt-2',
    name: 'Aditi Patel',
    email: 'aditi.patel@gmail.com',
    subject: 'JEE Main — Organic Chemistry',
    question: "How do we predict the major product in a Diels–Alder reaction when the diene isn't symmetric? Do we use FMO or resonance arguments?",
    isAnswered: false,
    createdAt: '2026-07-08T09:15:00Z'
  },
  {
    id: 'doubt-3',
    name: 'Rohan Deshmukh',
    email: 'rohan.d@netprep.org',
    subject: 'CSIR NET — Inorganic Chemistry',
    question: 'In a complex [Co(NH₃)₄Cl₂]⁺, how do we determine which geometric isomer is more stable using Crystal Field Theory?',
    attachmentName: 'complex_geometry.pdf',
    answerText: 'For Rohan: 1) Draw both cis and trans isomers. 2) Calculate the CFSE contribution for each — in trans, the two Cl⁻ are opposite so their weak field effect is distributed differently. 3) Compare the overall stabilisation. Generally the cis isomer gains more CFSE due to stronger net ligand field from three NH₃ around each Co axis. A full vector-based treatment is in the Inorganic Chemistry notes.',
    isAnswered: true,
    createdAt: '2026-07-05T11:00:00Z'
  },
  {
    id: 'doubt-4',
    name: 'Meera Nair',
    email: 'meera.nair@neetacademy.com',
    subject: 'NEET — Physical Chemistry',
    question: 'Does buffer capacity change when we dilute a buffer? What happens to pH after dilution?',
    isAnswered: false,
    createdAt: '2026-07-08T18:45:00Z'
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'New JEE Advanced Coordination Chemistry notes are live',
    body: 'A fresh, rigorous set of notes on crystal field theory and geometric isomerism has just been added to the JEE Advanced Inorganic Chemistry section. Pair it with the Level-2 practice sheet for best results.',
    category: 'resource',
    pinned: true,
    createdAt: '2026-07-08T10:00:00Z'
  },
  {
    id: 'ann-2',
    title: 'Doubt-clearing window: every Sunday, 6–8 PM',
    body: 'From this week onwards, submitted doubts will be answered in a dedicated Sunday evening session. Post your questions before Saturday night to have them addressed first.',
    category: 'schedule',
    pinned: false,
    createdAt: '2026-07-06T09:30:00Z'
  },
  {
    id: 'ann-3',
    title: 'CSIR NET aspirants: revised Physical Chemistry roadmap',
    body: 'The quantum chemistry sequence has been reordered for a smoother build-up. Start from the Schrödinger equation note before attempting the spectroscopy problems.',
    category: 'exam',
    pinned: false,
    createdAt: '2026-07-02T14:15:00Z'
  }
];

export const INITIAL_FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'Are all resources on this website free to access?',
    answer: 'Yes. All material uploaded here — lecture notes, previous year solutions, practice worksheets, and reference guides — is entirely free. This portal is maintained solely as an academic repository to support self-study and learning.',
    category: 'general'
  },
  {
    id: 'faq-2',
    question: 'How often are the learning materials updated?',
    answer: 'Notes and practice sheets are added or revised in accordance with ongoing academic cycles, typically aligning with major semester schedules and upcoming national examination calendars.',
    category: 'general'
  },
  {
    id: 'faq-3',
    question: 'Can I submit questions or doubts for topics not listed in the exams?',
    answer: 'While you can submit academic doubts via the Doubt submission tab, priority is given to students preparing for the main syllabus categories: JEE Main, JEE Advanced, NEET Chemistry, CSIR NET, and M.Sc Entrance exams.',
    category: 'doubts'
  },
  {
    id: 'faq-4',
    question: 'How do I download the PDF sheets or lecture guides?',
    answer: 'Simply click the "Download" button on any resource card. It will download the selected PDF directly to your device. There are no logins, subscriptions, or paywalls.',
    category: 'notes'
  },
  {
    id: 'faq-5',
    question: 'Are these materials enough for self-preparation?',
    answer: 'These materials are curated to build rigorous conceptual foundations and advanced problem-solving skills. They serve as a powerful companion resource. Consistency, structured problem practice, and active revision remain vital for top academic outcomes.',
    category: 'general'
  }
];

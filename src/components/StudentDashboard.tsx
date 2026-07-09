/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef, useCallback } from 'react';
import {
  Search,
  Filter,
  ArrowLeft,
  FileText,
  Video as VideoIcon,
  HelpCircle,
  FolderOpen,
  Download,
  Eye,
  ChevronDown,
  ChevronUp,
  Send,
  FileSpreadsheet,
  Award,
  Compass,
  Activity,
  BookOpen,
  GraduationCap,
  ArrowRight
} from 'lucide-react';
import { ExamType, ExamInfo, Note, Video, PYQ, PracticeSheet, Doubt, FAQ, Announcement } from '../types';
import { FileUpload } from './FileUpload';
import { uploadDoubtAttachment } from '../services/doubtsService';
import { VideoWatchModal } from './VideoWatchModal';
import { extractYouTubeId, getYoutubeThumbnail } from '../lib/youtube';
import { PDFViewer } from './pdf/PDFViewer';
import type { PDFDocumentInfo } from './pdf/PDFContext';
import { PremiumCard } from './PremiumCard';

// ─── Card thumbnail helper (maxresdefault → hqdefault fallback) ───────────────
function CardThumbnail({
  src,
  alt,
  fallbackId,
}: {
  src: string;
  alt: string;
  fallbackId: string | null;
}) {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [errored, setErrored] = React.useState(false);

  React.useEffect(() => {
    setImgSrc(src);
    setErrored(false);
  }, [src]);

  const handleError = () => {
    if (!errored && fallbackId && imgSrc.includes('maxresdefault')) {
      setImgSrc(getYoutubeThumbnail(fallbackId, 'hqdefault'));
      setErrored(true);
    }
  };

  if (!imgSrc) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#0f0f0f]">
        <VideoIcon size={24} className="text-white/20" />
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
    />
  );
}

interface StudentDashboardProps {

  exams: ExamInfo[];
  notes: Note[];
  videos: Video[];
  pyqs: PYQ[];
  practiceSheets: PracticeSheet[];
  doubts: Doubt[];
  faqs: FAQ[];
  announcements: Announcement[];
  onAddDoubt: (doubt: Omit<Doubt, 'id' | 'isAnswered' | 'createdAt'>) => void;
  onIncrementNoteDownload: (id: string) => void;
}

export default function StudentDashboard({
  exams,
  notes,
  videos,
  pyqs,
  practiceSheets,
  doubts,
  faqs,
  announcements,
  onAddDoubt,
  onIncrementNoteDownload
}: StudentDashboardProps) {
  // Navigation States within student portal
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [activeCategory, setActiveCategory] = useState<'notes' | 'videos' | 'pyqs' | 'sheets' | 'doubts' | 'resources' | null>(null);

  // Filter/Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedYear, setSelectedYear] = useState<string>('All');

  // Interactive Overlays
  const [activeVideoModal, setActiveVideoModal] = useState<Video | null>(null);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  // In-app PDF viewer
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentInfo | null>(null);
  const openPDF = useCallback((info: PDFDocumentInfo) => setPdfDoc(info), []);

  // Doubt Form State
  const [doubtForm, setDoubtForm] = useState({
    name: '',
    email: '',
    subject: '',
    question: '',
  });
  const [doubtFile, setDoubtFile] = useState<File | null>(null);
  const [doubtSubmitted, setDoubtSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dynamic Lucide helper mapping for Exam Icons
  const renderExamIcon = (iconName: string) => {
    switch (iconName) {
      case 'Compass': return <Compass className="h-6 w-6 text-blue-500" />;
      case 'Award': return <Award className="h-6 w-6 text-indigo-500" />;
      case 'Activity': return <Activity className="h-6 w-6 text-emerald-500" />;
      case 'BookOpen': return <BookOpen className="h-6 w-6 text-teal-500" />;
      case 'GraduationCap': return <GraduationCap className="h-6 w-6 text-purple-500" />;
      default: return <BookOpen className="h-6 w-6 text-blue-500" />;
    }
  };

  const currentExamInfo = useMemo(() => {
    return exams.find(e => e.id === selectedExam);
  }, [exams, selectedExam]);

  // RESET state on nav back
  const handleBackToExams = () => {
    setSelectedExam(null);
    setActiveCategory(null);
    setSearchQuery('');
    setSelectedSubject('All');
  };

  const handleBackToCategories = () => {
    setActiveCategory(null);
    setSearchQuery('');
    setSelectedSubject('All');
  };

  // SUBJECT filters dynamically computed based on active contents
  const availableSubjects = useMemo(() => {
    if (!selectedExam) return ['All'];
    let list: string[] = [];
    if (activeCategory === 'notes') {
      list = notes.filter(n => n.course === selectedExam).map(n => n.subject);
    } else if (activeCategory === 'videos') {
      list = videos.filter(v => v.course === selectedExam).map(v => v.subject);
    } else if (activeCategory === 'pyqs') {
      list = pyqs.filter(p => p.course === selectedExam).map(p => p.subject);
    } else if (activeCategory === 'sheets') {
      list = practiceSheets.filter(p => p.course === selectedExam).map(p => p.subject);
    }
    return ['All', ...Array.from(new Set(list))];
  }, [selectedExam, activeCategory, notes, videos, pyqs, practiceSheets]);

  // Dynamic filtering algorithms
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      if (note.course !== selectedExam) return false;
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            note.chapter.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            note.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || note.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [notes, selectedExam, searchQuery, selectedSubject]);

  const filteredVideos = useMemo(() => {
    return videos.filter(vid => {
      if (vid.course !== selectedExam) return false;
      const matchesSearch = vid.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            vid.chapter.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            vid.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || vid.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [videos, selectedExam, searchQuery, selectedSubject]);

  const filteredPyqs = useMemo(() => {
    return pyqs.filter(pyq => {
      if (pyq.course !== selectedExam) return false;
      const matchesSearch = pyq.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || pyq.subject === selectedSubject;
      const matchesDifficulty = selectedDifficulty === 'All' || pyq.difficulty === selectedDifficulty;
      const matchesYear = selectedYear === 'All' || pyq.year.toString() === selectedYear;
      return matchesSearch && matchesSubject && matchesDifficulty && matchesYear;
    });
  }, [pyqs, selectedExam, searchQuery, selectedSubject, selectedDifficulty, selectedYear]);

  const filteredSheets = useMemo(() => {
    return practiceSheets.filter(sheet => {
      if (sheet.course !== selectedExam) return false;
      const matchesSearch = sheet.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            sheet.chapter.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'All' || sheet.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  }, [practiceSheets, selectedExam, searchQuery, selectedSubject]);

  // Handle Doubt Submission
  const handleDoubtSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doubtForm.name || !doubtForm.email || !doubtForm.question) return;

    setIsSubmitting(true);
    try {
      let finalAttachmentName = undefined;
      let finalAttachmentUrl = undefined;
      
      if (doubtFile) {
        const res = await uploadDoubtAttachment(doubtFile);
        finalAttachmentName = res.name;
        finalAttachmentUrl = res.url;
      }

      onAddDoubt({
        name: doubtForm.name,
        email: doubtForm.email,
        subject: doubtForm.subject || `${currentExamInfo?.title || ''} - General Query`,
        question: doubtForm.question,
        attachmentName: finalAttachmentName,
        attachmentUrl: finalAttachmentUrl,
      });

      setDoubtSubmitted(true);
      setDoubtForm({
        name: '',
        email: '',
        subject: '',
        question: '',
      });
      setDoubtFile(null);

      setTimeout(() => {
        setDoubtSubmitted(false);
      }, 6000);
    } catch (err: any) {
      console.error('Error uploading doubt attachment:', err);
      let errMsg = err.message || 'Unknown error occurred.';
      if (errMsg.includes('row-level security policy') || errMsg.includes('RLS')) errMsg = 'Storage policy rejected upload.';
      alert(`Doubt submission failed: ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadFile = (noteId: string, fileUrl: string) => {
    onIncrementNoteDownload(noteId);
    // Trigger browser download
    const a = document.createElement('a');
    a.href = fileUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = '';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-[#F7F3EC] py-12 transition-colors duration-300 text-[#22201F]">
      {/* ─── In-app PDF Viewer overlay ─── */}
      {pdfDoc && <PDFViewer docInfo={pdfDoc} onClose={() => setPdfDoc(null)} />}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* ================= READ-ONLY NOTICES STRIP ================= */}
        {!selectedExam && announcements.length > 0 && (
          <PremiumCard
            padding="medium"
            className="mb-8 overflow-hidden bg-gradient-to-r from-[#4A0E1B]/8 to-[#7C2532]/5 border-[#D9C2A2]/30 relative"
          >
            <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#4A0E1B]" />
            <div className="flex items-center space-x-3 mb-3">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A13B]/10 text-[#4A0E1B]">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
              </span>
              <h3 className="font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#4A0E1B]">
                Professor Announcements
              </h3>
            </div>
            <div className="space-y-3">
              {[...announcements].sort((a, b) => {
                if (a.pinned && !b.pinned) return -1;
                if (!a.pinned && b.pinned) return 1;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
              }).slice(0, 3).map(ann => (
                <PremiumCard
                  key={ann.id}
                  padding="small"
                  className="flex items-start space-x-2 rounded-xl"
                >
                  {ann.pinned && (
                    <span className="mt-0.5 text-[#C9A13B] shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11V5.5C16 3.567 14.433 2 12.5 2C10.567 2 9 3.567 9 5.5V11L7 13V15H11V21L12.5 23L14 21V15H18V13L16 11Z"/></svg>
                    </span>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-[#22201F] text-[13px]">{ann.title}</p>
                    <p className="mt-1 text-[#22201F]/60 text-xs leading-relaxed">{ann.body}</p>
                    <div className="mt-2 flex items-center text-[10px] font-bold text-[#22201F]/60 space-x-3">
                      <span className="bg-[#F7F3EC] px-2 py-0.5 rounded-full border border-[#D9C2A2]/30">{new Date(ann.createdAt).toLocaleDateString()}</span>
                      {ann.category !== 'general' && <span className="bg-[#C9A13B]/15 text-[#4A0E1B] px-2 py-0.5 rounded-full capitalize">{ann.category}</span>}
                    </div>
                  </div>
                </PremiumCard>
              ))}
            </div>
          </PremiumCard>
        )}

        {/* ================= BREADCRUMBS ================= */}
        {(selectedExam || activeCategory) && (
          <nav className="mb-6 flex flex-wrap items-center space-x-2 text-[0.85rem] font-medium text-[#22201F]/60">
            <button onClick={handleBackToExams} className="hover:text-[#4A0E1B]">Library</button>
            {selectedExam && (
              <>
                <span>/</span>
                <button onClick={handleBackToCategories} className={`hover:text-[#4A0E1B] ${!activeCategory ? 'text-[#4A0E1B] font-semibold' : ''}`}>
                  {currentExamInfo?.title}
                </button>
              </>
            )}
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-[#4A0E1B] font-semibold capitalize">
                  {activeCategory}
                </span>
              </>
            )}
          </nav>
        )}

        {/* ================= STEP 1: EXAM SELECTION ================= */}
        {!selectedExam && (
          <div>
            <div className="text-center mb-12">
              <p className="font-sans text-[9px] uppercase tracking-[0.2em] font-bold text-[#C9A13B]">
                Course Repositories
              </p>
              <h2 className="mt-2 text-3xl font-serif font-extrabold tracking-tight text-[#22201F] sm:text-4xl">
                Choose Your Examination
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-[#22201F]/60">
                Select your academic category below to unlock a highly organized directory of learning materials.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {exams.map((exam) => {
                const getEmoji = (id: string) => {
                  switch(id) {
                    case 'jee-main': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Alembic.png';
                    case 'jee-advanced': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Test%20Tube.png';
                    case 'neet': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Stethoscope.png';
                    case 'net': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Microscope.png';
                    case 'msc-entrance': return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Graduation%20Cap.png';
                    default: return 'https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Books.png';
                  }
                };
                
                return (
                  <PremiumCard
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    interactive
                    accentLine
                    id={`exam-card-${exam.id}`}
                  >
                    <PremiumCard.Icon className="mb-6 w-16 h-16 rounded-xl transition-transform duration-300 group-hover:scale-[1.03]">
                      <img src={getEmoji(exam.id)} alt={exam.title} className="h-10 w-10 object-contain drop-shadow-md" />
                    </PremiumCard.Icon>
                    
                    <PremiumCard.Title className="mb-3">
                      {exam.title}
                    </PremiumCard.Title>
                    <PremiumCard.Description className="line-clamp-3">
                      {exam.description}
                    </PremiumCard.Description>
                    
                    <div className="relative mt-8 flex items-center space-x-2 text-[9px] uppercase tracking-[0.2em] font-bold text-[#4A0E1B] opacity-0 transition-all duration-250 group-hover:opacity-100 group-hover:translate-x-1">
                      <span>Explore Course</span>
                      <ArrowRight size={14} />
                    </div>
                  </PremiumCard>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: CATEGORY DASHBOARD ================= */}
        {selectedExam && !activeCategory && (
          <div>
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-[#D9C2A2]/30 pb-8 mb-10">
              <div className="space-y-1.5">
                <button
                  onClick={handleBackToExams}
                  className="inline-flex items-center space-x-1.5 text-[0.85rem] font-bold text-[#4A0E1B]/80 hover:text-[#4A0E1B]"
                  id="back-to-exams-btn"
                >
                  <ArrowLeft size={14} />
                  <span>Back to examinations</span>
                </button>
                <h2 className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#22201F]">
                  {currentExamInfo?.title} Library
                </h2>
                <p className="text-sm font-normal leading-relaxed text-[#22201F]/60">
                  {currentExamInfo?.description}
                        {/* Core Resource Categories */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Category 1: Notes */}
              <PremiumCard
                onClick={() => setActiveCategory('notes')}
                interactive
                padding="medium"
                id="cat-card-notes"
              >
                <PremiumCard.Icon>
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" alt="Notes" className="h-8 w-8 object-contain drop-shadow-md" />
                </PremiumCard.Icon>
                <PremiumCard.Title className="mt-4 text-[1rem]">Study Notes</PremiumCard.Title>
                <PremiumCard.Description className="mt-1.5 text-[0.9rem]">
                  Rigorous, chemical mechanism summaries and multi-concept chapter breakdowns.
                </PremiumCard.Description>
              </PremiumCard>

              {/* Category 2: Videos */}
              <PremiumCard
                onClick={() => setActiveCategory('videos')}
                interactive
                padding="medium"
                id="cat-card-videos"
              >
                <PremiumCard.Icon>
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Clapper%20Board.png" alt="Videos" className="h-8 w-8 object-contain drop-shadow-md" />
                </PremiumCard.Icon>
                <PremiumCard.Title className="mt-4 text-[1rem]">Video Lectures</PremiumCard.Title>
                <PremiumCard.Description className="mt-1.5 text-[0.9rem]">
                  Conceptual video recordings exploring complex chemical and numerical formulations.
                </PremiumCard.Description>
              </PremiumCard>

              {/* Category 3: PYQs */}
              <PremiumCard
                onClick={() => setActiveCategory('pyqs')}
                interactive
                padding="medium"
                id="cat-card-pyqs"
              >
                <PremiumCard.Icon>
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Page%20Facing%20Up.png" alt="PYQs" className="h-8 w-8 object-contain drop-shadow-md" />
                </PremiumCard.Icon>
                <PremiumCard.Title className="mt-4 text-[1rem]">Previous Year Questions</PremiumCard.Title>
                <PremiumCard.Description className="mt-1.5 text-[0.9rem]">
                  Original exam questions alongside comprehensive step-by-step analytical solutions.
                </PremiumCard.Description>
              </PremiumCard>

              {/* Category 4: Practice Sheets */}
              <PremiumCard
                onClick={() => setActiveCategory('sheets')}
                interactive
                padding="medium"
                id="cat-card-sheets"
              >
                <PremiumCard.Icon>
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Memo.png" alt="Practice Sheets" className="h-8 w-8 object-contain drop-shadow-md" />
                </PremiumCard.Icon>
                <PremiumCard.Title className="mt-4 text-[1rem]">Practice Sheets</PremiumCard.Title>
                <PremiumCard.Description className="mt-1.5 text-[0.9rem]">
                  Selected chapter drills categorized by complexity levels to expand chemical proficiency.
                </PremiumCard.Description>
              </PremiumCard>

              {/* Category 5: Doubts */}
              <PremiumCard
                onClick={() => setActiveCategory('doubts')}
                interactive
                padding="medium"
                id="cat-card-doubts"
              >
                <PremiumCard.Icon>
                  <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Light%20Bulb.png" alt="Doubts" className="h-8 w-8 object-contain drop-shadow-md" />
                </PremiumCard.Icon>
                <PremiumCard.Title className="mt-4 text-[1rem]">Doubts Submission</PremiumCard.Title>
                <PremiumCard.Description className="mt-1.5 text-[0.9rem]">
                  Ask a direct academic question and browse frequently answered conceptual sheets.
                </PremiumCard.Description>
              </PremiumCard>
            </div>     </p>
              </div>

            </div>
          </div>
        )}

        {/* ================= STEP 3: SUB-RESOURCE PAGES ================= */}
        
        {/* NOTES EXPLORER */}
        {selectedExam && activeCategory === 'notes' && (
          <div>
            {/* Header with Search and Filter */}
            <div className="flex flex-col space-y-4 border-b border-[#D9C2A2]/30 pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-bold text-[#4A0E1B]/80 hover:text-[#4A0E1B]">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#22201F]/60">{currentExamInfo?.title} • Study Notes</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#22201F]/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search notes by title, chapter or concepts..."
                    className="w-full rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2.5 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-[#22201F]/60" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2.5 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* List */}
            {filteredNotes.length === 0 ? (
              <PremiumCard className="text-center py-12 border-dashed border-[#D9C2A2]/50">
                <p className="text-sm text-[#22201F]/60">No study notes found matching your filters.</p>
              </PremiumCard>
            ) : (
              <div className="space-y-8">
                {/* Organize by Subject then Chapter */}
                {Array.from(new Set(filteredNotes.map(n => n.subject))).map((subj) => (
                  <div key={subj} className="space-y-4">
                    <h3 className="border-b border-[#D9C2A2]/30 pb-2 text-lg font-bold font-serif text-[#22201F]">
                      {subj}
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2">
                      {filteredNotes.filter(n => n.subject === subj).map((note) => (
                        <PremiumCard key={note.id} padding="large" accentLine>
                          <div className="flex items-start justify-between">
                            <PremiumCard.Icon className="w-10 h-10 rounded-lg">
                              <FileText size={18} />
                            </PremiumCard.Icon>
                            <span className="font-mono text-[9px] font-bold text-[#22201F]/60 uppercase">
                              {note.chapter}
                            </span>
                          </div>

                          <PremiumCard.Title as="h4" className="mt-4 text-sm">
                            {note.title}
                          </PremiumCard.Title>
                          <PremiumCard.Description className="mt-1 text-xs line-clamp-2">
                            {note.description}
                          </PremiumCard.Description>
                          
                          <PremiumCard.Footer>
                            <PremiumCard.Metadata className="font-mono text-[10px]">
                              {note.fileSize} • {note.downloadCount || 0} views
                            </PremiumCard.Metadata>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => note.fileUrl ? openPDF({ title: note.title, fileUrl: note.fileUrl, fileSize: note.fileSize, entityType: 'note', entityId: note.id }) : undefined}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D9C2A2]/60 bg-white hover:bg-[#F7F3EC] text-[#22201F] px-4 py-2 text-[11px] font-semibold transition-all hover:-translate-y-0.5 duration-200 shadow-sm"
                              >
                                <Eye size={12} />
                                <span>View</span>
                              </button>
                              <button
                                onClick={() => handleDownloadFile(note.id, note.fileUrl)}
                                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4A0E1B] hover:bg-[#7C2532] text-white px-4 py-2 text-[11px] font-bold transition-all shadow-[0_4px_12px_rgba(74,14,27,0.1)] hover:shadow-[0_6px_16px_rgba(74,14,27,0.18)] hover:-translate-y-0.5 duration-200 border border-transparent"
                              >
                                <Download size={12} />
                                <span>Download</span>
                              </button>
                            </div>
                          </PremiumCard.Footer>
                        </PremiumCard>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* LECTURES EXPLORER */}
        {selectedExam && activeCategory === 'videos' && (
          <div>
            <div className="flex flex-col space-y-4 border-b border-[#D9C2A2]/30 pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-bold text-[#4A0E1B]/80 hover:text-[#4A0E1B]">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#22201F]/60">{currentExamInfo?.title} • Video Lectures</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#22201F]/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search lectures..."
                    className="w-full rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2.5 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-[#22201F]/60" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2.5 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredVideos.length === 0 ? (
              <PremiumCard className="text-center py-12 border-dashed border-[#D9C2A2]/50">
                <p className="text-sm text-[#22201F]/60">No lecture recordings found matching your filters.</p>
              </PremiumCard>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredVideos.map((video) => {
                  const ytId = extractYouTubeId(video.youtubeLink);
                  const thumbSrc = ytId
                     ? getYoutubeThumbnail(ytId, 'maxresdefault')
                     : (video.thumbnail || '');
                  return (
                  <PremiumCard key={video.id} padding="none" accentLine>
                    {/* Thumbnail with YouTube auto-generated image */}
                    <div className="relative aspect-video w-full bg-[#0f0f0f] overflow-hidden">
                      <CardThumbnail src={thumbSrc} alt={video.title} fallbackId={ytId} />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-70 group-hover:opacity-100 transition-opacity">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-[#4A0E1B] shadow-soft-sm transform group-hover:scale-[1.05] transition-transform">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 ml-0.5">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                        {video.duration}
                      </span>
                    </div>

                    <div className="p-5 sm:p-6 md:p-8">
                      <div className="flex items-center justify-between">
                        <PremiumCard.Category>
                          {video.subject}
                        </PremiumCard.Category>
                        <span className="font-mono text-[9px] text-[#22201F]/60 uppercase">{video.chapter}</span>
                      </div>
                      <PremiumCard.Title as="h4" className="mt-3.5 text-sm">
                        {video.title}
                      </PremiumCard.Title>
                      <PremiumCard.Description className="mt-1 text-xs line-clamp-2">
                        {video.description}
                      </PremiumCard.Description>
                      
                      <button
                        onClick={() => setActiveVideoModal(video)}
                        className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E1B] hover:bg-[#7C2532] text-white py-2.5 text-xs font-bold transition-all shadow-[0_4px_12px_rgba(74,14,27,0.1)] hover:shadow-[0_6px_16px_rgba(74,14,27,0.18)] hover:-translate-y-0.5 duration-200 border border-transparent"
                      >
                        <VideoIcon size={13} />
                        <span>Watch Lecture</span>
                      </button>
                    </div>
                  </PremiumCard>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* PYQ EXPLORER */}
        {selectedExam && activeCategory === 'pyqs' && (
          <div>
            <div className="flex flex-col space-y-4 border-b border-[#D9C2A2]/30 pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-bold text-[#4A0E1B]/80 hover:text-[#4A0E1B]">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#22201F]/60">{currentExamInfo?.title} • PYQs</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <div className="relative sm:col-span-2">
                  <Search size={16} className="absolute left-3.5 top-3 text-[#22201F]/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by chapter..."
                    className="w-full rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                  />
                </div>
                <div>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-input border border-[#D9C2A2]/40 bg-white px-3.5 py-2 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject === 'All' ? 'All Subjects' : subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full appearance-none rounded-input border border-[#D9C2A2]/40 bg-white px-3.5 py-2 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10"
                  >
                    <option value="All">All Difficulties</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredPyqs.length === 0 ? (
              <PremiumCard className="text-center py-12 border-dashed border-[#D9C2A2]/50">
                <p className="text-sm text-[#22201F]/60">No PYQ booklets found matching your filters.</p>
              </PremiumCard>
            ) : (
              <PremiumCard padding="none" className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#D9C2A2]/30 bg-[#F7F3EC] font-mono text-[10px] uppercase tracking-wider text-[#22201F]/60">
                        <th className="px-6 py-4">Subject & Chapter</th>
                        <th className="px-6 py-4">Year</th>
                        <th className="px-6 py-4">Difficulty</th>
                        <th className="px-6 py-4 text-right">Question Paper</th>
                        <th className="px-6 py-4 text-right">Step Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#D9C2A2]/20">
                      {filteredPyqs.map((pyq) => (
                        <tr key={pyq.id} className="hover:bg-[#F7F3EC]/50 text-xs">
                          <td className="px-6 py-4">
                            <span className="font-semibold text-[#22201F]">{pyq.subject}</span>
                            <span className="block text-[#22201F]/60 text-[11px] mt-0.5">{pyq.chapter}</span>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-[#22201F]/60">{pyq.year}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-bold ${
                                pyq.difficulty === 'Easy' ? 'bg-[#C9A13B]/10 text-[#C9A13B]' :
                                pyq.difficulty === 'Medium' ? 'bg-[#D9C2A2]/30 text-[#4A0E1B]' :
                                'bg-[#4A0E1B]/8 text-[#4A0E1B]'
                              }`}>
                              {pyq.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1.5 justify-end">
                              <button
                                onClick={() => pyq.questionUrl ? openPDF({ title: `${pyq.chapter} · ${pyq.year} (Question)`, fileUrl: pyq.questionUrl, fileSize: pyq.questionSize, entityType: 'pyq', entityId: pyq.id }) : undefined}
                                className="p-1.5 text-[#22201F]/60 hover:text-[#4A0E1B]"
                                title="View question paper"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => { const a = document.createElement('a'); a.href = pyq.questionUrl; a.download = ''; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}
                                className="inline-flex items-center justify-center gap-1.5 bg-[#C9A13B]/10 text-[#4A0E1B] px-3 py-1.5 font-bold text-[10px] hover:bg-[#C9A13B]/20 rounded-full transition-colors border border-transparent"
                              >
                                <Download size={10} />
                                <span>Question ({pyq.questionSize})</span>
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex space-x-1.5 justify-end">
                              <button
                                onClick={() => pyq.solutionUrl ? openPDF({ title: `${pyq.chapter} · ${pyq.year} (Solution)`, fileUrl: pyq.solutionUrl, fileSize: pyq.solutionSize, entityType: 'pyq', entityId: pyq.id + '-sol' }) : undefined}
                                className="p-1.5 text-[#22201F]/60 hover:text-[#4A0E1B]"
                                title="View solution"
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => { const a = document.createElement('a'); a.href = pyq.solutionUrl; a.download = ''; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}
                                className="inline-flex items-center justify-center gap-1.5 bg-[#4A0E1B]/8 text-[#4A0E1B] px-3 py-1.5 font-bold text-[10px] hover:bg-[#4A0E1B]/15 rounded-full transition-colors border border-transparent"
                              >
                                <Download size={10} />
                                <span>Solution ({pyq.solutionSize})</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </PremiumCard>
            )}
          </div>
        )}

        {/* PRACTICE SHEETS */}
        {selectedExam && activeCategory === 'sheets' && (
          <div>
            <div className="flex flex-col space-y-4 border-b border-[#D9C2A2]/30 pb-6 mb-8">
              <div className="flex items-center justify-between">
                <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1.5 text-[0.85rem] font-bold text-[#4A0E1B]/80 hover:text-[#4A0E1B]">
                  <ArrowLeft size={14} />
                  <span>Back to Categories</span>
                </button>
                <span className="text-[0.85rem] font-medium text-[#22201F]/60">{currentExamInfo?.title} • Practice Sheets</span>
              </div>

              <div className="grid gap-4 md:grid-cols-12">
                <div className="relative md:col-span-8">
                  <Search size={16} className="absolute left-3.5 top-3.5 text-[#22201F]/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title or chapter..."
                    className="w-full rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2.5 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                  />
                </div>
                <div className="relative md:col-span-4">
                  <Filter size={14} className="absolute left-3.5 top-3.5 text-[#22201F]/60" />
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full appearance-none rounded-input border border-[#D9C2A2]/40 bg-white pl-10 pr-4 py-2.5 text-sm text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10"
                  >
                    {availableSubjects.map((subject) => (
                      <option key={subject} value={subject}>{subject} Only</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {filteredSheets.length === 0 ? (
              <PremiumCard className="text-center py-12 border-dashed border-[#D9C2A2]/50">
                <p className="text-sm text-[#22201F]/60">No practice drills found matching your filters.</p>
              </PremiumCard>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredSheets.map((sheet) => (
                  <PremiumCard key={sheet.id} padding="large" accentLine>
                    <div className="flex items-start justify-between">
                      <PremiumCard.Icon className="w-10 h-10 rounded-lg">
                        <FileText size={18} />
                      </PremiumCard.Icon>
                      <span className="font-mono text-[9px] font-bold text-[#22201F]/60 uppercase">
                        {sheet.chapter} • {sheet.subject}
                      </span>
                    </div>

                    <PremiumCard.Title as="h4" className="mt-4 text-sm">
                      {sheet.title}
                    </PremiumCard.Title>
                    <PremiumCard.Description className="mt-1 text-xs">
                      {sheet.description}
                    </PremiumCard.Description>
                    
                    <PremiumCard.Footer>
                      <PremiumCard.Metadata className="font-mono text-[10px]">
                        File size: {sheet.fileSize}
                      </PremiumCard.Metadata>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => sheet.fileUrl ? openPDF({ title: sheet.title, fileUrl: sheet.fileUrl, fileSize: sheet.fileSize, entityType: 'sheet', entityId: sheet.id }) : undefined}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D9C2A2]/60 bg-white hover:bg-[#F7F3EC] text-[#22201F] px-4 py-2 text-[11px] font-semibold transition-all hover:-translate-y-0.5 duration-200 shadow-sm"
                        >
                          <Eye size={12} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => { const a = document.createElement('a'); a.href = sheet.fileUrl; a.download = ''; a.target = '_blank'; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4A0E1B] hover:bg-[#7C2532] text-white px-4 py-2 text-[11px] font-bold transition-all shadow-[0_4px_12px_rgba(74,14,27,0.1)] hover:shadow-[0_6px_16px_rgba(74,14,27,0.18)] hover:-translate-y-0.5 duration-200 border border-transparent"
                        >
                          <Download size={12} />
                          <span>Download</span>
                        </button>
                      </div>
                    </PremiumCard.Footer>
                  </PremiumCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* DOUBT SUBMISSION PAGE */}
        {selectedExam && activeCategory === 'doubts' && (
          <div>
            <div className="flex items-center justify-between border-b border-[#D9C2A2]/30 pb-6 mb-8">
              <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-bold text-xs text-[#4A0E1B]/80 hover:text-[#4A0E1B]">
                <ArrowLeft size={12} />
                <span>Back to Categories</span>
              </button>
              <span className="font-mono text-xs text-[#22201F]/60 uppercase">{currentExamInfo?.title} • Doubt Clarification</span>
            </div>

            <div className="grid gap-10 lg:grid-cols-12">
              
              {/* Doubt Submission Form */}
              <div className="lg:col-span-7">
                <PremiumCard padding="large" accentLine>
                  <PremiumCard.Title className="mb-1.5">
                    Submit Academic Doubt
                  </PremiumCard.Title>
                  <PremiumCard.Description className="mb-6">
                    Explain your concept difficulty or problem blocker. Professor Ajesh Joe will review and provide step-by-step guidance.
                  </PremiumCard.Description>

                  {doubtSubmitted && (
                    <div className="mb-6 flex items-center space-x-2.5 rounded-xl bg-[#C9A13B]/10 px-4 py-3 text-xs text-[#4A0E1B] border border-[#C9A13B]/30 animate-fade-in shadow-soft-sm">
                      <span className="text-base font-bold text-[#C9A13B]">✓</span>
                      <span>Doubt submitted successfully. You can monitor its response under the Professor Dashboard or refresh this page.</span>
                    </div>
                  )}

                  <form onSubmit={handleDoubtSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="student-name" className="block text-[10px] font-bold text-[#22201F]/80 uppercase tracking-wider">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="student-name"
                          required
                          value={doubtForm.name}
                          onChange={(e) => setDoubtForm({ ...doubtForm, name: e.target.value })}
                          className="mt-1.5 block w-full rounded-input border border-[#D9C2A2]/40 bg-white px-3.5 py-2.5 text-xs text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                          placeholder="e.g. Siddharth"
                        />
                      </div>
                      <div>
                        <label htmlFor="student-email" className="block text-[10px] font-bold text-[#22201F]/80 uppercase tracking-wider">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="student-email"
                          required
                          value={doubtForm.email}
                          onChange={(e) => setDoubtForm({ ...doubtForm, email: e.target.value })}
                          className="mt-1.5 block w-full rounded-input border border-[#D9C2A2]/40 bg-white px-3.5 py-2.5 text-xs text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                          placeholder="e.g. sid@mail.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="doubt-subject" className="block text-[10px] font-bold text-[#22201F]/80 uppercase tracking-wider">
                        Subject & Topic (or Chapter)
                      </label>
                      <input
                        type="text"
                        id="doubt-subject"
                        required
                        value={doubtForm.subject}
                        onChange={(e) => setDoubtForm({ ...doubtForm, subject: e.target.value })}
                        className="mt-1.5 block w-full rounded-input border border-[#D9C2A2]/40 bg-white px-3.5 py-2.5 text-xs text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30"
                        placeholder={`e.g. ${currentExamInfo?.title} Physics - Rotational Dynamics`}
                      />
                    </div>

                    <div>
                      <label htmlFor="doubt-question" className="block text-[10px] font-bold text-[#22201F]/80 uppercase tracking-wider">
                        Your Question Details
                      </label>
                      <textarea
                        id="doubt-question"
                        required
                        rows={4}
                        value={doubtForm.question}
                        onChange={(e) => setDoubtForm({ ...doubtForm, question: e.target.value })}
                        className="mt-1.5 block w-full rounded-input border border-[#D9C2A2]/40 bg-white px-3.5 py-2.5 text-xs text-[#22201F] outline-none transition focus:border-[#4A0E1B]/50 focus:ring-4 focus:ring-[#C9A13B]/10 placeholder:text-[#22201F]/30 resize-none"
                        placeholder="State the numerical problem or concept blocker clearly..."
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-[#22201F]/80 uppercase tracking-wider mb-2">
                        Attachment (Optional)
                      </label>
                      <FileUpload
                        value={doubtFile}
                        onFileSelect={(f) => setDoubtFile(f)}
                        placeholder="Upload screenshot or PDF"
                        accept="image/*,.pdf"
                      />
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#4A0E1B] hover:bg-[#7C2532] text-white py-2.5 text-xs font-bold transition-all shadow-[0_4px_12px_rgba(74,14,27,0.1)] hover:shadow-[0_6px_16px_rgba(74,14,27,0.18)] hover:-translate-y-0.5 duration-200 border border-transparent disabled:opacity-70"
                        id="student-doubt-submit-btn"
                      >
                        <Send size={12} />
                        <span>{isSubmitting ? 'Submitting...' : 'Submit Academic Doubt'}</span>
                      </button>
                    </div>

                  </form>
                </PremiumCard>
              </div>

              {/* Accordion FAQ Area */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <h3 className="text-base font-bold font-serif text-[#22201F]">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-[#22201F]/60 mt-1">
                    Quick references regarding library downloads, syllabus revisions, and academic response timelines.
                  </p>
                </div>

                <div className="space-y-3">
                  {faqs.map((faq) => {
                    const isExpanded = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="rounded-xl border border-[#D9C2A2]/30 bg-white shadow-soft-sm overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                          className="w-full flex items-center justify-between px-4 py-3.5 text-left text-xs font-bold text-[#22201F] hover:bg-[#F7F3EC]"
                        >
                          <span>{faq.question}</span>
                          {isExpanded ? <ChevronUp size={14} className="text-[#4A0E1B]" /> : <ChevronDown size={14} className="text-[#4A0E1B]" />}
                        </button>
                        {isExpanded && (
                          <div className="border-t border-[#D9C2A2]/20 px-4 py-3 text-xs leading-relaxed text-[#22201F]/70 bg-white">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ADDITIONAL RESOURCES */}
        {selectedExam && activeCategory === 'resources' && (
          <div>
            <div className="flex items-center justify-between border-b border-[#D9C2A2]/30 pb-6 mb-8">
              <button onClick={handleBackToCategories} className="inline-flex items-center space-x-1 font-bold text-xs text-[#4A0E1B]/80 hover:text-[#4A0E1B]">
                <ArrowLeft size={12} />
                <span>Back to Categories</span>
              </button>
              <span className="font-mono text-xs text-[#22201F]/60 uppercase">{currentExamInfo?.title} • Additions</span>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              
              <PremiumCard padding="large" accentLine>
                <PremiumCard.Title as="h3" className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#C9A13B]" />
                  Syllabus Blueprints & Topic Weights
                </PremiumCard.Title>
                <PremiumCard.Description className="mt-2 text-xs">
                  A carefully mapped matrix detailing the chapter distribution, sub-topic weights, and relative question occurrence frequencies compiled from the past 10 years of entrance examinations.
                </PremiumCard.Description>
                <div className="mt-5 flex justify-end">
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#D9C2A2]/40 bg-white text-[#22201F] px-4 py-2 text-[11px] font-bold opacity-50 cursor-not-allowed"
                  >
                    <Download size={11} />
                    <span>Download Matrix (820 KB)</span>
                  </button>
                </div>
              </PremiumCard>

              <PremiumCard padding="large" accentLine>
                <PremiumCard.Title as="h3" className="text-sm flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#4A0E1B]" />
                  Formula & Fundamental Constant Sheets
                </PremiumCard.Title>
                <PremiumCard.Description className="mt-2 text-xs">
                  A rapid-revision pocket formula PDF covering electromagnetic vectors, rotational momentums, coordinate calculus limits, and key physical constants (Planck, Boltzmann, Speed of Light).
                </PremiumCard.Description>
                <div className="mt-5 flex justify-end">
                  <button
                    disabled
                    className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#4A0E1B]/8 text-[#4A0E1B] px-4 py-2 text-[11px] font-bold opacity-50 cursor-not-allowed"
                  >
                    <Download size={11} />
                    <span>Download Sheets (1.4 MB)</span>
                  </button>
                </div>
              </PremiumCard>

            </div>
          </div>
        )}

      </div>

      {/* ================= Premium YouTube Watch Modal ================= */}
      {activeVideoModal && (
        <VideoWatchModal
          video={activeVideoModal}
          playlist={filteredVideos}
          onClose={() => setActiveVideoModal(null)}
          onSelectVideo={(v) => setActiveVideoModal(v)}
        />
      )}



    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * AppNew.tsx — Primary application shell (routing + role management only).
 * All data state and CRUD handlers live in src/context/PortalDataContext.tsx.
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Hero from './components/Hero';
import SelectionPage from './components/SelectionPage';
import AboutPage from './components/AboutPage';
import ContactPage from './components/ContactPage';
import StudentDashboard from './components/StudentDashboard';
import ProfessorDashboard from './components/ProfessorDashboard';

import { EXAMS, INITIAL_FAQS } from './data';
import { usePortalData } from './context/PortalDataContext';

export function AppNew({ theme, toggleTheme }: { theme: string; toggleTheme: () => void }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [userRole, setUserRole] = useState<'student' | 'professor' | null>(() => {
    try {
      const saved = localStorage.getItem('prof_portal_user_role_v1');
      return saved ? (JSON.parse(saved) as any) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('prof_portal_user_role_v1', JSON.stringify(userRole));
    } catch (e) {
      console.warn(e);
    }
  }, [userRole]);

  // Derived current view for legacy Navbar / Footer
  let currentView: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact' = 'home';
  if (location.pathname.startsWith('/selection')) currentView = 'selection';
  else if (location.pathname.startsWith('/resources')) currentView = userRole === 'professor' ? 'professor' : 'student';
  else if (location.pathname.startsWith('/about')) currentView = 'about';
  else if (location.pathname.startsWith('/contact')) currentView = 'contact';

  const handleNavigate = (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => {
    switch (view) {
      case 'home': navigate('/'); break;
      case 'selection': navigate('/selection'); break;
      case 'student':
      case 'professor': navigate('/resources'); break;
      case 'about': navigate('/about'); break;
      case 'contact': navigate('/contact'); break;
    }
  };

  const handleSelectRole = (selected: 'student' | 'professor') => {
    setUserRole(selected);
    navigate('/resources');
  };

  // ─── Data from context ────────────────────────────────────────────────────
  const {
    notes, videos, pyqs, practiceSheets, doubts, announcements,
    loading, error, reload,
    handleAddNote, handleEditNote, handleDeleteNote, handleIncrementNoteDownload,
    handleAddVideo, handleEditVideo, handleDeleteVideo,
    handleAddPyq, handleEditPyq, handleDeletePyq,
    handleAddPracticeSheet, handleEditPracticeSheet, handleDeletePracticeSheet,
    handleAddDoubt, handleReplyDoubt, handleDeleteDoubt,
    handleAddAnnouncement, handleEditAnnouncement, handleDeleteAnnouncement, handleTogglePinAnnouncement,
  } = usePortalData();

  // ─── Loading / Error UI ───────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC] dark:bg-[#1A1817]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#4A0E1B] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#4A0E1B] dark:text-[#F4E7E5]">
            Loading Portal…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F3EC] dark:bg-[#1A1817] p-6">
        <div className="max-w-md text-center space-y-4">
          <p className="text-3xl">⚠️</p>
          <h2 className="text-lg font-black uppercase tracking-[0.2em] text-[#4A0E1B] dark:text-[#F4E7E5]">
            Failed to connect
          </h2>
          <p className="text-sm text-[#22201F] dark:text-[#F6F2EA]/80">{error}</p>
          <button
            onClick={reload}
            className="px-6 py-3 bg-[#4A0E1B] text-white text-xs font-black uppercase tracking-[0.2em] rounded-lg hover:bg-[#7C2532] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EC] dark:bg-[#1A1817] text-[#22201F] dark:text-[#F6F2EA] transition-colors duration-300">
      <Navbar
        theme={theme}
        toggleTheme={toggleTheme}
        currentView={currentView}
        onNavigate={handleNavigate}
        userRole={userRole}
        onRoleChange={setUserRole}
      />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Hero onGetStarted={() => handleNavigate('selection')} onNavigate={handleNavigate} />} />
          
          <Route path="/selection" element={<SelectionPage onSelectRole={handleSelectRole} />} />
          
          <Route path="/resources/*" element={
            !userRole ? <Navigate to="/selection" replace /> :
            userRole === 'student' ? (
              <StudentDashboard
                exams={EXAMS}
                notes={notes}
                videos={videos}
                pyqs={pyqs}
                practiceSheets={practiceSheets}
                doubts={doubts}
                faqs={INITIAL_FAQS}
                announcements={announcements}
                onAddDoubt={handleAddDoubt}
                onIncrementNoteDownload={handleIncrementNoteDownload}
              />
            ) : (
              <ProfessorDashboard
                exams={EXAMS}
                notes={notes}
                videos={videos}
                pyqs={pyqs}
                practiceSheets={practiceSheets}
                doubts={doubts}
                announcements={announcements}
                onAddNote={handleAddNote}
                onEditNote={handleEditNote}
                onDeleteNote={handleDeleteNote}
                onAddVideo={handleAddVideo}
                onEditVideo={handleEditVideo}
                onDeleteVideo={handleDeleteVideo}
                onAddPyq={handleAddPyq}
                onEditPyq={handleEditPyq}
                onDeletePyq={handleDeletePyq}
                onAddPracticeSheet={handleAddPracticeSheet}
                onEditPracticeSheet={handleEditPracticeSheet}
                onDeletePracticeSheet={handleDeletePracticeSheet}
                onReplyDoubt={handleReplyDoubt}
                onDeleteDoubt={handleDeleteDoubt}
                onAddAnnouncement={handleAddAnnouncement}
                onEditAnnouncement={handleEditAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
                onTogglePinAnnouncement={handleTogglePinAnnouncement}
              />
            )
          } />

          <Route path="/about" element={<AboutPage onNavigate={handleNavigate} />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer onNavigate={handleNavigate} userRole={userRole} />
    </div>
  );
}

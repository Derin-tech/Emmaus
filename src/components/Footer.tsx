/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GraduationCap } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'selection' | 'student' | 'professor' | 'about' | 'contact') => void;
  userRole: 'student' | 'professor' | null;
}

export default function Footer({ onNavigate, userRole }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const handleResourceClick = () => {
    if (userRole === 'student') {
      onNavigate('student');
    } else if (userRole === 'professor') {
      onNavigate('professor');
    } else {
      onNavigate('selection');
    }
  };

  return (
    <footer className="w-full border-t-2 border-gray-800 bg-[#1c1c1e] py-12 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center bg-[#111112] shadow-[inset_0_-2px_0_rgba(0,0,0,0.5)] rounded-lg">
              <img 
                src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Open%20Book.png" 
                alt="Footer Logo" 
                className="h-5 w-5 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
              />
            </div>
            <span className="font-display text-sm font-bold tracking-tight text-white">
              Prof. Ajesh Joe
            </span>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="text-[10px] uppercase tracking-[0.1em] font-black text-gray-400 hover:text-white transition-colors"
              id="footer-link-home"
            >
              Home
            </button>
            <button
              onClick={handleResourceClick}
              className="text-[10px] uppercase tracking-[0.1em] font-black text-gray-400 hover:text-white transition-colors"
              id="footer-link-resources"
            >
              Library Resources
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="text-[10px] uppercase tracking-[0.1em] font-black text-gray-400 hover:text-white transition-colors"
              id="footer-link-about"
            >
              About the Professor
            </button>
            <button
              onClick={() => onNavigate('contact')}
              className="text-[10px] uppercase tracking-[0.1em] font-black text-gray-400 hover:text-white transition-colors"
              id="footer-link-contact"
            >
              Contact Office
            </button>
          </div>

        </div>

        <div className="my-8 h-[2px] bg-gray-800" />

        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <p className="text-center text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 md:text-left max-w-xl leading-relaxed">
            © {currentYear} Prof. Ajesh Joe. All rights reserved. This repository is hosted solely as an open educational resource for university students and aspirants.
          </p>
          <div className="flex space-x-4">
            <span className="text-[9px] uppercase tracking-[0.2em] font-black text-[#F1E194] border-2 border-gray-800 bg-[#111112] px-3 py-1.5">
              Department of Chemistry
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}

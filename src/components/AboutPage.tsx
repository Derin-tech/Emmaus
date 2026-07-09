/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BookOpen, GraduationCap, MapPin, Building, Calendar, Mail } from 'lucide-react';

export default function AboutPage() {
  return (
    <section className="bg-[#F7F3EC] py-16 md:py-20 text-[#22201F]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Profile Card Header */}
        <div className="flex flex-col items-center gap-8 border-b border-[#D9C2A2]/30 pb-12  md:flex-row md:items-start">
          
          {/* Elegant Avatar / Professor Placeholder */}
          <div className="relative h-44 w-44 flex-shrink-0">
            <div className="absolute inset-0 translate-x-2 translate-y-2 bg-[#D9C2A2]/20 rounded-xl" />
            <div className="relative flex h-44 w-44 items-center justify-center rounded-xl border border-[#D9C2A2]/40 bg-white shadow-soft-sm">
              <svg viewBox="0 0 100 100" className="h-28 w-28 text-[#4A0E1B]" fill="currentColor">
                <path d="M50 20c8.28 0 15 6.72 15 15s-6.72 15-15 15-15-6.72-15-15 6.72-15 15-15zm0 35c16.57 0 30 9.4 30 21v4H20v-4c0-11.6 13.43-21 30-21z"/>
              </svg>
            </div>
            <div className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center bg-[#C9A13B] border border-[#C9A13B]/40 text-white rounded-lg shadow-soft-sm">
              <GraduationCap size={18} />
            </div>
          </div>

          {/* Academic Profile Basics */}
          <div className="flex flex-col space-y-4 text-center md:text-left">
            <div>
              <h2 className="text-3xl font-serif font-bold tracking-tight text-[#22201F]">
                Prof. Ajesh Joe
              </h2>
              <p className="mt-2 font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-[#C9A13B]">
                Senior Professor of Chemistry
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-y-2 gap-x-4 text-[10px] font-bold uppercase tracking-wider text-[#22201F]/60 md:justify-start">
              <span className="flex items-center gap-1.5 border border-[#D9C2A2]/30 bg-white px-2 py-1 rounded-lg">
                <Building size={12} className="text-[#4A0E1B]" />
                <span>Dept. of Chemistry</span>
              </span>
              <span className="flex items-center gap-1.5 border border-[#D9C2A2]/30 bg-white px-2 py-1 rounded-lg">
                <MapPin size={12} className="text-[#4A0E1B]" />
                <span>Science Block II, Office 402-B</span>
              </span>
            </div>

            <p className="text-sm leading-relaxed text-[#22201F]/70">
              Devoted to the study of quantum chemistry, molecular dynamics, and organic synthesis, offering structured, non-commercial self-learning systems for university students and aspirants.
            </p>
          </div>

        </div>

        {/* Biography Block */}
        <div className="mt-12 space-y-12">
          
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold tracking-tight text-[#22201F]">
              Biography
            </h3>
            <p className="text-sm leading-relaxed text-[#22201F]/70">
              Professor Ajesh Joe completed his Ph.D. in Chemistry from the Indian Institute of Science (IISc), followed by postdoctoral research at the University of Cambridge, UK. Over the last two decades, he has lectured in organic chemistry, physical chemistry, and advanced materials science. 
            </p>
            <p className="text-sm leading-relaxed text-[#22201F]/70">
              Recognizing the challenges students encounter in bridging foundational theories with high-difficulty problem structures, he started writing these unified note modules, previous year guides, and concept booklets to offer complete, open-access study resources for state and national-level scientific entrances.
            </p>
          </div>

          {/* Teaching Philosophy */}
          <div className="space-y-4">
            <h3 className="text-lg font-serif font-bold tracking-tight text-[#22201F]">
              Teaching Philosophy
            </h3>
            <div className="border-l-4 border-[#4A0E1B] bg-white p-5 rounded-r-xl border-y border-r border-[#D9C2A2]/30 shadow-soft-sm">
              <p className="italic text-sm leading-relaxed text-[#22201F]/80">
                "Academic excellence does not rely on memorizing reactions, but rather on developing deep physical intuition and chemical logic. A chemistry problem is simply a mechanism waiting to be written in the elegant language of electrons. Our role as educators is to teach students the grammar of that language, so they can write their own solutions."
              </p>
            </div>
          </div>

          {/* Grid of Interests and Experience */}
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Research Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold tracking-tight text-[#22201F]">
                Research Interests
              </h3>
              <ul className="space-y-3">
                {[
                  'Advanced Organic Synthesis & Reaction Mechanisms',
                  'Quantum Chemistry and Molecular Dynamics',
                  'Solid State Chemistry and Material Science',
                  'Spectroscopic Methods in Chemical Analysis'
                ].map((interest, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <div className="mt-1 flex h-4 w-4 flex-shrink-0 items-center justify-center border border-[#D9C2A2]/30 bg-white text-[#4A0E1B] rounded">
                      <BookOpen size={10} />
                    </div>
                    <span className="text-sm font-semibold text-[#22201F]/80">{interest}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academic Experience */}
            <div className="space-y-4">
              <h3 className="text-lg font-serif font-bold tracking-tight text-[#22201F]">
                Academic Experience
              </h3>
              <ul className="space-y-4 border-l border-[#D9C2A2]/30 ml-2 pl-4">
                {[
                  {
                    year: '2015 - Present',
                    title: 'Senior Professor of Chemistry',
                    place: 'University Science Department'
                  },
                  {
                    year: '2008 - 2015',
                    title: 'Associate Researcher',
                    place: 'National Chemical Laboratory'
                  },
                  {
                    year: '2005 - 2008',
                    title: 'Postdoctoral Fellow',
                    place: 'University of Cambridge, UK'
                  }
                ].map((exp, i) => (
                  <li key={i} className="relative">
                    <div className="absolute -left-[21px] top-1.5 h-2.5 w-2.5 border border-[#D9C2A2]/30 bg-[#4A0E1B] rounded-full" />
                    <span className="block font-sans text-[9px] uppercase tracking-wider font-bold text-[#C9A13B]">{exp.year}</span>
                    <span className="mt-1 block font-bold text-[#22201F]">{exp.title}</span>
                    <span className="mt-0.5 block text-xs text-[#22201F]/60">{exp.place}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * DifficultyChip — shared primitive UI component.
 * Renders a coloured pill chip indicating difficulty level.
 */

import React from 'react';

interface DifficultyChipProps {
  level: 'Easy' | 'Moderate' | 'Hard';
}

export function DifficultyChip({ level }: DifficultyChipProps) {
  const map: Record<'Easy' | 'Moderate' | 'Hard', string> = {
    Easy: 'bg-[#E8F5E9] text-[#2E7D32] border-[#C8E6C9]',
    Moderate: 'bg-[#FFF8E1] text-[#F57F17] border-[#FFECB3]',
    Hard: 'bg-[#FFEBEE] text-[#C62828] border-[#FFCDD2]',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold border ${map[level]}`}>
      {level}
    </span>
  );
}

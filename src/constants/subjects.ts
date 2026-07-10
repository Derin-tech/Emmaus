/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ─── SINGLE SOURCE OF TRUTH FOR CHEMISTRY SUBJECTS ───────────────────────────
 * Import SUBJECTS and SUBJECT_TYPE from this file everywhere:
 *   - Upload forms (admin)
 *   - Subject filters (student)
 *   - API/DB validation
 *   - Seed data
 *   - Statistics
 *   - Resource cards
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const SUBJECTS = [
  'Physical Chemistry',
  'Organic Chemistry',
  'Inorganic Chemistry',
] as const;

export type SubjectType = typeof SUBJECTS[number];

/**
 * Badge configuration per subject — colour palette uses the site's
 * warm maroon / gold / sand design system.
 */
export const SUBJECT_BADGE: Record<
  SubjectType,
  { emoji: string; bg: string; text: string; dot: string; label: string }
> = {
  'Physical Chemistry': {
    emoji: '🟡',
    bg: 'bg-[#F7EFD9]',
    text: 'text-[#8A6A16]',
    dot: 'bg-[#C9A13B]',
    label: 'Physical Chemistry',
  },
  'Organic Chemistry': {
    emoji: '🟢',
    bg: 'bg-[#E8F5E9]',
    text: 'text-[#2E7D32]',
    dot: 'bg-[#4CAF50]',
    label: 'Organic Chemistry',
  },
  'Inorganic Chemistry': {
    emoji: '🟣',
    bg: 'bg-[#EDE7F6]',
    text: 'text-[#512DA8]',
    dot: 'bg-[#7C4DFF]',
    label: 'Inorganic Chemistry',
  },
};

/** Default subject used when migrating unknown/legacy values */
export const DEFAULT_SUBJECT: SubjectType = 'Physical Chemistry';

/**
 * Maps any legacy subject string to a valid SubjectType.
 * All unknown values → DEFAULT_SUBJECT.
 */
export function normaliseSubject(raw: string): SubjectType {
  if ((SUBJECTS as readonly string[]).includes(raw)) {
    return raw as SubjectType;
  }
  return DEFAULT_SUBJECT;
}

"use client";

import { useState, useEffect } from 'react';
import { Listing } from '@/types';
import { addDays, subDays, addHours, addMinutes } from 'date-fns';

const STORAGE_KEY = 'emmaus_listings_v1';
const today = new Date();

export const initialMockListings: Listing[] = [
  {
    id: '1',
    userId: 'u1',
    category: 'Textbooks',
    status: 'Available',
    price: 450,
    title: 'Engineering Mathematics Vol 2',
    description: 'Barely used textbook for 2nd year engineering. No highlights or pen marks.',
    postedDate: subDays(today, 1).toISOString(),
    contactInfo: '+919876543210',
    condition: 'Like New',
    originalPrice: 800,
    discountPercentage: 43,
    collegeName: 'College of Engineering',
    sellerRating: 4.8,
    location: 'North Campus Library',
    verifiedSeller: true,
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    expiresAt: addHours(today, 12).toISOString()
  },
  {
    id: '2',
    userId: 'u2',
    category: 'Services',
    status: 'Available',
    price: 1000,
    title: 'Assignment & Project Help',
    description: 'I can help with coding assignments in React, Python, and Java. Price varies by complexity.',
    postedDate: subDays(today, 0).toISOString(),
    contactInfo: 'whatsapp: 9876543211',
    sellerRating: 5.0,
    collegeName: 'College of Engineering',
    verifiedSeller: true,
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: '3',
    userId: 'u3',
    category: 'Gaming',
    status: 'Sold',
    price: 1500,
    title: 'Valorant Account - Diamond Rank',
    description: 'Selling my alt account. Contains a few premium skins including Prime Vandal.',
    postedDate: subDays(today, 3).toISOString(),
    contactInfo: 'student@college.edu',
    collegeName: 'Arts & Science College',
    sellerRating: 4.2,
    location: 'Hostel Block C',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jack'
  },
  {
    id: '4',
    userId: 'u4',
    category: 'Accessories',
    status: 'Available',
    price: 800,
    title: 'Boat Rockerz Wireless Headphones',
    description: 'Good condition, battery lasts about 12 hours. Upgraded to airpods so selling these.',
    postedDate: subDays(today, 0).toISOString(),
    contactInfo: '9988776655',
    condition: 'Good',
    originalPrice: 1500,
    discountPercentage: 46,
    collegeName: 'Medical College',
    sellerRating: 4.5,
    location: 'South Gate Cafe',
    verifiedSeller: true,
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    expiresAt: addMinutes(today, 45).toISOString()
  },
  {
    id: '5',
    userId: 'u1',
    category: 'Requests',
    status: 'Available',
    price: 0,
    title: 'Looking for Lab Coat (Size M)',
    description: 'Need a medium sized lab coat for chemistry practicals. Willing to pay up to ₹200.',
    postedDate: subDays(today, 2).toISOString(),
    contactInfo: '+919876543210',
    collegeName: 'Medical College',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max'
  },
  {
    id: '6',
    userId: 'u5',
    category: 'Services',
    status: 'Available',
    price: 500,
    title: 'Presentation Design (PPT)',
    description: 'I will design professional, aesthetic PowerPoint presentations for your assignments and seminars.',
    postedDate: subDays(today, 1).toISOString(),
    contactInfo: 'whatsapp: 9876543212',
    sellerRating: 4.9,
    verifiedSeller: true,
    collegeName: 'Design Institute',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma'
  },
  {
    id: '7',
    userId: 'u6',
    category: 'Textbooks',
    status: 'Available',
    price: 600,
    title: 'Gray\'s Anatomy for Students',
    description: 'Third edition. Some highlights in the first two chapters, otherwise excellent condition.',
    postedDate: subDays(today, 4).toISOString(),
    contactInfo: '9988771122',
    condition: 'Good',
    originalPrice: 1200,
    discountPercentage: 50,
    collegeName: 'Medical College',
    sellerRating: 4.7,
    verifiedSeller: true,
    location: 'Main Library',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    expiresAt: addHours(today, 2).toISOString()
  },
  {
    id: '8',
    userId: 'u7',
    category: 'Accessories',
    status: 'Pending',
    price: 2500,
    title: 'Casio fx-991EX Scientific Calculator',
    description: 'Original classwiz scientific calculator. Essential for engineering exams. Used for 1 semester.',
    postedDate: subDays(today, 1).toISOString(),
    contactInfo: '+919876543215',
    condition: 'Like New',
    originalPrice: 2900,
    discountPercentage: 13,
    collegeName: 'College of Engineering',
    sellerRating: 5.0,
    verifiedSeller: true,
    location: 'CS Department',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah'
  },
  {
    id: '9',
    userId: 'u8',
    category: 'Gaming',
    status: 'Available',
    price: 4000,
    title: 'Elden Ring - PS5 Disc',
    description: 'Finished the game, looking to sell. Disc and case are in perfect condition without scratches.',
    postedDate: subDays(today, 0).toISOString(),
    contactInfo: 'whatsapp: 9876543218',
    condition: 'Like New',
    originalPrice: 5000,
    discountPercentage: 20,
    collegeName: 'Arts & Science College',
    sellerRating: 4.6,
    location: 'Hostel Block A',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    expiresAt: addHours(today, 22).toISOString()
  },
  {
    id: '10',
    userId: 'u9',
    category: 'Services',
    status: 'Available',
    price: 300,
    title: 'Math Tutoring (Calculus)',
    description: 'Scored 9.8 CGPA. Offering tutoring for 1st-year engineering mathematics.',
    postedDate: subDays(today, 5).toISOString(),
    contactInfo: 'whatsapp: 9876543219',
    sellerRating: 4.9,
    verifiedSeller: true,
    collegeName: 'College of Engineering',
    sellerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia'
  }
];

export const mockListings = initialMockListings;

export function getListingsFromStorage(): Listing[] {
  if (typeof window === 'undefined') return initialMockListings;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockListings));
    return initialMockListings;
  } catch (e) {
    return initialMockListings;
  }
}

export function addListingToStorage(newListing: Listing) {
  if (typeof window === 'undefined') return;
  try {
    const current = getListingsFromStorage();
    const updated = [newListing, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save listing', e);
  }
}

export function updateListingInStorage(id: string, updates: Partial<Listing>) {
  if (typeof window === 'undefined') return;
  try {
    const current = getListingsFromStorage();
    const updated = current.map(item => item.id === id ? { ...item, ...updates } as Listing : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to update listing', e);
  }
}

export function deleteListingFromStorage(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const current = getListingsFromStorage();
    const updated = current.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to delete listing', e);
  }
}

export function useListings() {
  const [listings, setListings] = useState<Listing[]>(initialMockListings);

  useEffect(() => {
    setListings(getListingsFromStorage());
    
    const handleStorageChange = () => {
      setListings(getListingsFromStorage());
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('listings_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('listings_updated', handleStorageChange);
    };
  }, []);

  const addListing = (listing: Listing) => {
    addListingToStorage(listing);
    setListings(getListingsFromStorage());
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('listings_updated'));
  };

  const updateListing = (id: string, updates: Partial<Listing>) => {
    updateListingInStorage(id, updates);
    setListings(getListingsFromStorage());
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('listings_updated'));
  };

  const deleteListing = (id: string) => {
    deleteListingFromStorage(id);
    setListings(getListingsFromStorage());
    if (typeof window !== 'undefined') window.dispatchEvent(new Event('listings_updated'));
  };

  return { listings, addListing, updateListing, deleteListing };
}

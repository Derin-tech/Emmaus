"use client";

import { useState, useEffect } from 'react';
import { Listing } from '@/types';
import { addDays, subDays } from 'date-fns';

const STORAGE_KEY = 'emmaus_listings_v1';
const today = new Date();

export const initialMockListings: Listing[] = [
  {
    id: '1',
    userId: 'u1',
    category: 'Train',
    status: 'Available',
    price: 800,
    numberOfTickets: 1,
    postedDate: subDays(today, 1).toISOString(),
    contactInfo: '+91 98765 43210',
    trainNameOrNumber: 'Vande Bharat Express (22221)',
    fromStation: 'Mumbai (CSMT)',
    toStation: 'Pune (PUNE)',
    dateOfJourney: addDays(today, 2).toISOString(),
    departureTime: '16:00',
    arrivalTime: '19:10',
    travelClass: 'CC',
    pnrStatus: 'Confirmed',
  },
  {
    id: '2',
    userId: 'u2',
    category: 'Movies',
    status: 'Available',
    price: 300,
    numberOfTickets: 2,
    postedDate: subDays(today, 0).toISOString(),
    contactInfo: '9876543211',
    movieName: 'Oppenheimer',
    theatreName: 'PVR Phoenix Palladium',
    location: 'Mumbai',
    date: addDays(today, 1).toISOString(),
    showTiming: '20:30',
    seatNumbers: 'H12, H13',
  },
  {
    id: '3',
    userId: 'u3',
    category: 'Events',
    status: 'Sold',
    price: 1500,
    numberOfTickets: 4,
    postedDate: subDays(today, 3).toISOString(),
    contactInfo: '9876543212',
    eventName: 'Sunburn Arena',
    venue: 'Bandra Kurla Complex',
    date: addDays(today, 10).toISOString(),
    time: '18:00',
  },
  {
    id: '4',
    userId: 'u4',
    category: 'Bus',
    status: 'Available',
    price: 500,
    numberOfTickets: 1,
    postedDate: subDays(today, 0).toISOString(),
    contactInfo: '9988776655',
    busOperator: 'Neeta Travels',
    fromLocation: 'Pune',
    toLocation: 'Goa',
    dateOfJourney: addDays(today, 1).toISOString(),
    departureTime: '22:00',
    arrivalTime: '07:30',
    seatType: 'Sleeper AC',
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

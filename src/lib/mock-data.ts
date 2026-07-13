import { Listing } from '@/types';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockListings: Listing[] = [
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
    condition: 'Like New'
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
    contactInfo: 'whatsapp: 9876543211'
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
    condition: 'Good'
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
    contactInfo: '+919876543210'
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
    contactInfo: 'whatsapp: 9876543212'
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
    condition: 'Good'
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
    condition: 'Like New'
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
    condition: 'Like New'
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
    contactInfo: 'whatsapp: 9876543219'
  }
];

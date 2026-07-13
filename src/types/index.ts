export type Category = 'Textbooks' | 'Accessories' | 'Gaming' | 'Services' | 'Requests' | 'Others' | 'Movies' | 'Train' | 'Bus' | 'Events';
export type Status = 'Available' | 'Pending' | 'Sold';

export interface User {
  id: string;
  email: string; // must be @college.edu
  name: string;
}

export interface Listing {
  id: string;
  userId: string;
  category: Category;
  status: Status;
  price: number;
  title: string;
  description: string;
  images?: string[];
  postedDate: string;
  contactInfo: string;
  condition?: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
}

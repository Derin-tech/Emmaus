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
  originalPrice?: number;
  discountPercentage?: number;
  collegeName?: string;
  sellerRating?: number;
  location?: string;
  verifiedSeller?: boolean;
  sellerAvatar?: string;
  expiresAt?: string;
  // Category specific ticket fields
  movieName?: string;
  theatreName?: string;
  trainNameOrNumber?: string;
  fromStation?: string;
  toStation?: string;
  busOperator?: string;
  fromLocation?: string;
  toLocation?: string;
  eventName?: string;
  venue?: string;
  date?: string;
  time?: string;
  dateOfJourney?: string;
  departureTime?: string;
  arrivalTime?: string;
  travelClass?: string;
  pnrStatus?: string;
  seatNumbers?: string;
  screen?: string;
  seatType?: string;
  showTiming?: string;
  numberOfTickets?: number;
}

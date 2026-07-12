export type Category = 'Movies' | 'Train' | 'Bus' | 'Events' | 'Others';
export type Status = 'Available' | 'Sold' | 'Expired';

export interface User {
  id: string;
  email: string; // must be @college.edu
  name: string;
}

export interface BaseListing {
  id: string;
  userId: string;
  category: Category;
  status: Status;
  price: number;
  numberOfTickets: number;
  postedDate: string;
  contactInfo: string;
}

export interface MovieListing extends BaseListing {
  category: 'Movies';
  movieName: string;
  theatreName: string;
  location: string;
  date: string;
  showTiming: string;
  seatNumbers: string;
  screen?: string;
}

export interface TrainListing extends BaseListing {
  category: 'Train';
  trainNameOrNumber: string;
  fromStation: string;
  toStation: string;
  dateOfJourney: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  pnrStatus?: string;
}

export interface BusListing extends BaseListing {
  category: 'Bus';
  busOperator: string;
  fromLocation: string;
  toLocation: string;
  dateOfJourney: string;
  departureTime: string;
  arrivalTime: string;
  seatType: string;
}

export interface EventListing extends BaseListing {
  category: 'Events';
  eventName: string;
  venue: string;
  date: string;
  time: string;
}

export interface OtherListing extends BaseListing {
  category: 'Others';
  title: string;
  description: string;
  date?: string;
}

export type Listing = MovieListing | TrainListing | BusListing | EventListing | OtherListing;

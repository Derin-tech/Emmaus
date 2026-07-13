"use client";

import { useListings } from "@/lib/mock-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Listing } from "@/types";
import ListingClientView from "./ListingClientView";

export default function ListingDetail() {
  const params = useParams();
  const id = params?.id as string;
  const { listings } = useListings();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (listings && listings.length > 0) {
      const found = listings.find(l => l.id === id);
      setListing(found || null);
      setIsLoaded(true);
    }
  }, [listings, id]);

  if (!isLoaded) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center text-gray-500 animate-pulse">
        Loading item details...
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-3xl mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Item Not Found</h2>
        <p className="mt-2 text-gray-500">This item may have been removed or does not exist.</p>
        <Link href="/browse" className="mt-6 inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
          <ArrowLeft size={16} /> Back to Browse
        </Link>
      </div>
    );
  }

  return <ListingClientView initialListing={listing} />;
}


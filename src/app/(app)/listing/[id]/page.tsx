import { mockListings } from "@/lib/mock-data";
import { notFound } from "next/navigation";
import ListingClientView from "./ListingClientView";

export default async function ListingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = mockListings.find(l => l.id === id);

  if (!listing) {
    notFound();
  }

  return <ListingClientView initialListing={listing} />;
}

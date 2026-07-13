"use client";

import { useEffect, useState } from "react";
import { db, hasFirebaseConfig } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy, Timestamp } from "firebase/firestore";
import { Film, Train, Bus, Calendar, Tag, Clock, ShieldCheck, RefreshCw, PlusCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface ExpiringTicket {
  id: string;
  title: string;
  type: string; // "movie" | "train" | "bus" | "event"
  price: number;
  sellerName: string;
  expiryTime: string; // ISO string
  isVerified: boolean;
  isExpired?: boolean;
  expiredAt?: number; // timestamp when expired
}

  const getMockTickets = (): ExpiringTicket[] => {
  const now = Date.now();
  return [
    {
      id: "mock-1",
      title: "Oppenheimer IMAX 3D - PVR Palladium",
      type: "movie",
      price: 350,
      sellerName: "Aarav Mehta",
      isVerified: true,
      expiryTime: new Date(now + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 hours left (Red, <3h)
    },
    {
      id: "mock-2",
      title: "Mumbai CSMT to Pune JN CC Class",
      type: "train",
      price: 450,
      sellerName: "Diya Sharma",
      isVerified: true,
      expiryTime: new Date(now + 5.5 * 60 * 60 * 1000).toISOString(), // 5.5 hours left (Orange, 3-12h)
    },
    {
      id: "mock-3",
      title: "Sunburn Arena Bandra Pass",
      type: "event",
      price: 2500,
      sellerName: "Kabir Singh",
      isVerified: false,
      expiryTime: new Date(now + 15 * 60 * 60 * 1000).toISOString(), // 15 hours left (Green, 12-24h)
    },
    {
      id: "mock-4",
      title: "Volvo Sleeper Bus Pune to Goa",
      type: "bus",
      price: 900,
      sellerName: "Ananya Iyer",
      isVerified: true,
      expiryTime: new Date(now + 23 * 60 * 60 * 1000).toISOString(), // 23 hours left (Green, 12-24h)
    },
    {
      id: "mock-5",
      title: "Fast-expiring Event Ticket (Demo)",
      type: "event",
      price: 150,
      sellerName: "Siddharth Sen",
      isVerified: true,
      expiryTime: new Date(now + 15 * 1000).toISOString(), // Expires in 15 seconds
    },
  ];
};

const filterTabs = [
  { id: "all", label: "All", icon: Tag },
  { id: "movie", label: "Movie", icon: Film },
  { id: "train", label: "Train", icon: Train },
  { id: "bus", label: "Bus", icon: Bus },
  { id: "event", label: "Event", icon: Calendar },
];

export default function ExpiringSoonPage() {
  const [tickets, setTickets] = useState<ExpiringTicket[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [isRealtime, setIsRealtime] = useState(hasFirebaseConfig);

  // Firestore Sync / Local Initialization
  useEffect(() => {
    if (!hasFirebaseConfig || !db) {
      // Initialize with Mock tickets
      setTickets(getMockTickets());
      setIsRealtime(false);
      return;
    }

    const now = new Date();
    const future24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const q = query(
      collection(db, "tickets"),
      where("expiryTime", ">=", Timestamp.fromDate(now)),
      where("expiryTime", "<=", Timestamp.fromDate(future24h)),
      orderBy("expiryTime", "asc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedDocs: ExpiringTicket[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          let expiryTimeStr = new Date().toISOString();
          if (data.expiryTime) {
            expiryTimeStr = data.expiryTime.toDate().toISOString();
          }
          return {
            id: doc.id,
            title: data.title || "Untitled Ticket",
            type: data.type || "other",
            price: data.price || 0,
            sellerName: data.sellerName || "Anonymous",
            expiryTime: expiryTimeStr,
            isVerified: data.isVerified ?? false,
          };
        });

        // Merge fetched documents with our state (keeping expiration local timer states intact)
        setTickets((prev) => {
          const nowMs = Date.now();
          const prevMap = new Map(prev.map((t) => [t.id, t]));

          const merged = fetchedDocs.map((doc) => {
            const existing = prevMap.get(doc.id);
            const expiryMs = new Date(doc.expiryTime).getTime();
            const isExpired = expiryMs - nowMs <= 0;

            return {
              ...doc,
              isExpired: existing ? existing.isExpired : isExpired,
              expiredAt: existing ? existing.expiredAt : (isExpired ? nowMs : undefined),
            };
          });

          // Sort by expiryTime ascending
          return merged.sort((a, b) => {
            if (a.isExpired && !b.isExpired) return 1;
            if (!a.isExpired && b.isExpired) return -1;
            return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
          });
        });
      },
      (error) => {
        console.error("Firestore error, falling back to mock data:", error);
        setTickets(getMockTickets());
        setIsRealtime(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Timer Tick Interval (1s)
  useEffect(() => {
    const timer = setInterval(() => {
      setTickets((prev) => {
        const nowMs = Date.now();

        return prev
          .map((t) => {
            const expiryMs = new Date(t.expiryTime).getTime();
            const diff = expiryMs - nowMs;
            if (diff <= 0 && !t.isExpired) {
              return { ...t, isExpired: true, expiredAt: nowMs };
            }
            return t;
          })
          .filter((t) => {
            // Keep expired tickets for exactly 2 seconds for visual fade animation
            if (t.isExpired && t.expiredAt) {
              return nowMs - t.expiredAt < 2000;
            }
            return true;
          })
          .sort((a, b) => {
            if (a.isExpired && !b.isExpired) return 1;
            if (!a.isExpired && b.isExpired) return -1;
            return new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime();
          });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Demo panel controls
  const handleResetMock = () => {
    setTickets(getMockTickets());
  };

  const handleAddMockTicket = (secondsLeft: number) => {
    const now = Date.now();
    const newTicket: ExpiringTicket = {
      id: `mock-custom-${now}`,
      title: `Urgent Ticket (expires in ${secondsLeft}s)`,
      type: ["movie", "train", "bus", "event"][Math.floor(Math.random() * 4)],
      price: Math.floor(Math.random() * 100) * 10 + 100,
      sellerName: "Test Seller",
      isVerified: Math.random() > 0.3,
      expiryTime: new Date(now + secondsLeft * 1000).toISOString(),
    };
    setTickets((prev) => [...prev, newTicket].sort((a, b) => 
      new Date(a.expiryTime).getTime() - new Date(b.expiryTime).getTime()
    ));
  };

  // Counting logic for Banner (excluding expired)
  const activeTicketsCount = tickets.filter((t) => !t.isExpired).length;

  // Filtered tickets
  const filteredTickets = tickets.filter(
    (t) => activeFilter === "all" || t.type.toLowerCase() === activeFilter.toLowerCase()
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Expiring Soon</h1>
            {!isRealtime && (
              <span className="rounded-full bg-amber-100 dark:bg-amber-950/40 px-2.5 py-0.5 text-xs font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-1">
                <AlertCircle size={12} />
                Demo Mode
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Last chance deals expiring in less than 24 hours. Act fast!
          </p>
        </div>
      </div>

      {/* Demo Controls (Only visible in Demo/Mock Mode) */}
      {!isRealtime && (
        <div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950/40 p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            💡 <strong>Demo Controls:</strong> Test live countdowns, visual border updates, sorting, and automatic removal.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handleAddMockTicket(15)}
              className="flex items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-900/50 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-semibold text-red-700 dark:text-red-400 shadow-sm transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <PlusCircle size={14} /> Add 15s Ticket
            </button>
            <button
              onClick={() => handleAddMockTicket(120)}
              className="flex items-center gap-1.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-sm transition-colors hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <PlusCircle size={14} /> Add 2min Ticket
            </button>
            <button
              onClick={handleResetMock}
              className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <RefreshCw size={14} /> Reset Data
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/10 p-5 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-sm animate-pulse">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {activeTicketsCount === 1
                ? "1 ticket expiring within 24 hours"
                : `${activeTicketsCount} tickets expiring within 24 hours`}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              Urgency indicators and counts update in real-time. Grab them before they expire!
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex gap-2">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <ExpiringCard key={ticket.id} ticket={ticket} />
          ))
        ) : (
          <div className="col-span-full py-16 text-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-850 mb-4">
              <Clock className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">No tickets expiring soon</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              There are currently no active listings matching this category expiring within 24 hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ExpiringCard({ ticket }: { ticket: ExpiringTicket }) {
  const [countdownText, setCountdownText] = useState("");
  const [urgency, setUrgency] = useState<any>({
    cardClass: "",
    timerBadge: "",
    indicatorColor: "",
    statusText: "",
  });

  const getTypeDetails = (type: string) => {
    switch (type.toLowerCase()) {
      case "movie":
        return { label: "Movie", icon: Film, color: "text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30" };
      case "train":
        return { label: "Train", icon: Train, color: "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30" };
      case "bus":
        return { label: "Bus", icon: Bus, color: "text-orange-500 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30" };
      case "event":
        return { label: "Event", icon: Calendar, color: "text-pink-500 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/30" };
      default:
        return { label: "Other", icon: Tag, color: "text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30" };
    }
  };

  const details = getTypeDetails(ticket.type);
  const Icon = details.icon;

  useEffect(() => {
    const updateCard = () => {
      const now = Date.now();
      const expiry = new Date(ticket.expiryTime).getTime();
      const diff = expiry - now;

      if (ticket.isExpired || diff <= 0) {
        setCountdownText("Expired");
        setUrgency({
          cardClass: "border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/20 opacity-40 scale-[0.98] pointer-events-none transition-all duration-700",
          timerBadge: "bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-700",
          indicatorColor: "bg-gray-300 dark:bg-gray-600",
          statusText: "Expired",
        });
        return;
      }

      // Format countdown time
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const pad = (n: number) => String(n).padStart(2, '0');
      setCountdownText(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);

      // Determine Urgency Styles
      const hoursLeft = diff / (1000 * 60 * 60);
      if (hoursLeft < 3) {
        setUrgency({
          cardClass: "border-red-200 dark:border-red-900/50 ring-2 ring-red-500/50 dark:ring-red-500/30 shadow-md shadow-red-50/50 dark:shadow-red-950/10 hover:shadow-lg hover:ring-red-500 transition-all duration-300",
          timerBadge: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-900/50 font-mono font-bold animate-pulse",
          indicatorColor: "bg-red-500",
          statusText: "Less than 3 hours left",
        });
      } else if (hoursLeft < 12) {
        setUrgency({
          cardClass: "border-amber-200 dark:border-amber-900/50 ring-2 ring-amber-500/30 dark:ring-amber-500/20 shadow-sm shadow-amber-50/50 dark:shadow-amber-950/10 hover:shadow-md hover:ring-amber-500 transition-all duration-300",
          timerBadge: "bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900/50 font-mono font-semibold",
          indicatorColor: "bg-amber-500",
          statusText: "Expiring soon",
        });
      } else {
        setUrgency({
          cardClass: "border-green-200 dark:border-green-900/50 ring-2 ring-green-500/20 dark:ring-green-500/10 shadow-xs shadow-green-50/30 dark:shadow-green-950/5 hover:shadow-sm hover:ring-green-500 transition-all duration-300",
          timerBadge: "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50 font-mono",
          indicatorColor: "bg-green-500",
          statusText: "Active",
        });
      }
    };

    updateCard();
    const interval = setInterval(updateCard, 1000);
    return () => clearInterval(interval);
  }, [ticket.expiryTime, ticket.isExpired]);

  return (
    <div className={`group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border transition-all ${urgency.cardClass}`}>
      {/* Top Stripe Color Indicator */}
      <div className={`h-1.5 w-full ${urgency.indicatorColor}`} />

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Type and Timer Row */}
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${details.color}`}>
            <Icon size={12} />
            {details.label}
          </div>
          
          <div className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs ${urgency.timerBadge}`}>
            <Clock size={12} />
            <span>{countdownText}</span>
          </div>
        </div>

        {/* Title and Seller */}
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 text-base leading-snug">
            {ticket.title}
          </h3>
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <span className="font-medium text-gray-700 dark:text-gray-300">Seller:</span>
            <span className="truncate max-w-[120px]">{ticket.sellerName}</span>
            {ticket.isVerified && (
              <span className="inline-flex items-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-full p-0.5" title="Verified College Student">
                <ShieldCheck size={14} className="fill-green-50/10 dark:fill-green-950/10" />
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div className="border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-950/40 p-4 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Price</span>
          <span className="text-lg font-bold text-gray-900 dark:text-gray-100">₹{ticket.price}</span>
        </div>
        
        {ticket.isExpired ? (
          <button disabled className="rounded-full bg-gray-300 dark:bg-gray-800 px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-600 cursor-not-allowed">
            Expired
          </button>
        ) : (
          <Link
            href={ticket.id.startsWith("mock") ? "/browse" : `/listing/${ticket.id}`}
            className="rounded-full bg-gray-900 dark:bg-gray-100 px-4 py-2 text-xs font-semibold text-white dark:text-gray-900 transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
          >
            Claim Deal
          </Link>
        )}
      </div>
    </div>
  );
}

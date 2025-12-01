import React, { useState } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Star, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBarbers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SelectBarber() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

  const { data: barbers = [], isLoading } = useQuery({
    queryKey: ["barbers"],
    queryFn: getBarbers,
  });

  const filteredBarbers = barbers.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectBarber = (barberId: string) => {
    sessionStorage.setItem("selectedBarberId", barberId);
    setLocation(`/barber/${barberId}`);
  };

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/select-booking-mode">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold font-display">Escolha o Barbeiro</h1>
      </div>

      <div className="p-6 space-y-4 pb-24">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Procure barbeiro ou local..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            data-testid="input-search-barber"
          />
        </div>

        {/* Barbers List */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-card overflow-hidden">
                  <Skeleton className="h-32 w-full" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))
            ) : filteredBarbers.length > 0 ? (
              filteredBarbers.map((barber, idx) => (
                <motion.button
                  key={barber.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectBarber(barber.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.02]",
                    selectedBarber === barber.id
                      ? "border-primary"
                      : "border-white/10 hover:border-primary/30"
                  )}
                  data-testid={`barber-option-${barber.id}`}
                >
                  <div className="h-32 w-full overflow-hidden bg-secondary relative">
                    <img
                      src={barber.avatar || `https://i.pravatar.cc/400?u=${barber.id}`}
                      alt={barber.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-primary fill-primary" />
                      <span className="text-xs font-bold text-white">{barber.rating}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-card">
                    <h3 className="font-bold text-white text-lg mb-2">{barber.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{barber.location}, {barber.distance}</span>
                    </div>
                    <div className="flex gap-2">
                      {barber.tags?.slice(0, 2).map(tag => (
                        <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-sm">Nenhum barbeiro encontrado</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileShell>
  );
}

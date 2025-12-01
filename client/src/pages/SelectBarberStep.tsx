import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Star, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getServices, getBarbers } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function SelectBarberStep() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceId, setServiceId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("selectedServiceId");
    if (!id) {
      setLocation("/booking-step-2-service");
      return;
    }
    setServiceId(id);
  }, []);

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const { data: allBarbers = [], isLoading: loadingBarbers } = useQuery({
    queryKey: ["barbers"],
    queryFn: getBarbers,
  });

  const barbersWithService = Array.from(
    new Map(
      services
        .filter(s => s.id === serviceId)
        .map(s => {
          const barber = allBarbers.find(b => b.id === s.barberId);
          return [s.barberId, { id: s.barberId, name: barber?.name || s.barberId }];
        })
    ).values()
  );

  const filteredBarbers = barbersWithService.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = loadingServices || loadingBarbers;

  const handleSelectBarber = (barberId: string) => {
    sessionStorage.setItem("bookingStep", "3");
    sessionStorage.setItem("selectedBarberId", barberId);
    setLocation("/booking-step-3-date");
  };

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/booking-step-2-service">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 -ml-2" 
            data-testid="button-back"
            onClick={() => sessionStorage.removeItem("selectedServiceId")}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-display">2. Escolha o Barbeiro</h1>
          <p className="text-xs text-muted-foreground mt-1">Passo 2 de 7</p>
        </div>
      </div>

      <div className="p-6 space-y-4 pb-24">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Procure um barbeiro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            data-testid="input-search-barber"
          />
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
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
                  className="w-full text-left rounded-2xl border-2 border-white/10 overflow-hidden transition-all hover:border-primary/30 hover:scale-[1.02] bg-card"
                  data-testid={`barber-option-${barber.id}`}
                >
                  <div className="h-32 w-full overflow-hidden bg-secondary relative">
                    <img
                      src={`https://i.pravatar.cc/400?u=${barber.id}`}
                      alt={barber.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-white text-lg mb-2">{barber.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-primary">
                      <Star className="w-3 h-3 fill-primary" />
                      <span>Barbeiro disponível</span>
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

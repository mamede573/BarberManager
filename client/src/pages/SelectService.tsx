import React, { useState } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SelectService() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  const filteredServices = services.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectService = (serviceId: string) => {
    sessionStorage.setItem("selectedServiceId", serviceId);
    setLocation("/select-barber-by-service");
  };

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/select-booking-mode">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold font-display">Escolha o Serviço</h1>
      </div>

      <div className="p-6 space-y-4 pb-24">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Procure um serviço..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            data-testid="input-search-service"
          />
        </div>

        {/* Services List */}
        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/10 bg-card p-4">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))
            ) : filteredServices.length > 0 ? (
              filteredServices.map((service, idx) => (
                <motion.button
                  key={service.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectService(service.id)}
                  className={cn(
                    "w-full text-left rounded-2xl border-2 p-4 transition-all hover:scale-[1.02]",
                    selectedService === service.id
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-card hover:border-primary/30"
                  )}
                  data-testid={`service-option-${service.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{service.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>{service.duration}m</span>
                    </div>
                    <span className="font-bold text-primary">R$ {parseFloat(service.price).toFixed(2)}</span>
                  </div>
                </motion.button>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground text-sm">Nenhum serviço encontrado</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileShell>
  );
}

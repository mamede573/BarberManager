import React, { useEffect, useState, useMemo } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Star, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function SelectBarberByService() {
  const [, setLocation] = useLocation();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [serviceInfo, setServiceInfo] = useState<any>(null);

  useEffect(() => {
    const serviceId = sessionStorage.getItem("selectedServiceId");
    setSelectedServiceId(serviceId);
  }, []);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  useEffect(() => {
    if (selectedServiceId && services.length > 0) {
      const service = services.find((s: any) => s.id === selectedServiceId);
      setServiceInfo(service);
    }
  }, [selectedServiceId, services]);

  // Filter barbers that offer this service (memoized)
  const barbersWithService = useMemo(() => {
    return services
      .filter((s: any) => s.id === selectedServiceId)
      .reduce((acc: any[], service: any) => {
        const existingBarber = acc.find(b => b.id === service.barberId);
        if (!existingBarber) {
          acc.push({
            id: service.barberId,
            name: service.barberId,
            services: [service],
          });
        } else {
          existingBarber.services.push(service);
        }
        return acc;
      }, []);
  }, [services, selectedServiceId]);

  const handleSelectBarber = (barberId: string) => {
    sessionStorage.removeItem("selectedServiceId");
    setLocation(`/barber/${barberId}`);
  };

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/select-service">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-display">Barbeiros Disponíveis</h1>
          {serviceInfo && <p className="text-xs text-muted-foreground mt-1">{serviceInfo.name}</p>}
        </div>
      </div>

      <div className="p-6 space-y-4 pb-24">
        {/* Barbers List */}
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
            ) : barbersWithService.length > 0 ? (
              barbersWithService.map((barber: any, idx: number) => (
                <motion.button
                  key={barber.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleSelectBarber(barber.id)}
                  className="w-full text-left rounded-2xl border-2 border-white/10 overflow-hidden transition-all hover:border-primary/30 hover:scale-[1.02] bg-card"
                  data-testid={`barber-service-option-${barber.id}`}
                >
                  <div className="h-32 w-full overflow-hidden bg-secondary relative">
                    <img
                      src={`https://i.pravatar.cc/400?u=${barber.id}`}
                      alt={barber.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-bold text-white text-lg mb-2">{barber.name}</h3>
                      <div className="text-xs text-muted-foreground mb-2">
                        <p>Oferece este serviço</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {barber.services.map((s: any) => (
                          <span key={s.id} className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded-md">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Info Badge */}
                    <div className="pt-2 border-t border-white/5">
                      <p className="text-xs text-muted-foreground">Clique para ver horários disponíveis</p>
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
                <p className="text-muted-foreground text-sm">Nenhum barbeiro encontrado com este serviço</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileShell>
  );
}

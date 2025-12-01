import React from "react";
import MobileShell from "@/components/MobileShell";
import { Bell, Search, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth-context";

// Fallback images
import interiorImage from "@assets/generated_images/dark_modern_barber_shop_interior_vertical.png";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  return (
    <MobileShell>
      {/* Header */}
      <div className="px-6 pt-16 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img src={user?.avatar || `https://i.pravatar.cc/150?u=${user?.id}`} alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bem-vindo,</p>
            <h2 className="text-lg font-bold font-display">{user?.name || "Usuário"}</h2>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/5" data-testid="button-notifications">
          <Bell className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <Link href="/explore">
          <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-2xl p-3 flex items-center gap-3 text-muted-foreground cursor-pointer hover:border-white/10 transition-colors" data-testid="input-search">
            <Search className="w-5 h-5" />
            <span className="text-sm">Procure barbeiro, serviço...</span>
          </div>
        </Link>
      </div>

      <div className="space-y-8 pb-24">
        {/* Quick Booking Button */}
        <div className="px-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLocation("/booking-step-2-service")}
            className="w-full relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-primary to-primary/80 p-6 hover:border-primary/50 transition-all group"
            data-testid="button-booking"
          >
            <div className="absolute inset-0 opacity-10 group-hover:opacity-20 bg-gradient-to-br from-white to-white transition-opacity" />
            
            <div className="relative z-10 text-center">
              <h3 className="font-bold text-lg text-black mb-1">Agendar Serviço</h3>
              <p className="text-xs text-black/80">Comece seu agendamento agora</p>
            </div>
          </motion.button>
        </div>

        {/* Hero Banner */}
        <div className="px-6">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden group">
            <img src={interiorImage} alt="Featured" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-5 flex flex-col justify-end items-start">
              <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">DESTAQUE</span>
              <h3 className="text-xl font-bold font-display text-white mb-1">Royal Cuts & Shaves</h3>
              <p className="text-xs text-gray-300 mb-3">Obtenha 20% de desconto na sua primeira visita.</p>
              <Link href="/explore">
                <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full text-xs h-8" data-testid="button-book-featured">
                  Agendar Agora
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Featured Services */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display">Serviços em Destaque</h3>
            <Link href="/explore">
              <span className="text-xs text-primary cursor-pointer">Ver Todos</span>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {loadingServices ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-white/5 bg-card overflow-hidden">
                  <Skeleton className="w-full h-32" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              services.slice(0, 4).map((service) => (
                <motion.div 
                  key={service.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setLocation(`/barber/${service.barberId}`)}
                  className="rounded-2xl border border-white/10 bg-card overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
                  data-testid={`service-card-${service.id}`}
                >
                  <div className="relative h-32 overflow-hidden bg-secondary">
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/10">
                        <span className="text-3xl">✂️</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>
                  
                  <div className="p-3">
                    <h4 className="font-bold text-sm text-white truncate" data-testid={`service-name-${service.id}`}>{service.name}</h4>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{service.duration}m</span>
                      </div>
                      <span className="font-bold text-sm text-primary" data-testid={`service-price-${service.id}`}>R$ {parseFloat(service.price).toFixed(0)}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

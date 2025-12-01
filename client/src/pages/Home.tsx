import React from "react";
import MobileShell from "@/components/MobileShell";
import { Bell, Search, Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { getBarbers, getCategories } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

// Fallback images
import interiorImage from "@assets/generated_images/dark_modern_barber_shop_interior_vertical.png";

export default function Home() {
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const { data: barbers = [], isLoading: loadingBarbers } = useQuery({
    queryKey: ["barbers"],
    queryFn: getBarbers,
  });

  return (
    <MobileShell>
      {/* Header */}
      <div className="px-6 pt-16 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Bem-vindo,</p>
            <h2 className="text-lg font-bold font-display">Michael</h2>
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
        {/* Hero Banner */}
        <div className="px-6">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden group">
            <img src={interiorImage} alt="Featured" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-5 flex flex-col justify-end items-start">
              <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">DESTAQUE</span>
              <h3 className="text-xl font-bold font-display text-white mb-1">Royal Cuts & Shaves</h3>
              <p className="text-xs text-gray-300 mb-3">Obtenha 20% de desconto na sua primeira visita.</p>
              {barbers.length > 0 && (
                <Link href={`/barber/${barbers[0].id}`}>
                  <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full text-xs h-8" data-testid="button-book-featured">
                    Agendar Agora
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="pl-6">
          <div className="flex items-center justify-between pr-6 mb-4">
            <h3 className="text-lg font-bold font-display">Serviços</h3>
            <span className="text-xs text-primary cursor-pointer">Ver tudo</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 pr-6 hide-scrollbar">
            {loadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 min-w-[70px]">
                  <Skeleton className="w-16 h-16 rounded-2xl" />
                  <Skeleton className="w-12 h-3" />
                </div>
              ))
            ) : (
              categories.map((cat) => (
                <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[70px]" data-testid={`category-${cat.id}`}>
                  <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center text-2xl hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                    {cat.icon}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{cat.name}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Rated */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display">Barbeiros Melhores Avaliados</h3>
            <Link href="/explore">
              <span className="text-xs text-primary cursor-pointer">Ver Todos</span>
            </Link>
          </div>
          
          <div className="flex flex-col gap-4">
            {loadingBarbers ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border border-white/5 rounded-2xl p-3 flex gap-4">
                  <Skeleton className="w-24 h-24 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              barbers.map((barber) => (
                <Link key={barber.id} href={`/barber/${barber.id}`}>
                  <motion.div 
                    whileTap={{ scale: 0.98 }}
                    className="bg-card border border-white/5 rounded-2xl p-3 flex gap-4 cursor-pointer hover:border-primary/30 transition-all"
                    data-testid={`barber-card-${barber.id}`}
                  >
                    <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                      <img 
                        src={barber.avatar || `https://i.pravatar.cc/150?u=${barber.id}`} 
                        alt={barber.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col justify-center flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold font-display text-base">{barber.name}</h4>
                        <div className="flex items-center gap-1 bg-primary/10 px-1.5 py-0.5 rounded-md">
                          <Star className="w-3 h-3 text-primary fill-primary" />
                          <span className="text-[10px] font-bold text-primary">{barber.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground mt-1 mb-3">
                        <MapPin className="w-3 h-3" />
                        <span className="text-xs">{barber.location}, {barber.distance}</span>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-[10px] text-gray-500">Próximo slot: 14:00</span>
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

import React, { useState } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Star, MapPin, Share2, Heart, Clock, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getBarber, getServicesByBarber } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import type { Service } from "@shared/schema";

export default function BarberProfile() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const { data: barber, isLoading: loadingBarber } = useQuery({
    queryKey: ["barber", params.id],
    queryFn: () => getBarber(params.id!),
    enabled: !!params.id,
  });

  const { data: services = [], isLoading: loadingServices } = useQuery({
    queryKey: ["services", params.id],
    queryFn: () => getServicesByBarber(params.id!),
    enabled: !!params.id,
  });

  const toggleService = (id: string) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const selectedServicesList = services.filter(s => selectedServices.includes(s.id));
  const total = selectedServicesList.reduce((acc, curr) => acc + parseFloat(curr.price), 0);

  const handleBooking = () => {
    const bookingData = {
      barberId: params.id,
      barberName: barber?.name,
      services: selectedServicesList,
      total: total.toFixed(2),
    };
    sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    setLocation("/booking");
  };

  if (loadingBarber) {
    return (
      <MobileShell hideNav>
        <div className="h-[300px] w-full">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="px-6 pt-6 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </MobileShell>
    );
  }

  if (!barber) {
    return (
      <MobileShell hideNav>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Barber not found</p>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      {/* Image Header */}
      <div className="relative h-[300px] w-full">
        <img 
          src={barber.avatar || `https://i.pravatar.cc/400?u=${barber.id}`} 
          alt={barber.name} 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background"></div>
        
        {/* Navbar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-center z-10">
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer border border-white/10" data-testid="button-back">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </Link>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer border border-white/10" data-testid="button-favorite">
              <Heart className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer border border-white/10" data-testid="button-share">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barber Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2" data-testid="text-barber-name">{barber.name}</h1>
              <div className="flex items-center gap-4 text-gray-300 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-white font-bold">{barber.rating}</span>
                  <span>({barber.reviewCount} reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{barber.distance} away</span>
                </div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-primary overflow-hidden bg-black">
               <img src={barber.avatar || `https://i.pravatar.cc/150?u=${barber.id}`} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-6 relative z-20 bg-background rounded-t-[2rem] min-h-[500px] pb-32">
        <div className="w-12 h-1 bg-white/10 rounded-full mx-auto mt-4 mb-8"></div>

        <div className="space-y-8">
          {/* About */}
          <section>
            <h3 className="text-lg font-bold font-display mb-2">About</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {barber.bio || "No description available."}
            </p>
          </section>

          {/* Services */}
          <section>
            <h3 className="text-lg font-bold font-display mb-4">Services</h3>
            <div className="space-y-3">
              {loadingServices ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-white/5 bg-card">
                    <div className="flex items-center gap-4">
                      <Skeleton className="w-10 h-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                ))
              ) : (
                services.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <div 
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={cn(
                        "p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between group",
                        isSelected 
                          ? "bg-primary/10 border-primary/50" 
                          : "bg-card border-white/5 hover:border-white/10"
                      )}
                      data-testid={`service-${service.id}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                          isSelected ? "bg-primary text-black" : "bg-secondary text-muted-foreground"
                        )}>
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={cn("font-bold", isSelected ? "text-primary" : "text-foreground")}>{service.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold font-display text-lg">${parseFloat(service.price).toFixed(0)}</span>
                        <div className={cn(
                          "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                          isSelected ? "bg-primary border-primary" : "border-white/20"
                        )}>
                          {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <AnimatePresence>
        {selectedServices.length > 0 && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="absolute bottom-0 left-0 right-0 p-6 bg-card/90 backdrop-blur-xl border-t border-white/10 z-50 rounded-b-[3rem]"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">{selectedServices.length} services selected</p>
                <p className="text-2xl font-bold font-display text-white" data-testid="text-total-price">${total.toFixed(2)}</p>
              </div>
              <Button 
                size="lg" 
                className="bg-primary text-black hover:bg-primary/90 font-bold rounded-xl px-8"
                onClick={handleBooking}
                data-testid="button-book-appointment"
              >
                Book Appointment
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MobileShell>
  );
}

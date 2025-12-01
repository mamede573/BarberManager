import React, { useState } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Star, MapPin, Share2, Heart, Clock, Scissors } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Assets
import cutImage from "@assets/generated_images/barber_cutting_hair_close_up.png";

export default function BarberProfile() {
  const [, setLocation] = useLocation();
  const [selectedServices, setSelectedServices] = useState<number[]>([]);

  const services = [
    { id: 1, name: "Classic Haircut", duration: "45 min", price: 35 },
    { id: 2, name: "Beard Trim & Shape", duration: "30 min", price: 25 },
    { id: 3, name: "Hot Towel Shave", duration: "40 min", price: 40 },
    { id: 4, name: "Hair & Beard Combo", duration: "75 min", price: 55 },
  ];

  const toggleService = (id: number) => {
    if (selectedServices.includes(id)) {
      setSelectedServices(selectedServices.filter(s => s !== id));
    } else {
      setSelectedServices([...selectedServices, id]);
    }
  };

  const total = services
    .filter(s => selectedServices.includes(s.id))
    .reduce((acc, curr) => acc + curr.price, 0);

  return (
    <MobileShell hideNav>
      {/* Image Header */}
      <div className="relative h-[300px] w-full">
        <img src={cutImage} alt="Barber" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-background"></div>
        
        {/* Navbar Overlay */}
        <div className="absolute top-0 left-0 right-0 p-6 pt-12 flex justify-between items-center z-10">
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer border border-white/10">
              <ChevronLeft className="w-6 h-6" />
            </div>
          </Link>
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer border border-white/10">
              <Heart className="w-5 h-5" />
            </div>
            <div className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 cursor-pointer border border-white/10">
              <Share2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Barber Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-display font-bold text-white mb-2">Jack 'The Clipper'</h1>
              <div className="flex items-center gap-4 text-gray-300 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-white font-bold">4.9</span>
                  <span>(128 reviews)</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>0.8km away</span>
                </div>
              </div>
            </div>
            <div className="w-14 h-14 rounded-full border-2 border-primary overflow-hidden bg-black">
               <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="w-full h-full object-cover" />
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
              Master barber with over 10 years of experience specializing in classic cuts and straight razor shaves. 
              I believe every haircut is a work of art. Complimentary whiskey with every service.
            </p>
          </section>

          {/* Services */}
          <section>
            <h3 className="text-lg font-bold font-display mb-4">Services</h3>
            <div className="space-y-3">
              {services.map((service) => {
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
                          <span>{service.duration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold font-display text-lg">${service.price}</span>
                      <div className={cn(
                        "w-6 h-6 rounded-full border flex items-center justify-center transition-all",
                        isSelected ? "bg-primary border-primary" : "border-white/20"
                      )}>
                        {isSelected && <div className="w-2 h-2 bg-black rounded-full" />}
                      </div>
                    </div>
                  </div>
                );
              })}
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
                <p className="text-2xl font-bold font-display text-white">${total}.00</p>
              </div>
              <Button 
                size="lg" 
                className="bg-primary text-black hover:bg-primary/90 font-bold rounded-xl px-8"
                onClick={() => setLocation("/booking")}
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

import React from "react";
import MobileShell from "@/components/MobileShell";
import { Bell, Search, Star, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Assets
import logoImage from "@assets/generated_images/minimalist_barber_shop_logo_gold_on_black.png";
import interiorImage from "@assets/generated_images/dark_modern_barber_shop_interior_vertical.png";
import cutImage from "@assets/generated_images/barber_cutting_hair_close_up.png";

export default function Home() {
  const categories = [
    { id: 1, name: "Haircut", icon: "✂️" },
    { id: 2, name: "Beard", icon: "🧔" },
    { id: 3, name: "Shave", icon: "🪒" },
    { id: 4, name: "Facial", icon: "🧖" },
  ];

  const topBarbers = [
    {
      id: 1,
      name: "Jack 'The Clipper'",
      rating: 4.9,
      reviews: 128,
      image: cutImage,
      location: "Downtown, 0.8km",
    },
    {
      id: 2,
      name: "Gentleman's Den",
      rating: 4.8,
      reviews: 94,
      image: interiorImage,
      location: "West End, 2.1km",
    },
  ];

  return (
    <MobileShell>
      {/* Header */}
      <div className="px-6 pt-16 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Welcome back,</p>
            <h2 className="text-lg font-bold font-display">Michael</h2>
          </div>
        </div>
        <Button size="icon" variant="ghost" className="rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5 text-foreground" />
        </Button>
      </div>

      {/* Search Bar */}
      <div className="px-6 mb-6">
        <div className="bg-secondary/50 backdrop-blur-sm border border-white/5 rounded-2xl p-3 flex items-center gap-3 text-muted-foreground">
          <Search className="w-5 h-5" />
          <span className="text-sm">Find a barber, service, or product...</span>
        </div>
      </div>

      <div className="space-y-8 pb-24">
        {/* Hero Banner */}
        <div className="px-6">
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden group">
            <img src={interiorImage} alt="Featured" className="w-full h-full object-cover brightness-50 group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-5 flex flex-col justify-end items-start">
              <span className="bg-primary text-black text-[10px] font-bold px-2 py-0.5 rounded-md mb-2">FEATURED</span>
              <h3 className="text-xl font-bold font-display text-white mb-1">Royal Cuts & Shaves</h3>
              <p className="text-xs text-gray-300 mb-3">Get 20% off your first visit this week.</p>
              <Link href="/barber/1">
                <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full text-xs h-8">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="pl-6">
          <div className="flex items-center justify-between pr-6 mb-4">
            <h3 className="text-lg font-bold font-display">Services</h3>
            <span className="text-xs text-primary cursor-pointer">See all</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 pr-6 hide-scrollbar">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col items-center gap-2 min-w-[70px]">
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 border border-white/5 flex items-center justify-center text-2xl hover:bg-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                  {cat.icon}
                </div>
                <span className="text-xs font-medium text-muted-foreground">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-display">Top Rated Barbers</h3>
            <span className="text-xs text-primary cursor-pointer">View Map</span>
          </div>
          
          <div className="flex flex-col gap-4">
            {topBarbers.map((barber) => (
              <Link key={barber.id} href={`/barber/${barber.id}`}>
                <motion.div 
                  whileTap={{ scale: 0.98 }}
                  className="bg-card border border-white/5 rounded-2xl p-3 flex gap-4 cursor-pointer hover:border-primary/30 transition-all"
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden bg-neutral-800 shrink-0">
                    <img src={barber.image} alt={barber.name} className="w-full h-full object-cover" />
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
                      <span className="text-xs">{barber.location}</span>
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] text-gray-500">Next slot: 2:00 PM</span>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </MobileShell>
  );
}

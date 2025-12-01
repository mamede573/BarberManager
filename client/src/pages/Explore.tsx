import React from "react";
import MobileShell from "@/components/MobileShell";
import { Search, MapPin, Filter, List, Map as MapIcon, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import interiorImage from "@assets/generated_images/dark_modern_barber_shop_interior_vertical.png";

export default function Explore() {
  const [view, setView] = React.useState<"list" | "map">("list");

  const barbers = [
    {
      id: 1,
      name: "Jack 'The Clipper'",
      rating: 4.9,
      reviews: 128,
      image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800&auto=format&fit=crop&q=60",
      location: "Downtown, 0.8km",
      price: "$$",
      tags: ["Beard", "Fade"]
    },
    {
      id: 2,
      name: "Gentleman's Den",
      rating: 4.8,
      reviews: 94,
      image: interiorImage,
      location: "West End, 2.1km",
      price: "$$$",
      tags: ["Luxury", "Spa"]
    },
    {
      id: 3,
      name: "Razor Sharp",
      rating: 4.6,
      reviews: 45,
      image: "https://images.unsplash.com/photo-1503951914205-373c05712275?w=800&auto=format&fit=crop&q=60",
      location: "Northside, 3.5km",
      price: "$",
      tags: ["Classic", "Quick"]
    },
    {
      id: 4,
      name: "The Fade Factory",
      rating: 4.7,
      reviews: 210,
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&auto=format&fit=crop&q=60",
      location: "Uptown, 4.2km",
      price: "$$",
      tags: ["Modern", "Color"]
    }
  ];

  return (
    <MobileShell>
      <div className="px-6 pt-16 pb-4 sticky top-0 bg-background z-30">
        <h2 className="text-2xl font-bold font-display mb-4">Explore</h2>
        <div className="flex gap-3 mb-4">
          <div className="flex-1 bg-card border border-white/5 rounded-xl p-3 flex items-center gap-3 text-muted-foreground">
            <Search className="w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search barbers..." 
              className="bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50 w-full text-sm"
            />
          </div>
          <Button size="icon" variant="outline" className="border-white/5 bg-card rounded-xl shrink-0 w-12 h-12">
            <Filter className="w-5 h-5" />
          </Button>
        </div>
        
        <div className="flex p-1 bg-card border border-white/5 rounded-xl w-full">
          <button 
            onClick={() => setView("list")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              view === "list" ? "bg-primary text-black shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <List className="w-4 h-4" /> List
          </button>
          <button 
            onClick={() => setView("map")}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all",
              view === "map" ? "bg-primary text-black shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <MapIcon className="w-4 h-4" /> Map
          </button>
        </div>
      </div>

      <div className="px-6 pb-24 space-y-4">
        {view === "list" ? (
          barbers.map((barber) => (
            <Link key={barber.id} href={`/barber/${barber.id}`}>
              <div className="bg-card border border-white/5 rounded-2xl overflow-hidden group cursor-pointer hover:border-primary/30 transition-all">
                <div className="h-32 w-full overflow-hidden relative">
                  <img src={barber.image} alt={barber.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-xs font-bold text-white">{barber.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold font-display text-lg">{barber.name}</h3>
                    <span className="text-xs font-bold text-muted-foreground">{barber.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">{barber.location}</span>
                  </div>
                  <div className="flex gap-2">
                    {barber.tags.map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider bg-white/5 text-gray-400 px-2 py-1 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="h-[400px] bg-secondary/30 rounded-3xl border border-white/5 flex items-center justify-center relative overflow-hidden">
            {/* Mock Map */}
            <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
               <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute"></div>
               <div className="w-3 h-3 bg-primary rounded-full relative border-2 border-black"></div>
               <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded-md text-[10px] whitespace-nowrap border border-white/10">Razor Sharp</div>
            </div>
             <div className="absolute bottom-1/3 right-1/4 transform -translate-x-1/2 -translate-y-1/2">
               <div className="w-3 h-3 bg-primary rounded-full relative border-2 border-black"></div>
               <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-card px-2 py-1 rounded-md text-[10px] whitespace-nowrap border border-white/10">The Fade Factory</div>
            </div>
            <div className="text-center p-6 z-10">
              <MapIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-muted-foreground text-sm">Map View Mockup</p>
            </div>
          </div>
        )}
      </div>
    </MobileShell>
  );
}

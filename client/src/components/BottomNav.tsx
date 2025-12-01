import React from "react";
import { useLocation, Link } from "wouter";
import { Home, Search, Calendar, User, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/" },
    { icon: Search, label: "Explorar", path: "/explore" },
    { icon: Calendar, label: "Reservas", path: "/bookings" },
    { icon: User, label: "Perfil", path: "/profile" },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t border-white/5 px-6 flex items-center justify-between z-50 rounded-b-[3rem]">
      {navItems.map((item) => {
        const isActive = location === item.path;
        return (
          <Link key={item.path} href={item.path}>
            <div className="flex flex-col items-center gap-1 cursor-pointer group w-16">
              <div
                className={cn(
                  "p-1.5 rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground group-hover:text-foreground"
                )}
              >
                <item.icon
                  size={24}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-transform duration-300 group-active:scale-90"
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium transition-colors duration-300",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

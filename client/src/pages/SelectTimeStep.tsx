import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SelectTimeStep() {
  const [, setLocation] = useLocation();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const d = sessionStorage.getItem("selectedDate");
    if (!d) {
      setLocation("/booking-step-4-date");
      return;
    }
    setDate(d);
  }, []);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const handleNext = () => {
    if (!selectedTime) return;
    sessionStorage.setItem("bookingStep", "5");
    sessionStorage.setItem("selectedTime", selectedTime);
    setLocation("/booking-step-6-summary");
  };

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/booking-step-4-date">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-display">4. Escolha a Hora</h1>
          <p className="text-xs text-muted-foreground mt-1">Passo 4 de 7</p>
        </div>
      </div>

      <div className="p-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-display">Horários Disponíveis</h2>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-8">
          {timeSlots.map((time, idx) => (
            <motion.button
              key={time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedTime(time)}
              className={cn(
                "py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all",
                selectedTime === time
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/50 scale-105"
                  : "bg-secondary/40 text-muted-foreground border-white/10 hover:border-primary/50 hover:bg-secondary/60"
              )}
              data-testid={`time-slot-${time.replace(/:/g, "-")}`}
            >
              {time}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleNext}
            disabled={!selectedTime}
            className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
            data-testid="button-next-summary"
          >
            Próximo
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}

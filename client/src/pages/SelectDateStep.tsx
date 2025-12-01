import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Calendar } from "@/components/ui/calendar";

export default function SelectDateStep() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [barberId, setBarberId] = useState<string | null>(null);

  useEffect(() => {
    const id = sessionStorage.getItem("selectedBarberId");
    if (!id) {
      setLocation("/booking-step-2-service");
      return;
    }
    setBarberId(id);
  }, []);

  const handleNext = () => {
    if (!date) return;
    sessionStorage.setItem("bookingStep", "4");
    sessionStorage.setItem("selectedDate", date.toISOString().split("T")[0]);
    setLocation("/booking-step-4-time");
  };

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/booking-step-3-barber">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-display">3. Escolha a Data</h1>
          <p className="text-xs text-muted-foreground mt-1">Passo 3 de 7</p>
        </div>
      </div>

      <div className="p-6 pb-24">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <CalendarIcon className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-display">Selecione a Data</h2>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-3xl p-6 shadow-2xl">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{backgroundImage: "radial-gradient(circle at 20% 50%, #d4af37 0%, transparent 50%)"}} />
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="w-full text-white [&_.rdp]:w-full [&_.rdp-caption]:text-lg [&_.rdp-cell]:p-0 [&_.rdp-day]:rounded-xl [&_.rdp-day_button]:rounded-xl [&_.rdp-day_button]:p-2.5"
            disabled={(d) => d < new Date() || d < new Date(new Date().setHours(0, 0, 0, 0))}
          />
        </div>

        <div className="mt-8 flex gap-3">
          <Button
            onClick={handleNext}
            disabled={!date}
            className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
            data-testid="button-next-time"
          >
            Próximo
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}

import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Calendar } from "@/components/ui/calendar";
import { useQuery } from "@tanstack/react-query";
import { getAvailableSlots } from "@/lib/api";

// Helper: Convert date to Brasília timezone string (YYYY-MM-DD)
function getDateInBrasiliaTimezone(date: Date): string {
  const offset = -3 * 60; // Brasília is UTC-3
  const lokalDate = new Date(date.getTime() + (offset + date.getTimezoneOffset()) * 60 * 1000);
  return lokalDate.toISOString().split("T")[0];
}

export default function SelectDateStep() {
  const [, setLocation] = useLocation();
  const [date, setDate] = useState<Date | undefined>(() => {
    const today = new Date();
    return today;
  });
  const [barberId, setBarberId] = useState<string | null>(null);
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [disabledDates, setDisabledDates] = useState<Set<string>>(new Set());

  useEffect(() => {
    const id = sessionStorage.getItem("selectedBarberId");
    const sid = sessionStorage.getItem("selectedServiceId");
    if (!id || !sid) {
      setLocation("/booking-step-2-barber");
      return;
    }
    setBarberId(id);
    setServiceId(sid);
  }, []);

  // Check availability for dates to disable those without slots
  useEffect(() => {
    const checkAvailability = async () => {
      if (!barberId || !serviceId) return;
      
      const disabled = new Set<string>();
      const today = new Date();
      
      // Check next 30 days
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(checkDate.getDate() + i);
        const dateStr = getDateInBrasiliaTimezone(checkDate);
        
        try {
          const slots = await getAvailableSlots(barberId, dateStr, [serviceId]);
          if (!slots || slots.length === 0) {
            disabled.add(dateStr);
          }
        } catch (error) {
          disabled.add(dateStr);
        }
      }
      
      setDisabledDates(disabled);
    };
    
    checkAvailability();
  }, [barberId, serviceId]);

  const handleNext = () => {
    if (!date) return;
    const dateStr = getDateInBrasiliaTimezone(date);
    if (disabledDates.has(dateStr)) {
      return; // Don't allow selecting disabled dates
    }
    sessionStorage.setItem("bookingStep", "4");
    sessionStorage.setItem("selectedDate", dateStr);
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
            onSelect={(selectedDate) => {
              if (selectedDate) {
                const dateStr = selectedDate.toISOString().split("T")[0];
                if (!disabledDates.has(dateStr)) {
                  setDate(selectedDate);
                }
              }
            }}
            className="w-full text-white [&_.rdp]:w-full [&_.rdp-caption]:text-lg [&_.rdp-cell]:p-0 [&_.rdp-day]:rounded-xl [&_.rdp-day_button]:rounded-xl [&_.rdp-day_button]:p-2.5"
            disabled={(d) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              if (d < today) return true;
              const dateStr = getDateInBrasiliaTimezone(d);
              return disabledDates.has(dateStr);
            }}
          />
        </div>

        {date && disabledDates.has(getDateInBrasiliaTimezone(date)) && (
          <div className="mt-6 flex items-start gap-3 p-4 rounded-2xl bg-yellow-500/10 border border-yellow-500/30">
            <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-500">Sem vagas neste dia</p>
              <p className="text-xs text-yellow-400/70 mt-1">Todos os horários deste barbeiro estão ocupados. Escolha outra data.</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex gap-3">
          <Button
            onClick={handleNext}
            disabled={!date || disabledDates.has(getDateInBrasiliaTimezone(date))}
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

import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Clock, Calendar, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getServices } from "@/lib/api";
import { motion } from "framer-motion";

export default function BookingSummaryStep() {
  const [, setLocation] = useLocation();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("0");

  useEffect(() => {
    const sId = sessionStorage.getItem("selectedServiceId");
    const bId = sessionStorage.getItem("selectedBarberId");
    const d = sessionStorage.getItem("selectedDate");
    const t = sessionStorage.getItem("selectedTime");

    if (!sId || !bId || !d || !t) {
      setLocation("/booking-step-2-service");
      return;
    }

    setServiceId(sId);
    setBarberId(bId);
    setDate(d);
    setTime(t);
  }, []);

  const { data: services = [] } = useQuery({
    queryKey: ["services"],
    queryFn: getServices,
  });

  useEffect(() => {
    if (serviceId && services.length > 0) {
      const service = services.find(s => s.id === serviceId);
      if (service) {
        setServiceName(service.name);
        setServicePrice(service.price);
      }
    }
  }, [serviceId, services]);

  const handleNext = () => {
    sessionStorage.setItem("bookingStep", "6");
    setLocation("/booking-step-6-confirm");
  };

  const dateObj = date ? new Date(date) : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/booking-step-5-time">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-lg font-bold font-display">5. Resumo</h1>
          <p className="text-xs text-muted-foreground mt-1">Passo 5 de 7</p>
        </div>
      </div>

      <div className="p-6 pb-24">
        <div className="space-y-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-4"
            data-testid="summary-service"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-white">Serviço</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-11">{serviceName}</p>
            <p className="text-lg font-bold text-primary ml-11">R$ {parseFloat(servicePrice).toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-4"
            data-testid="summary-barber"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-white">Barbeiro</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-11">{barberId}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-4"
            data-testid="summary-date"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-white">Data</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-11 capitalize">{formattedDate}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-4"
            data-testid="summary-time"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-white">Horário</h3>
            </div>
            <p className="text-sm text-muted-foreground ml-11">{time}</p>
          </motion.div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleNext}
            className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
            data-testid="button-confirm"
          >
            Confirmar Agendamento
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}

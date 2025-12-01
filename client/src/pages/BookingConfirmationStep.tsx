import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { CheckCircle2, Clock, Calendar, User, DollarSign, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getServices, createAppointment } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import { motion } from "framer-motion";

type PaymentMethod = "local" | "pix";

export default function BookingConfirmationStep() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [barberId, setBarberId] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [serviceName, setServiceName] = useState<string>("");
  const [servicePrice, setServicePrice] = useState<string>("0");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("local");
  const [isConfirmed, setIsConfirmed] = useState(false);

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

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      setIsConfirmed(true);
      toast.success("Agendamento confirmado com sucesso!");
      sessionStorage.removeItem("selectedServiceId");
      sessionStorage.removeItem("selectedBarberId");
      sessionStorage.removeItem("selectedDate");
      sessionStorage.removeItem("selectedTime");
      setTimeout(() => {
        setLocation("/bookings");
      }, 1500);
    },
    onError: (error: any) => {
      console.error("Failed to create appointment:", error);
      toast.error("Erro ao confirmar agendamento. Tente novamente.");
    },
  });

  const handleFinalConfirm = () => {
    if (!serviceId || !barberId || !date || !time || !user?.id) {
      toast.error("Dados incompletos");
      return;
    }

    // The 'date' variable is a Date object from the calendar.
    // Since JavaScript interprets new Date("YYYY-MM-DD") as UTC midnight,
    // We need to add 3 hours to represent 00:00 in Brasília timezone
    // "YYYY-MM-DD" (Brasília local time) = "YYYY-MM-DD 03:00 UTC"
    const dateObj = new Date(date);
    dateObj.setUTCHours(dateObj.getUTCHours() + 3, 0, 0, 0);

    createAppointmentMutation.mutate({
      clientId: user.id,
      barberId: barberId,
      serviceIds: [serviceId],
      date: dateObj,
      time: time,
      totalPrice: servicePrice,
      paymentMethod: paymentMethod === "pix" ? "pix" : "cash",
    });
  };

  const dateObj = date ? new Date(date) : null;
  const formattedDate = dateObj ? dateObj.toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) : "";

  if (isConfirmed) {
    return (
      <MobileShell hideNav>
        <div className="px-6 pt-20 pb-24 flex flex-col items-center justify-center text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold font-display mb-2">Agendamento Confirmado!</h1>
            <p className="text-muted-foreground">Você receberá uma confirmação em breve.</p>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 pb-6 border-b border-white/5">
        <h1 className="text-lg font-bold font-display">6. Pagamento</h1>
        <p className="text-xs text-muted-foreground mt-1">Passo 6 de 7</p>
      </div>

      <div className="p-6 pb-24">
        <div className="space-y-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-4"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-bold text-white">Total</h3>
            </div>
            <p className="text-2xl font-bold text-primary ml-11">R$ {parseFloat(servicePrice).toFixed(2)}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-3"
          >
            <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-white/10 cursor-pointer hover:border-primary/50 transition-colors" data-testid="payment-local">
              <input
                type="radio"
                name="payment"
                value="local"
                checked={paymentMethod === "local"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white">Pagamento no Local</h3>
                <p className="text-xs text-muted-foreground">Pague quando chegar na barbearia</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-4 rounded-2xl border-2 border-white/10 cursor-pointer hover:border-primary/50 transition-colors" data-testid="payment-pix">
              <input
                type="radio"
                name="payment"
                value="pix"
                checked={paymentMethod === "pix"}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-4 h-4"
              />
              <div className="flex-1">
                <h3 className="font-bold text-white">PIX</h3>
                <p className="text-xs text-muted-foreground">Pague via PIX imediatamente</p>
              </div>
            </label>
          </motion.div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleFinalConfirm}
            disabled={createAppointmentMutation.isPending}
            className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
            data-testid="button-final-confirm"
          >
            {createAppointmentMutation.isPending ? "Confirmando..." : "Confirmar Agendamento"}
          </Button>
        </div>
      </div>
    </MobileShell>
  );
}

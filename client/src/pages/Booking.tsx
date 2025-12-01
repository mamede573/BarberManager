import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, ArrowRight, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { createAppointment } from "@/lib/api";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";
import type { Service } from "@shared/schema";

interface BookingData {
  barberId: string;
  barberName: string;
  services: Service[];
  total: string;
}

type PaymentMethod = "local" | "pix";

export default function Booking() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingData, setBookingData] = useState<BookingData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("local");

  useEffect(() => {
    const stored = sessionStorage.getItem("bookingData");
    if (stored) {
      setBookingData(JSON.parse(stored));
    }
  }, []);

  const createAppointmentMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      sessionStorage.removeItem("bookingData");
      toast.success("Agendamento confirmado!");
      setStep(3);
    },
    onError: (error: any) => {
      console.error("Failed to create appointment:", error);
      toast.error("Erro ao confirmar agendamento. Tente novamente.");
    },
  });

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"
  ];

  const handleConfirmBooking = () => {
    if (!bookingData || !date || !selectedTime || !user?.id) {
      toast.error("Dados incompletos");
      return;
    }

    createAppointmentMutation.mutate({
      clientId: user.id,
      barberId: bookingData.barberId,
      serviceIds: bookingData.services.map(s => s.id),
      date: date,
      time: selectedTime,
      totalPrice: bookingData.total,
      paymentMethod: selectedPaymentMethod === "pix" ? "pix" : "cash",
    });
  };

  const renderStep1 = () => (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
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
            disabled={(date) => date < new Date()}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-xl font-bold font-display">Horários Disponíveis</h2>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {timeSlots.map((time, idx) => (
            <motion.button
              key={time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelectedTime(time)}
              className={cn(
                "py-3 px-2 rounded-xl text-xs font-bold border-2 transition-all relative group",
                selectedTime === time
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/50 scale-105"
                  : "bg-secondary/40 text-muted-foreground border-white/10 hover:border-primary/50 hover:bg-secondary/60"
              )}
              data-testid={`time-slot-${time.replace(/\s/g, "-")}`}
            >
              <span className={selectedTime === time ? "text-black font-black" : ""}>{time}</span>
              {selectedTime === time && (
                <div className="absolute inset-0 rounded-xl border-2 border-primary opacity-50 animate-pulse" />
              )}
            </motion.button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-4">💡 Duração: ~{bookingData?.services.reduce((acc, s) => acc + s.duration, 0) || 45} minutos</p>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const paymentMethods = [
      { id: "local" as const, name: "PAGAMENTO NO LOCAL", desc: "Pague na barbearia", icon: MapPin, color: "from-amber-600 to-amber-500" },
      { id: "pix" as const, name: "PIX", desc: "Transfira via PIX", icon: QrCode, color: "from-blue-600 to-blue-500" },
    ];

    return (
      <div className="space-y-8">
        {/* Booking Summary Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-white/10 rounded-3xl p-6 shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -mr-20 -mt-20" />
          
          <h3 className="text-lg font-bold font-display mb-6 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">✓</div>
            Resumo da Reserva
          </h3>
          
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-sm text-muted-foreground">📅 Data</span>
              <span className="font-bold text-white">{date?.toLocaleDateString("pt-BR")}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-white/5">
              <span className="text-sm text-muted-foreground">🕐 Horário</span>
              <span className="font-bold text-white">{selectedTime}</span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <span className="text-sm text-muted-foreground">✂️ Barbeiro</span>
              <span className="font-bold text-white">{bookingData?.barberName}</span>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 space-y-2">
              {bookingData?.services.map((service) => (
                <div key={service.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white text-sm">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.duration} min</p>
                  </div>
                  <span className="font-bold text-primary">R$ {parseFloat(service.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-3">
              <span className="font-bold text-lg text-white">Total</span>
              <span className="font-black text-2xl text-primary" data-testid="text-booking-total">R$ {bookingData?.total}</span>
            </div>
          </div>
        </motion.div>

        {/* Payment Methods */}
        <div>
          <h3 className="text-lg font-bold font-display mb-4">Escolha o Método de Pagamento</h3>
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = selectedPaymentMethod === method.id;
              
              return (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={cn(
                    "relative overflow-hidden rounded-2xl p-4 border-2 transition-all duration-300",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-white/10 bg-card hover:border-primary/50 hover:bg-white/5"
                  )}
                  data-testid={`payment-method-${method.id}`}
                >
                  <div className={cn(
                    "absolute inset-0 opacity-0 transition-opacity",
                    isSelected && `bg-gradient-to-br ${method.color} opacity-5`
                  )} />
                  
                  <div className="relative z-10">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all",
                      isSelected
                        ? "bg-primary text-black shadow-lg shadow-primary/50"
                        : "bg-white/10 text-muted-foreground group-hover:bg-primary/20"
                    )}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <p className="font-bold text-sm text-white text-left">{method.name}</p>
                    <p className="text-xs text-muted-foreground text-left mt-0.5">{method.desc}</p>
                  </div>

                  {isSelected && (
                    <>
                      <motion.div
                        layoutId="selectedBorder"
                        className="absolute inset-0 border-2 border-primary rounded-2xl"
                        initial={false}
                      />
                      <motion.div
                        className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <div className="w-1.5 h-1.5 bg-black rounded-full" />
                      </motion.div>
                    </>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Payment Instructions */}
        {selectedPaymentMethod === "local" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-amber-600/20 to-amber-500/10 border border-amber-500/20 rounded-2xl p-4"
          >
            <p className="text-xs text-amber-300 mb-2">💰 PAGAMENTO NO LOCAL</p>
            <div className="space-y-2">
              <p className="text-white font-semibold">Você pode pagar diretamente na barbearia</p>
              <p className="text-xs text-muted-foreground">Valor total: R$ {bookingData?.total}</p>
            </div>
          </motion.div>
        )}

        {selectedPaymentMethod === "pix" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-600/20 to-blue-500/10 border border-blue-500/20 rounded-2xl p-4"
          >
            <p className="text-xs text-blue-300 mb-2">💳 PAGAMENTO VIA PIX</p>
            <div className="space-y-2">
              <p className="text-white font-semibold">Você receberá o código PIX após confirmar</p>
              <p className="text-xs text-muted-foreground">Valor total: R$ {bookingData?.total}</p>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center h-[600px] text-center px-6">
      <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold font-display text-white mb-2">Agendamento Confirmado!</h2>
      <p className="text-muted-foreground mb-8">
        Seu agendamento com {bookingData?.barberName} está marcado para {date?.toLocaleDateString("pt-BR")} às {selectedTime}.
      </p>
      
      <div className="w-full space-y-3">
        <Button 
          size="lg" 
          className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-xl"
          onClick={() => setLocation("/")}
          data-testid="button-back-home"
        >
          Voltar para Home
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full border-white/10 hover:bg-white/5 rounded-xl"
        >
          Adicionar ao Calendário
        </Button>
      </div>
    </div>
  );

  if (!bookingData && step < 3) {
    return (
      <MobileShell hideNav>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Nenhum serviço selecionado</p>
            <Link href="/">
              <Button>Voltar</Button>
            </Link>
          </div>
        </div>
      </MobileShell>
    );
  }

  return (
    <MobileShell hideNav>
      {step < 3 && (
        <div className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 -ml-2"
            onClick={() => step === 1 ? setLocation(`/barber/${bookingData?.barberId}`) : setStep(step - 1)}
            data-testid="button-booking-back"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-bold font-display">
            {step === 1 ? "Selecione Data e Horário" : "Revisar e Pagar"}
          </h1>
        </div>
      )}

      <div className="p-6 pb-32">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      {step < 3 && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-card/90 backdrop-blur-xl border-t border-white/10 z-50 rounded-b-[3rem]">
          <Button 
            size="lg" 
            className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-xl h-12"
            disabled={(step === 1 && !selectedTime) || createAppointmentMutation.isPending}
            onClick={() => step === 1 ? setStep(2) : handleConfirmBooking()}
            data-testid="button-booking-continue"
          >
            {createAppointmentMutation.isPending ? "Processando..." : step === 1 ? "Continuar" : "Pagar e Confirmar"}
          </Button>
        </div>
      )}
    </MobileShell>
  );
}

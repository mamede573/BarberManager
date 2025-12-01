import React, { useState, useEffect } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Calendar, Clock, Star, MessageCircle, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { cancelAppointment, rescheduleAppointment, getAvailableSlots, getAppointmentsByClient } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { toast } from "sonner";

interface BookingItem {
  id: string;
  barberId: string;
  barberName?: string;
  date: Date;
  time: string;
  serviceIds: string[];
  totalPrice: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  rating?: number;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed":
      return "text-green-400 bg-green-400/10";
    case "pending":
      return "text-yellow-400 bg-yellow-400/10";
    case "completed":
      return "text-blue-400 bg-blue-400/10";
    case "cancelled":
      return "text-red-400 bg-red-400/10";
    default:
      return "text-gray-400 bg-gray-400/10";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "confirmed":
      return "Confirmado";
    case "pending":
      return "Pendente";
    case "completed":
      return "Concluído";
    case "cancelled":
      return "Cancelado";
    default:
      return status;
  }
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("pt-BR", { month: "short", day: "numeric", year: "numeric" });
};

const isUpcoming = (date: Date) => {
  return new Date(date) > new Date();
};

const timeSlots = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

export default function Bookings() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "cancelled">("all");
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>(timeSlots);
  const queryClient = useQueryClient();

  const { data: appointments = [], isLoading, error, refetch } = useQuery({
    queryKey: ["appointments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const result = await getAppointmentsByClient(user.id);
      if (!result || !Array.isArray(result)) return [];
      return result.map((apt: any) => ({
        ...apt,
        date: new Date(apt.date),
        serviceIds: apt.serviceIds || [],
      }));
    },
    enabled: !!user?.id,
    staleTime: 0,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (user?.id) {
      refetch();
    }
  }, [user?.id, refetch]);

  const cancelMutation = useMutation({
    mutationFn: (appointmentId: string) => cancelAppointment(appointmentId),
    onSuccess: () => {
      toast.success("Agendamento cancelado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["appointments", user?.id] });
    },
    onError: () => {
      toast.error("Erro ao cancelar agendamento");
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: (data: { appointmentId: string; date: Date; time: string }) =>
      rescheduleAppointment(data.appointmentId, { date: data.date, time: data.time }),
    onSuccess: () => {
      toast.success("Agendamento remarcado com sucesso");
      setReschedulingId(null);
      setSelectedDate("");
      setSelectedTime("");
      queryClient.invalidateQueries({ queryKey: ["appointments", user?.id] });
    },
    onError: () => {
      toast.error("Erro ao remarcar agendamento");
    },
  });

  const handleRescheduleClick = async (appointment: BookingItem) => {
    setReschedulingId(appointment.id);
    setSelectedDate("");
    setSelectedTime("");
    setAvailableSlots(timeSlots);
  };

  const handleDateSelect = async (appointment: BookingItem, date: string) => {
    setSelectedDate(date);
    try {
      const slots = await getAvailableSlots(appointment.barberId, date, appointment.serviceIds || []);
      setAvailableSlots(slots);
    } catch (error) {
      toast.error("Erro ao carregar horários disponíveis");
    }
  };

  const handleConfirmReschedule = async (appointment: BookingItem) => {
    if (!selectedDate || !selectedTime) {
      toast.error("Selecione data e hora");
      return;
    }
    await rescheduleMutation.mutateAsync({
      appointmentId: appointment.id,
      date: new Date(selectedDate),
      time: selectedTime,
    });
  };

  const filteredBookings = appointments.filter((booking: BookingItem) => {
    if (filter === "upcoming") return booking.status !== "cancelled" && isUpcoming(booking.date);
    if (filter === "completed") return booking.status === "completed";
    if (filter === "cancelled") return booking.status === "cancelled";
    return true;
  });

  return (
    <MobileShell>
      <div className="space-y-6 pb-32">
        {/* Header */}
        <div className="px-6 pt-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold font-display" data-testid="text-page-title">Minhas Reservas</h1>
            <p className="text-xs text-muted-foreground mt-1">{filteredBookings.length} agendamentos</p>
          </div>
          <Link href="/">
            <div className="w-10 h-10 rounded-full bg-secondary/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-secondary cursor-pointer border border-white/10" data-testid="button-back">
              <ChevronLeft className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="px-6 flex gap-2 overflow-x-auto pb-2">
          {(["all", "upcoming", "completed", "cancelled"] as const).map((tab) => {
            const labels = { all: "Todos", upcoming: "Próximos", completed: "Concluídos", cancelled: "Cancelados" };
            const counts = {
              all: appointments.length,
              upcoming: appointments.filter((a: BookingItem) => a.status !== "cancelled" && isUpcoming(a.date)).length,
              completed: appointments.filter((a: BookingItem) => a.status === "completed").length,
              cancelled: appointments.filter((a: BookingItem) => a.status === "cancelled").length,
            };
            return (
              <motion.button
                key={tab}
                onClick={() => setFilter(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all border whitespace-nowrap",
                  filter === tab
                    ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                    : "bg-secondary/50 text-muted-foreground border-white/10 hover:border-white/20"
                )}
                data-testid={`filter-${tab}`}
              >
                {labels[tab]} <span className="ml-1.5 opacity-75">({counts[tab]})</span>
              </motion.button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="px-6 space-y-4">
          <AnimatePresence mode="wait">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-white/10 bg-card rounded-2xl overflow-hidden p-4 space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : filteredBookings.length > 0 ? (
              filteredBookings.map((booking: BookingItem, idx: number) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="border border-white/10 bg-card rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
                >
                  {/* Booking Header */}
                  <div className="p-4 pb-3 flex items-start justify-between border-b border-white/5">
                    <div className="flex-1">
                      <h3 className="font-bold font-display text-lg" data-testid={`booking-barber-${booking.id}`}>
                        {booking.barberName || "Barbeiro"}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={cn("text-xs px-2.5 py-1 rounded-full font-bold", getStatusColor(booking.status))} data-testid={`booking-status-${booking.id}`}>
                          {getStatusLabel(booking.status)}
                        </div>
                        {booking.rating && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="w-3 h-3 fill-primary text-primary" />
                            <span>{booking.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-primary" data-testid={`booking-price-${booking.id}`}>
                        R$ {booking.totalPrice}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.paymentStatus === "paid" ? "Pago" : "Pendente"}</p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground" data-testid={`booking-date-${booking.id}`}>
                        {formatDate(booking.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground" data-testid={`booking-time-${booking.id}`}>
                        {booking.time}
                      </span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Serviços:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.serviceIds && Array.isArray(booking.serviceIds) ? (
                          booking.serviceIds.map((serviceId) => (
                            <span key={serviceId} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                              {serviceId}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-muted-foreground">Sem serviços</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2 pt-2 border-t border-white/5">
                    {isUpcoming(booking.date) && booking.status !== "cancelled" ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => handleRescheduleClick(booking)}
                          data-testid={`button-reschedule-${booking.id}`}
                          disabled={reschedulingId === booking.id}
                        >
                          Remarcar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs text-red-400 hover:text-red-300"
                          onClick={() => cancelMutation.mutate(booking.id)}
                          data-testid={`button-cancel-${booking.id}`}
                          disabled={cancelMutation.isPending}
                        >
                          Cancelar
                        </Button>
                      </>
                    ) : booking.status === "completed" && !booking.rating ? (
                      <Button
                        size="sm"
                        className="w-full text-xs bg-primary text-black hover:bg-primary/90"
                        data-testid={`button-review-${booking.id}`}
                      >
                        <MessageCircle className="w-3 h-3 mr-1" />
                        Deixar Avaliação
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full text-xs" 
                        onClick={() => {
                          sessionStorage.removeItem("selectedServiceId");
                          sessionStorage.removeItem("selectedBarberId");
                          sessionStorage.removeItem("selectedDate");
                          sessionStorage.removeItem("selectedTime");
                          setLocation("/booking-step-2-service");
                        }}
                        data-testid={`button-rebook-${booking.id}`}
                      >
                        Agendar Novamente
                      </Button>
                    )}
                  </div>

                  {/* Reschedule Modal */}
                  {reschedulingId === booking.id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-white/5 bg-secondary/20 p-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-sm">Selecionar nova data e hora</h4>
                        <button onClick={() => setReschedulingId(null)} className="p-1 hover:bg-white/10 rounded">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Date Picker */}
                      <div>
                        <label className="text-xs text-muted-foreground block mb-2">Data</label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => handleDateSelect(booking, e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      {/* Time Picker */}
                      {selectedDate && (
                        <div>
                          <label className="text-xs text-muted-foreground block mb-2">Horário</label>
                          <div className="grid grid-cols-4 gap-2">
                            {Array.isArray(availableSlots) && availableSlots.length > 0 ? (
                              availableSlots.map((slot) => (
                                <button
                                  key={slot}
                                  onClick={() => setSelectedTime(slot)}
                                  className={cn(
                                    "py-2 px-2 rounded-lg text-xs font-bold transition-all border",
                                    selectedTime === slot
                                      ? "bg-primary text-black border-primary"
                                      : "bg-secondary border-white/10 hover:border-white/20"
                                  )}
                                  data-testid={`time-slot-${slot}`}
                                >
                                  {slot}
                                </button>
                              ))
                            ) : (
                              <p className="col-span-4 text-xs text-muted-foreground text-center py-2">Sem horários disponíveis</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Confirm Button */}
                      <Button
                        size="sm"
                        className="w-full bg-primary text-black hover:bg-primary/90"
                        onClick={() => handleConfirmReschedule(booking)}
                        disabled={rescheduleMutation.isPending || !selectedDate || !selectedTime}
                        data-testid={`button-confirm-reschedule-${booking.id}`}
                      >
                        {rescheduleMutation.isPending ? "Remarcando..." : "Confirmar Remarque"}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              ))
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">Nenhuma reserva encontrada</p>
                <Button
                  size="sm"
                  className="mt-4 bg-primary text-black hover:bg-primary/90"
                  onClick={() => setLocation("/")}
                  data-testid="button-explore-barbers"
                >
                  Explorar Barbeiros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </MobileShell>
  );
}

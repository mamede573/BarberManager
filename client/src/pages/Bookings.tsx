import React, { useState } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Calendar, Clock, MapPin, Star, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingItem {
  id: string;
  barberId: string;
  barberName: string;
  date: string;
  time: string;
  services: string[];
  totalPrice: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
  rating?: number;
}

// Mock data for now - in a real app, this would come from the API
const mockBookings: BookingItem[] = [
  {
    id: "1",
    barberId: "barber-1",
    barberName: "Jack 'The Clipper'",
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: "2:00 PM",
    services: ["Classic Haircut", "Beard Trim & Shape"],
    totalPrice: "60.00",
    status: "confirmed",
    paymentStatus: "paid",
  },
  {
    id: "2",
    barberId: "barber-2",
    barberName: "Gentleman's Den",
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    time: "10:00 AM",
    services: ["Hot Towel Shave"],
    totalPrice: "40.00",
    status: "pending",
    paymentStatus: "pending",
  },
  {
    id: "3",
    barberId: "barber-3",
    barberName: "Iron & Ink",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: "3:30 PM",
    services: ["Classic Haircut"],
    totalPrice: "35.00",
    status: "completed",
    paymentStatus: "paid",
    rating: 5,
  },
];

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
      return "Confirmed";
    case "pending":
      return "Pending";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const isUpcoming = (dateString: string) => {
  return new Date(dateString) > new Date();
};

export default function Bookings() {
  const [, setLocation] = useLocation();
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed">("all");

  // In a real app, this would fetch from the API
  // const { data: appointments = [], isLoading } = useQuery({
  //   queryKey: ["appointments", clientId],
  //   queryFn: () => getAppointmentsByClient(clientId),
  // });

  const filteredBookings = mockBookings.filter((booking) => {
    if (filter === "upcoming") return isUpcoming(booking.date);
    if (filter === "completed") return !isUpcoming(booking.date);
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
        <div className="px-6 flex gap-2">
          {(["all", "upcoming", "completed"] as const).map((tab) => {
            const labels = { all: "Todos", upcoming: "Próximos", completed: "Concluídos" };
            return (
            <motion.button
              key={tab}
              onClick={() => setFilter(tab)}
              className={cn(
                "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                filter === tab
                  ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                  : "bg-secondary/50 text-muted-foreground border-white/10 hover:border-white/20"
              )}
              data-testid={`filter-${tab}`}
            >
              {labels[tab]}
            </motion.button>
            );
          })}
        </div>

        {/* Bookings List */}
        <div className="px-6 space-y-4">
          <AnimatePresence mode="wait">
            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking, idx) => (
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
                      <h3 className="font-bold font-display text-lg" data-testid={`booking-barber-${booking.id}`}>{booking.barberName}</h3>
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
                      <p className="text-sm font-bold text-primary" data-testid={`booking-price-${booking.id}`}>R$ {booking.totalPrice}</p>
                      <p className="text-xs text-muted-foreground">{booking.paymentStatus === "paid" ? "Pago" : "Pendente"}</p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground" data-testid={`booking-date-${booking.id}`}>{formatDate(booking.date)}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground" data-testid={`booking-time-${booking.id}`}>{booking.time}</span>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted-foreground mb-2">Serviços:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {booking.services.map((service) => (
                          <span key={service} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-lg border border-primary/20">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="px-4 pb-4 flex gap-2 pt-2 border-t border-white/5">
                    {isUpcoming(booking.date) ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          data-testid={`button-reschedule-${booking.id}`}
                        >
                          Remarcar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          data-testid={`button-cancel-${booking.id}`}
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
                        data-testid={`button-rebook-${booking.id}`}
                      >
                        Agendar Novamente
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
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

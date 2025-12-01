import React from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Scissors, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";

export default function SelectBookingMode() {
  const [, setLocation] = useLocation();

  return (
    <MobileShell hideNav>
      <div className="px-6 pt-6 flex items-center gap-4 pb-6 border-b border-white/5">
        <Link href="/">
          <Button variant="ghost" size="icon" className="hover:bg-white/5 -ml-2" data-testid="button-back">
            <ChevronLeft className="w-6 h-6" />
          </Button>
        </Link>
        <h1 className="text-lg font-bold font-display">Como deseja agendar?</h1>
      </div>

      <div className="p-6 space-y-8 pb-24">
        <p className="text-muted-foreground text-sm text-center mt-4">Escolha começar por serviço ou barbeiro</p>

        <div className="space-y-4">
          {/* Option 1: Service First */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLocation("/select-service")}
            className="w-full relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-6 hover:border-primary/50 transition-all group"
            data-testid="button-service-first"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-primary to-primary/50 transition-opacity" />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all">
                <Scissors className="w-6 h-6 text-primary" />
              </div>
              
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg text-white mb-1">Escolher Serviço</h3>
                <p className="text-xs text-muted-foreground">Veja todos os barbeiros que oferecem o serviço desejado</p>
              </div>
            </div>
          </motion.button>

          {/* Option 2: Barber First */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setLocation("/select-barber")}
            className="w-full relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-card to-card/50 p-6 hover:border-primary/50 transition-all group"
            data-testid="button-barber-first"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-5 bg-gradient-to-br from-primary to-primary/50 transition-opacity" />
            
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-all">
                <Users className="w-6 h-6 text-primary" />
              </div>
              
              <div className="text-left flex-1">
                <h3 className="font-bold text-lg text-white mb-1">Escolher Barbeiro</h3>
                <p className="text-xs text-muted-foreground">Veja os serviços disponíveis do barbeiro escolhido</p>
              </div>
            </div>
          </motion.button>
        </div>
      </div>
    </MobileShell>
  );
}

import React, { useState } from "react";
import MobileShell from "@/components/MobileShell";
import { ChevronLeft, Calendar as CalendarIcon, Clock, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export default function Booking() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1); // 1: Date/Time, 2: Review/Pay, 3: Success
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timeSlots = [
    "10:00 AM", "10:45 AM", "11:30 AM", 
    "1:00 PM", "1:45 PM", "2:30 PM", 
    "4:00 PM", "4:45 PM"
  ];

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold font-display mb-4">Select Date</h2>
        <div className="bg-card border border-white/5 rounded-2xl p-3">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md text-white"
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold font-display mb-4">Available Time</h2>
        <div className="grid grid-cols-3 gap-3">
          {timeSlots.map((time) => (
            <button
              key={time}
              onClick={() => setSelectedTime(time)}
              className={cn(
                "py-3 px-2 rounded-xl text-sm font-medium border transition-all",
                selectedTime === time
                  ? "bg-primary text-black border-primary"
                  : "bg-card text-muted-foreground border-white/5 hover:bg-white/5"
              )}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="bg-card border border-white/5 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold font-display border-b border-white/10 pb-4">Booking Summary</h3>
        
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium text-white">{date?.toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium text-white">{selectedTime}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Barber</span>
          <span className="font-medium text-white">Jack 'The Clipper'</span>
        </div>
        
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-medium text-white">Classic Haircut</p>
              <p className="text-xs text-muted-foreground">45 mins</p>
            </div>
            <span className="font-bold text-white">$35.00</span>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium text-white">Beard Trim</p>
              <p className="text-xs text-muted-foreground">30 mins</p>
            </div>
            <span className="font-bold text-white">$25.00</span>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 flex justify-between items-center">
          <span className="font-bold text-lg text-white">Total</span>
          <span className="font-bold text-xl text-primary">$60.00</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-bold font-display">Payment Method</h3>
        <div className="p-4 rounded-xl border border-primary/50 bg-primary/10 flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <p className="font-bold text-sm text-white">Visa ending in 4242</p>
            <p className="text-xs text-muted-foreground">Expires 12/25</p>
          </div>
          <div className="w-4 h-4 rounded-full bg-primary border border-primary flex items-center justify-center">
            <div className="w-2 h-2 bg-black rounded-full" />
          </div>
        </div>
        <div className="p-4 rounded-xl border border-white/10 bg-card flex items-center gap-3 opacity-50">
          <span className="font-bold text-sm text-white px-2">PIX</span>
          <div className="flex-1">
            <p className="font-bold text-sm text-white">Instant Payment</p>
          </div>
          <div className="w-4 h-4 rounded-full border border-white/20" />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="flex flex-col items-center justify-center h-[600px] text-center px-6">
      <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6 animate-in zoom-in duration-500">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
      </div>
      <h2 className="text-3xl font-bold font-display text-white mb-2">Booking Confirmed!</h2>
      <p className="text-muted-foreground mb-8">
        Your appointment with Jack is set for {date?.toLocaleDateString()} at {selectedTime}.
      </p>
      
      <div className="w-full space-y-3">
        <Button 
          size="lg" 
          className="w-full bg-primary text-black hover:bg-primary/90 font-bold rounded-xl"
          onClick={() => setLocation("/")}
        >
          Back to Home
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="w-full border-white/10 hover:bg-white/5 rounded-xl"
        >
          Add to Calendar
        </Button>
      </div>
    </div>
  );

  return (
    <MobileShell hideNav>
      {step < 3 && (
        <div className="px-6 pt-12 pb-6 flex items-center gap-4 border-b border-white/5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-white/5 -ml-2"
            onClick={() => step === 1 ? setLocation("/barber/1") : setStep(step - 1)}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-bold font-display">
            {step === 1 ? "Select Date & Time" : "Review & Pay"}
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
            disabled={step === 1 && !selectedTime}
            onClick={() => setStep(step + 1)}
          >
            {step === 1 ? "Continue" : "Pay & Confirm"}
          </Button>
        </div>
      )}
    </MobileShell>
  );
}

import React from "react";
import BottomNav from "./BottomNav";
import { Toaster } from "@/components/ui/toaster";

interface MobileShellProps {
  children: React.ReactNode;
  hideNav?: boolean;
  className?: string;
}

export default function MobileShell({ children, hideNav = false, className = "" }: MobileShellProps) {
  return (
    <div className="min-h-screen w-full bg-neutral-950 flex items-center justify-center p-4 font-sans text-foreground">
      {/* Phone Frame Mockup */}
      <div className="w-full max-w-[400px] h-[850px] bg-background rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-neutral-900 ring-1 ring-white/10 flex flex-col">
        {/* Status Bar Mockup */}
        <div className="h-12 w-full bg-transparent absolute top-0 left-0 z-50 flex items-center justify-between px-6 pt-2 pointer-events-none select-none">
          <span className="text-xs font-semibold text-white">9:41</span>
          <div className="flex gap-1.5 items-center">
            <div className="w-4 h-4 rounded-full border border-white/30"></div>
            <div className="w-4 h-4 rounded-full border border-white/30"></div>
            <div className="w-6 h-3 rounded-full border border-white/30 bg-white/80"></div>
          </div>
        </div>

        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-black rounded-b-2xl z-50"></div>

        {/* Content Area */}
        <div className={`flex-1 overflow-y-auto hide-scrollbar relative ${className}`}>
          {children}
        </div>

        {/* Navigation */}
        {!hideNav && <BottomNav />}
        
        <Toaster />
      </div>
    </div>
  );
}

import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth-context";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import BarberProfile from "@/pages/BarberProfile";
import Booking from "@/pages/Booking";
import Explore from "@/pages/Explore";
import Bookings from "@/pages/Bookings";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import SelectServiceStep from "@/pages/SelectServiceStep";
import SelectBarberStep from "@/pages/SelectBarberStep";
import SelectDateStep from "@/pages/SelectDateStep";
import SelectTimeStep from "@/pages/SelectTimeStep";
import BookingSummaryStep from "@/pages/BookingSummaryStep";
import BookingConfirmationStep from "@/pages/BookingConfirmationStep";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/booking-step-2-service" component={SelectServiceStep} />
      <Route path="/booking-step-3-barber" component={SelectBarberStep} />
      <Route path="/booking-step-4-date" component={SelectDateStep} />
      <Route path="/booking-step-5-time" component={SelectTimeStep} />
      <Route path="/booking-step-6-summary" component={BookingSummaryStep} />
      <Route path="/booking-step-7-confirm" component={BookingConfirmationStep} />
      <Route path="/barber/:id" component={BarberProfile} />
      <Route path="/booking" component={Booking} />
      <Route path="/bookings" component={Bookings} />
      <Route path="/profile" component={Profile} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

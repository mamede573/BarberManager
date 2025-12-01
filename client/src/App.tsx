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
import SelectBookingMode from "@/pages/SelectBookingMode";
import SelectService from "@/pages/SelectService";
import SelectBarber from "@/pages/SelectBarber";
import SelectBarberByService from "@/pages/SelectBarberByService";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={Home} />
      <Route path="/explore" component={Explore} />
      <Route path="/select-booking-mode" component={SelectBookingMode} />
      <Route path="/select-service" component={SelectService} />
      <Route path="/select-barber" component={SelectBarber} />
      <Route path="/select-barber-by-service" component={SelectBarberByService} />
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

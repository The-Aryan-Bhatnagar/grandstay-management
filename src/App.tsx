import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminLayout from "@/components/AdminLayout";
import Index from "./pages/Index";
import Rooms from "./pages/Rooms";
import Booking from "./pages/Booking";
import Contact from "./pages/Contact";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import RoomsManagement from "./pages/admin/RoomsManagement";
import BookingsManagement from "./pages/admin/BookingsManagement";
import CustomersManagement from "./pages/admin/CustomersManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import Analytics from "./pages/admin/Analytics";
import AdminSettings from "./pages/admin/Settings";
import RoomStatusBoard from "./pages/admin/RoomStatusBoard";
import Billing from "./pages/admin/Billing";
import MaintenancePage from "./pages/admin/Maintenance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="room-status" element={<RoomStatusBoard />} />
              <Route path="rooms" element={<RoomsManagement />} />
              <Route path="bookings" element={<BookingsManagement />} />
              <Route path="billing" element={<Billing />} />
              <Route path="customers" element={<CustomersManagement />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

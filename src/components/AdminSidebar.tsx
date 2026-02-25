import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  LayoutDashboard, BedDouble, CalendarCheck, Users, UserCog,
  BarChart3, Settings, LogOut, Hotel, Monitor, Receipt, Wrench
} from "lucide-react";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Room Status", to: "/admin/room-status", icon: Monitor },
  { label: "Rooms", to: "/admin/rooms", icon: BedDouble },
  { label: "Bookings", to: "/admin/bookings", icon: CalendarCheck },
  { label: "Billing", to: "/admin/billing", icon: Receipt },
  { label: "Customers", to: "/admin/customers", icon: Users },
  { label: "Staff", to: "/admin/staff", icon: UserCog },
  { label: "Maintenance", to: "/admin/maintenance", icon: Wrench },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      <div className="p-6 border-b border-sidebar-border">
        <Link to="/admin" className="flex items-center gap-3">
          <Hotel className="text-sidebar-primary" size={28} />
          <div>
            <span className="font-display text-lg font-bold text-sidebar-primary">GRANDEUR</span>
            <span className="block text-[10px] tracking-[0.3em] text-sidebar-foreground/50 font-body">MANAGEMENT SYSTEM</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-all ${
                active
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-sidebar-border">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-body text-sidebar-foreground/40 hover:text-sidebar-foreground/70 transition-all mb-1">
          ← Back to Website
        </Link>
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-destructive transition-all w-full"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;

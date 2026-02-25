import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BedDouble, CalendarCheck, Users, DollarSign, TrendingUp, LogIn, LogOut as LogOutIcon, Wrench } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { format } from "date-fns";

const COLORS = ["hsl(142, 71%, 45%)", "hsl(43, 72%, 52%)", "hsl(199, 89%, 48%)", "hsl(0, 72%, 51%)"];

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0, available: 0, occupied: 0, maintenance: 0, cleaning: 0,
    totalBookings: 0, todayCheckIns: 0, todayCheckOuts: 0, customers: 0, revenue: 0,
  });
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [occupancyData, setOccupancyData] = useState<any[]>([]);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const today = format(new Date(), "yyyy-MM-dd");

      const [roomsRes, bookingsRes, customersRes, recentRes] = await Promise.all([
        supabase.from("rooms").select("status"),
        supabase.from("bookings").select("total_price, check_in, check_out, status, created_at"),
        supabase.from("customers").select("id"),
        supabase.from("bookings").select("*, customers(name), rooms(name)").order("created_at", { ascending: false }).limit(5),
      ]);

      const rooms = roomsRes.data || [];
      const bookings = bookingsRes.data || [];
      const customers = customersRes.data || [];

      const available = rooms.filter((r) => r.status === "Available").length;
      const occupied = rooms.filter((r) => r.status === "Occupied").length;
      const maintenance = rooms.filter((r) => r.status === "Maintenance").length;
      const cleaning = rooms.filter((r) => r.status === "Cleaning").length;
      const todayCheckIns = bookings.filter((b) => b.check_in === today).length;
      const todayCheckOuts = bookings.filter((b) => b.check_out === today).length;
      const revenue = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);

      setStats({
        totalRooms: rooms.length, available, occupied, maintenance, cleaning,
        totalBookings: bookings.length, todayCheckIns, todayCheckOuts,
        customers: customers.length, revenue,
      });

      setOccupancyData([
        { name: "Available", value: available },
        { name: "Occupied", value: occupied },
        { name: "Cleaning", value: cleaning },
        { name: "Maintenance", value: maintenance },
      ].filter((d) => d.value > 0));

      setRecentBookings(recentRes.data || []);

      // Monthly chart data
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      setBookingData(months.map((m, i) => ({
        month: m,
        bookings: Math.floor(Math.random() * 40) + 15 + i * 5,
        revenue: Math.floor(Math.random() * 30000) + 10000 + i * 5000,
      })));
    };
    load();
  }, []);

  const cards = [
    { label: "Total Rooms", value: stats.totalRooms, icon: BedDouble, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Available", value: stats.available, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Occupied", value: stats.occupied, icon: CalendarCheck, color: "text-gold", bg: "bg-gold/10" },
    { label: "Maintenance", value: stats.maintenance, icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Total Bookings", value: stats.totalBookings, icon: CalendarCheck, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { label: "Today Check-ins", value: stats.todayCheckIns, icon: LogIn, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    { label: "Today Check-outs", value: stats.todayCheckOuts, icon: LogOutIcon, color: "text-pink-500", bg: "bg-pink-500/10" },
    { label: "Customers", value: stats.customers, icon: Users, color: "text-violet-500", bg: "bg-violet-500/10" },
    { label: "Total Revenue", value: `₹${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Welcome back! Here's your hotel overview.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground font-body">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-body text-muted-foreground">{c.label}</span>
              <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center`}>
                <c.icon className={c.color} size={16} />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-6 lg:col-span-2">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Revenue Overview</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="revenue" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Room Occupancy</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {occupancyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row: Recent Bookings + Quick Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Recent Bookings</h3>
          <div className="space-y-3">
            {recentBookings.map((b: any) => (
              <div key={b.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground font-body">{b.customers?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground font-body">{b.rooms?.name} · {b.check_in} → {b.check_out}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gold font-body">₹{b.total_price}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    b.status === "Checked In" ? "bg-green-500/10 text-green-500" :
                    b.status === "Confirmed" ? "bg-blue-500/10 text-blue-500" :
                    b.status === "Pending" ? "bg-gold/10 text-gold" :
                    "bg-muted text-muted-foreground"
                  }`}>{b.status}</span>
                </div>
              </div>
            ))}
            {recentBookings.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>}
          </div>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Booking Trends</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="bookings" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ fill: "hsl(var(--gold))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

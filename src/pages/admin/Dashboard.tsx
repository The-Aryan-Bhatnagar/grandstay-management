import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BedDouble, CalendarCheck, Users, DollarSign, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalRooms: 0, available: 0, booked: 0, customers: 0, revenue: 0 });
  const [bookingData, setBookingData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const [roomsRes, bookingsRes, customersRes] = await Promise.all([
        supabase.from("rooms").select("status"),
        supabase.from("bookings").select("total_price, created_at, status"),
        supabase.from("customers").select("id"),
      ]);

      const rooms = roomsRes.data || [];
      const bookings = bookingsRes.data || [];
      const customers = customersRes.data || [];

      const revenue = bookings.reduce((sum, b) => sum + (Number(b.total_price) || 0), 0);
      setStats({
        totalRooms: rooms.length,
        available: rooms.filter((r) => r.status === "Available").length,
        booked: rooms.filter((r) => r.status === "Booked").length,
        customers: customers.length,
        revenue,
      });

      // Mock monthly data for charts
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
      setBookingData(months.map((m, i) => ({
        month: m,
        bookings: Math.floor(Math.random() * 50) + 10 + i * 5,
        revenue: Math.floor(Math.random() * 20000) + 5000 + i * 3000,
      })));
    };
    load();
  }, []);

  const cards = [
    { label: "Total Rooms", value: stats.totalRooms, icon: BedDouble, color: "text-blue-500" },
    { label: "Available", value: stats.available, icon: TrendingUp, color: "text-green-500" },
    { label: "Booked", value: stats.booked, icon: CalendarCheck, color: "text-gold" },
    { label: "Customers", value: stats.customers, icon: Users, color: "text-violet-500" },
    { label: "Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: DollarSign, color: "text-emerald-500" },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-body text-muted-foreground">{c.label}</span>
              <c.icon className={c.color} size={20} />
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Bookings Overview</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Bar dataKey="bookings" fill="hsl(var(--gold))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={bookingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
              <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ fill: "hsl(var(--gold))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

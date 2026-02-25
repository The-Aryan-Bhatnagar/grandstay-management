import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

const COLORS = ["hsl(43, 72%, 52%)", "hsl(220, 25%, 50%)", "hsl(160, 60%, 45%)", "hsl(0, 72%, 51%)"];

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const revenueData = months.map((m, i) => ({ month: m, revenue: Math.floor(Math.random() * 40000) + 10000 + i * 2000 }));
const occupancyData = [
  { name: "Occupied", value: 65 },
  { name: "Available", value: 25 },
  { name: "Maintenance", value: 10 },
];
const bookingsData = months.map((m, i) => ({ month: m, bookings: Math.floor(Math.random() * 60) + 20 + i * 3 }));

const Analytics = () => (
  <div>
    <h1 className="font-display text-3xl font-bold text-foreground mb-8">Analytics</h1>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
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
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={occupancyData} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {occupancyData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="glass-card rounded-xl p-6">
      <h3 className="font-display text-lg font-semibold text-foreground mb-4">Total Bookings</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={bookingsData}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }} />
          <Line type="monotone" dataKey="bookings" stroke="hsl(var(--gold))" strokeWidth={2} dot={{ fill: "hsl(var(--gold))" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default Analytics;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  payment_status: string;
  total_price: number;
  customers: { name: string; email: string } | null;
  rooms: { name: string } | null;
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, customers(name, email), rooms(name)")
      .order("created_at", { ascending: false });
    setBookings((data as any[]) || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    toast({ title: `Booking ${status.toLowerCase()}` });
    load();
  };

  const updatePayment = async (id: string, payment_status: string) => {
    await supabase.from("bookings").update({ payment_status }).eq("id", id);
    toast({ title: `Payment marked as ${payment_status.toLowerCase()}` });
    load();
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Bookings</h1>

      <div className="glass-card rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-muted/50">
            <tr>
              {["Customer","Room","Check-in","Check-out","Guests","Total","Status","Payment",""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{b.customers?.name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{b.customers?.email}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{b.rooms?.name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.check_in}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.check_out}</td>
                <td className="px-4 py-3 text-muted-foreground">{b.guests}</td>
                <td className="px-4 py-3 text-gold font-semibold">${b.total_price}</td>
                <td className="px-4 py-3">
                  <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                    <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Pending","Confirmed","Checked In","Checked Out","Cancelled"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Select value={b.payment_status} onValueChange={(v) => updatePayment(b.id, v)}>
                    <SelectTrigger className="h-8 text-xs w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Unpaid","Paid","Refunded"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3"></td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">No bookings yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsManagement;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, LogIn, LogOut, X, Receipt } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Booking {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  payment_status: string;
  total_price: number;
  customers: { name: string; email: string; phone: string | null } | null;
  rooms: { name: string; price: number } | null;
}

interface Room {
  id: string;
  name: string;
  price: number;
  status: string;
}

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");

  // New booking form
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");

  const load = async () => {
    const { data } = await supabase
      .from("bookings")
      .select("*, customers(name, email, phone), rooms(name, price)")
      .order("created_at", { ascending: false });
    setBookings((data as any[]) || []);
  };

  const loadRooms = async () => {
    const { data } = await supabase.from("rooms").select("id, name, price, status").eq("status", "Available").order("name");
    setRooms((data as Room[]) || []);
  };

  useEffect(() => { load(); loadRooms(); }, []);

  const selectedPrice = rooms.find((r) => r.id === selectedRoom)?.price || 0;
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000)) : 0;
  const total = selectedPrice * nights;

  const handleCreateBooking = async () => {
    if (!customerName || !customerEmail || !selectedRoom || !checkIn || !checkOut) {
      toast({ title: "Fill all required fields", variant: "destructive" });
      return;
    }

    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .insert({ name: customerName, email: customerEmail, phone: customerPhone || null })
      .select("id")
      .single();

    if (custErr || !customer) {
      toast({ title: "Error creating customer", variant: "destructive" });
      return;
    }

    const { error: bookErr } = await supabase.from("bookings").insert({
      customer_id: customer.id,
      room_id: selectedRoom,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
      guests: parseInt(guests),
      total_price: total,
      status: "Confirmed",
      payment_status: "Unpaid",
    });

    if (bookErr) {
      toast({ title: "Booking failed", description: bookErr.message, variant: "destructive" });
    } else {
      // Mark room as Occupied
      await supabase.from("rooms").update({ status: "Occupied" }).eq("id", selectedRoom);
      toast({ title: "Booking created successfully!" });
      setOpen(false);
      resetForm();
      load();
      loadRooms();
    }
  };

  const resetForm = () => {
    setCustomerName(""); setCustomerEmail(""); setCustomerPhone("");
    setSelectedRoom(""); setCheckIn(undefined); setCheckOut(undefined); setGuests("1");
  };

  const updateStatus = async (id: string, status: string, roomId?: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);

    // Update room status based on booking status
    if (roomId) {
      if (status === "Checked In") {
        await supabase.from("rooms").update({ status: "Occupied" }).eq("id", roomId);
      } else if (status === "Checked Out") {
        await supabase.from("rooms").update({ status: "Cleaning" }).eq("id", roomId);
      } else if (status === "Cancelled") {
        await supabase.from("rooms").update({ status: "Available" }).eq("id", roomId);
      }
    }

    toast({ title: `Booking ${status.toLowerCase()}` });
    load(); loadRooms();
  };

  const updatePayment = async (id: string, payment_status: string) => {
    await supabase.from("bookings").update({ payment_status }).eq("id", id);
    toast({ title: `Payment ${payment_status.toLowerCase()}` });
    load();
  };

  const filtered = statusFilter === "All" ? bookings : bookings.filter((b) => b.status === statusFilter);

  const statusCounts = {
    All: bookings.length,
    Pending: bookings.filter((b) => b.status === "Pending").length,
    Confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    "Checked In": bookings.filter((b) => b.status === "Checked In").length,
    "Checked Out": bookings.filter((b) => b.status === "Checked Out").length,
    Cancelled: bookings.filter((b) => b.status === "Cancelled").length,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Bookings</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">{bookings.length} total bookings</p>
        </div>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary font-body font-semibold"><Plus size={16} className="mr-2" /> New Booking</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-display text-xl">Create New Booking</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body text-sm">Guest Name *</Label><Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="mt-1" placeholder="Full name" /></div>
                <div><Label className="font-body text-sm">Email *</Label><Input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} className="mt-1" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body text-sm">Phone</Label><Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="mt-1" /></div>
                <div><Label className="font-body text-sm">Guests</Label>
                  <Select value={guests} onValueChange={setGuests}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{[1,2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="font-body text-sm">Room *</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select available room" /></SelectTrigger>
                  <SelectContent>
                    {rooms.map((r) => <SelectItem key={r.id} value={r.id}>{r.name} — ₹{r.price}/night</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-body text-sm">Check-in *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full mt-1 justify-start", !checkIn && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkIn ? format(checkIn, "PPP") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label className="font-body text-sm">Check-out *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full mt-1 justify-start", !checkOut && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {checkOut ? format(checkOut, "PPP") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d <= (checkIn || new Date())} className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              {total > 0 && (
                <div className="border border-border rounded-lg p-4 bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground font-body">{nights} night{nights > 1 ? "s" : ""} × ₹{selectedPrice}</p>
                  <p className="text-2xl font-display font-bold text-gold mt-1">₹{total.toLocaleString()}</p>
                </div>
              )}
              <Button onClick={handleCreateBooking} className="w-full gold-gradient text-primary font-body font-semibold">Confirm Booking</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium transition-all ${
              statusFilter === status ? "gold-gradient text-primary" : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {status} <span className="ml-1 opacity-60">({count})</span>
          </button>
        ))}
      </div>

      <div className="glass-card rounded-xl overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead className="bg-muted/50">
            <tr>
              {["Customer", "Room", "Check-in", "Check-out", "Guests", "Total", "Status", "Payment", "Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium whitespace-nowrap text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground text-sm">{b.customers?.name || "—"}</p>
                  <p className="text-[11px] text-muted-foreground">{b.customers?.email}</p>
                  {b.customers?.phone && <p className="text-[11px] text-muted-foreground">{b.customers.phone}</p>}
                </td>
                <td className="px-4 py-3 text-foreground font-medium">{b.rooms?.name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.check_in}</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">{b.check_out}</td>
                <td className="px-4 py-3 text-muted-foreground text-center">{b.guests}</td>
                <td className="px-4 py-3 text-gold font-bold">₹{b.total_price.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <Select value={b.status} onValueChange={(v) => updateStatus(b.id, v)}>
                    <SelectTrigger className="h-7 text-[11px] w-28"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Pending", "Confirmed", "Checked In", "Checked Out", "Cancelled"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <Select value={b.payment_status} onValueChange={(v) => updatePayment(b.id, v)}>
                    <SelectTrigger className="h-7 text-[11px] w-24"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Unpaid", "Paid", "Refunded"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {b.status === "Confirmed" && (
                      <button onClick={() => updateStatus(b.id, "Checked In")} className="text-green-500 hover:bg-green-500/10 p-1 rounded" title="Check In">
                        <LogIn size={14} />
                      </button>
                    )}
                    {b.status === "Checked In" && (
                      <button onClick={() => updateStatus(b.id, "Checked Out")} className="text-blue-500 hover:bg-blue-500/10 p-1 rounded" title="Check Out">
                        <LogOut size={14} />
                      </button>
                    )}
                    {(b.status === "Pending" || b.status === "Confirmed") && (
                      <button onClick={() => updateStatus(b.id, "Cancelled")} className="text-destructive hover:bg-destructive/10 p-1 rounded" title="Cancel">
                        <X size={14} />
                      </button>
                    )}
                    <Link to={`/admin/billing?booking=${b.id}`} className="text-gold hover:bg-gold/10 p-1 rounded" title="Invoice">
                      <Receipt size={14} />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">No bookings found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingsManagement;

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Room {
  id: string;
  name: string;
  price: number;
}

const Booking = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState(searchParams.get("room") || "");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    supabase.from("rooms").select("id,name,price").eq("status", "Available").then(({ data }) => {
      setRooms((data as Room[]) || []);
    });
  }, []);

  const selectedPrice = rooms.find((r) => r.id === selectedRoom)?.price || 0;
  const nights = checkIn && checkOut ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000)) : 0;
  const total = selectedPrice * nights;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !selectedRoom || !checkIn || !checkOut) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    // Create customer
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .insert({ name, email, phone })
      .select("id")
      .single();

    if (custErr || !customer) {
      toast({ title: "Error creating booking", description: custErr?.message, variant: "destructive" });
      setSubmitting(false);
      return;
    }

    const { error: bookErr } = await supabase.from("bookings").insert({
      customer_id: customer.id,
      room_id: selectedRoom,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: format(checkOut, "yyyy-MM-dd"),
      guests: parseInt(guests),
      total_price: total,
    });

    if (bookErr) {
      toast({ title: "Booking failed", description: bookErr.message, variant: "destructive" });
    } else {
      toast({ title: "Booking Confirmed!", description: `Total: $${total} for ${nights} nights` });
      setName(""); setEmail(""); setPhone(""); setCheckIn(undefined); setCheckOut(undefined); setGuests("1"); setSelectedRoom("");
    }
    setSubmitting(false);
  };

  return (
    <div className="bg-background min-h-screen">
      <PublicNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Reservations</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Book Your Stay</h1>
          </div>

          <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-body text-sm text-foreground">Full Name *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="mt-1.5" />
              </div>
              <div>
                <Label className="font-body text-sm text-foreground">Email *</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className="mt-1.5" />
              </div>
              <div>
                <Label className="font-body text-sm text-foreground">Phone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 000 0000" className="mt-1.5" />
              </div>
              <div>
                <Label className="font-body text-sm text-foreground">Guests</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map((n) => (
                      <SelectItem key={n} value={String(n)}>{n} Guest{n > 1 ? "s" : ""}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="font-body text-sm text-foreground">Room *</Label>
              <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select a room" /></SelectTrigger>
                <SelectContent>
                  {rooms.map((r) => (
                    <SelectItem key={r.id} value={r.id}>{r.name} — ${r.price}/night</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="font-body text-sm text-foreground">Check-in *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full mt-1.5 justify-start", !checkIn && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkIn ? format(checkIn, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label className="font-body text-sm text-foreground">Check-out *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full mt-1.5 justify-start", !checkOut && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d <= (checkIn || new Date())} className="pointer-events-auto" />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {total > 0 && (
              <div className="border-t border-border pt-4 text-center">
                <p className="text-sm text-muted-foreground font-body">
                  {nights} night{nights > 1 ? "s" : ""} × ${selectedPrice}
                </p>
                <p className="text-3xl font-display font-bold text-gold mt-1">${total}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full gold-gradient text-primary font-body font-semibold py-3.5 rounded-lg text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? "Processing..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default Booking;

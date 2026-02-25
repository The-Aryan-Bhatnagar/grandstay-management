import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Receipt, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, differenceInDays } from "date-fns";

const TAX_RATE = 0.10; // 10% tax

interface BookingDetail {
  id: string;
  check_in: string;
  check_out: string;
  guests: number;
  status: string;
  payment_status: string;
  total_price: number;
  created_at: string;
  customers: { name: string; email: string; phone: string | null } | null;
  rooms: { name: string; type: string; price: number } | null;
}

const Billing = () => {
  const [searchParams] = useSearchParams();
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [selected, setSelected] = useState<string>(searchParams.get("booking") || "");
  const [invoice, setInvoice] = useState<BookingDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("*, customers(name, email, phone), rooms(name, type, price)")
        .order("created_at", { ascending: false });
      setBookings((data as any[]) || []);

      if (selected) {
        const found = (data as any[])?.find((b: any) => b.id === selected);
        if (found) setInvoice(found);
      }
    };
    load();
  }, [selected]);

  const handleSelect = (id: string) => {
    setSelected(id);
    const found = bookings.find((b) => b.id === id);
    if (found) setInvoice(found);
  };

  const nights = invoice
    ? Math.max(1, differenceInDays(new Date(invoice.check_out), new Date(invoice.check_in)))
    : 0;
  const roomPrice = invoice?.rooms?.price || 0;
  const subtotal = roomPrice * nights;
  const tax = Math.round(subtotal * TAX_RATE);
  const grandTotal = subtotal + tax;

  const handlePrint = () => {
    window.print();
  };

  const markPaid = async () => {
    if (!invoice) return;
    await supabase.from("bookings").update({ payment_status: "Paid", total_price: grandTotal }).eq("id", invoice.id);
    toast({ title: "Invoice marked as paid" });
    setSelected(invoice.id); // refresh
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Billing & Invoices</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Generate and manage invoices</p>
        </div>
      </div>

      {/* Booking Selector */}
      <div className="glass-card rounded-xl p-6 mb-8">
        <label className="text-sm font-body text-muted-foreground block mb-2">Select a booking to generate invoice</label>
        <Select value={selected} onValueChange={handleSelect}>
          <SelectTrigger className="w-full max-w-md"><SelectValue placeholder="Choose booking..." /></SelectTrigger>
          <SelectContent>
            {bookings.map((b) => (
              <SelectItem key={b.id} value={b.id}>
                {b.customers?.name || "Unknown"} — {b.rooms?.name || "No room"} — {b.check_in}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Invoice */}
      {invoice && (
        <div className="glass-card rounded-xl p-8 max-w-2xl mx-auto print:shadow-none print:border-none" id="invoice">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground">
                <span className="gold-text">GRANDEUR</span> HOTEL
              </h2>
              <p className="text-xs text-muted-foreground font-body mt-1">123 Luxury Avenue, Manhattan, NY 10001</p>
              <p className="text-xs text-muted-foreground font-body">+1 (555) 123-4567 | info@grandeurhotel.com</p>
            </div>
            <div className="text-right">
              <p className="font-display text-lg font-bold text-foreground">INVOICE</p>
              <p className="text-xs text-muted-foreground font-body">#{invoice.id.slice(0, 8).toUpperCase()}</p>
              <p className="text-xs text-muted-foreground font-body">{format(new Date(invoice.created_at), "PPP")}</p>
            </div>
          </div>

          {/* Guest Info */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">Guest Details</p>
              <p className="text-sm font-medium text-foreground font-body">{invoice.customers?.name}</p>
              <p className="text-xs text-muted-foreground font-body">{invoice.customers?.email}</p>
              {invoice.customers?.phone && <p className="text-xs text-muted-foreground font-body">{invoice.customers.phone}</p>}
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-2">Stay Details</p>
              <p className="text-sm text-foreground font-body">{invoice.rooms?.name} ({invoice.rooms?.type})</p>
              <p className="text-xs text-muted-foreground font-body">Check-in: {invoice.check_in}</p>
              <p className="text-xs text-muted-foreground font-body">Check-out: {invoice.check_out}</p>
              <p className="text-xs text-muted-foreground font-body">Guests: {invoice.guests}</p>
            </div>
          </div>

          {/* Line Items */}
          <table className="w-full text-sm font-body mb-6">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted-foreground font-medium text-xs">Description</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Qty</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Rate</th>
                <th className="text-right py-2 text-muted-foreground font-medium text-xs">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border">
                <td className="py-3 text-foreground">{invoice.rooms?.name} — {invoice.rooms?.type}</td>
                <td className="py-3 text-right text-muted-foreground">{nights} night{nights > 1 ? "s" : ""}</td>
                <td className="py-3 text-right text-muted-foreground">₹{roomPrice.toLocaleString()}</td>
                <td className="py-3 text-right text-foreground font-medium">₹{subtotal.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span className="text-foreground">₹{tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-display font-bold border-t border-border pt-2">
                <span className="text-foreground">Total</span>
                <span className="text-gold">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex items-center justify-between border-t border-border pt-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-body text-muted-foreground">Payment Status:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                invoice.payment_status === "Paid" ? "bg-green-500/10 text-green-500" :
                invoice.payment_status === "Refunded" ? "bg-blue-500/10 text-blue-500" :
                "bg-destructive/10 text-destructive"
              }`}>{invoice.payment_status}</span>
            </div>
            <div className="flex gap-2 print:hidden">
              {invoice.payment_status !== "Paid" && (
                <Button onClick={markPaid} size="sm" className="gold-gradient text-primary font-body text-xs">
                  Mark as Paid
                </Button>
              )}
              <Button onClick={handlePrint} variant="outline" size="sm" className="font-body text-xs">
                <Printer size={14} className="mr-1" /> Print
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-4 border-t border-border text-center">
            <p className="text-[10px] text-muted-foreground font-body">Thank you for choosing Grandeur Hotel. We look forward to your next visit.</p>
          </div>
        </div>
      )}

      {!invoice && (
        <div className="text-center py-20 text-muted-foreground font-body">
          <Receipt className="mx-auto mb-4 text-gold/30" size={64} />
          <p>Select a booking above to generate an invoice</p>
        </div>
      )}
    </div>
  );
};

export default Billing;

import { useSearchParams, Link } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { CheckCircle, Printer, Download, Home, CalendarDays, Users, BedDouble } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const BookingConfirmation = () => {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "N/A";
  const room = params.get("room") || "N/A";
  const checkIn = params.get("checkIn") || "";
  const checkOut = params.get("checkOut") || "";
  const guests = params.get("guests") || "1";
  const total = params.get("total") || "0";
  const nights = params.get("nights") || "0";
  const name = params.get("name") || "Guest";
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-background min-h-screen">
      <PublicNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-2xl">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/20 mb-6">
              <CheckCircle className="w-10 h-10 text-gold" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground font-body">
              Thank you, {name}. Your reservation has been successfully placed.
            </p>
          </div>

          {/* Receipt Card */}
          <div ref={printRef} className="glass-card rounded-xl p-8 space-y-6 print:shadow-none print:border print:border-border">
            {/* Reference Number */}
            <div className="text-center border-b border-border pb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-body mb-1">Booking Reference</p>
              <p className="text-2xl font-display font-bold text-gold tracking-wider">{ref}</p>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-start gap-3">
                <BedDouble className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Room</p>
                  <p className="font-body font-medium text-foreground">{room}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Guests</p>
                  <p className="font-body font-medium text-foreground">{guests} Guest{Number(guests) > 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Check-in</p>
                  <p className="font-body font-medium text-foreground">{checkIn}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays className="w-5 h-5 text-gold mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground font-body uppercase tracking-wider">Check-out</p>
                  <p className="font-body font-medium text-foreground">{checkOut}</p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="border-t border-border pt-5">
              <div className="flex justify-between items-center font-body text-sm text-muted-foreground mb-2">
                <span>{nights} night{Number(nights) > 1 ? "s" : ""}</span>
                <span>${(Number(total) / Math.max(1, Number(nights))).toLocaleString()}/night</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-body font-semibold text-foreground text-lg">Total</span>
                <span className="font-display font-bold text-gold text-3xl">${Number(total).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 print:hidden">
            <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2">
              <Printer className="w-4 h-4" /> Print Receipt
            </Button>
            <Button onClick={handlePrint} variant="outline" className="flex-1 gap-2">
              <Download className="w-4 h-4" /> Download Receipt
            </Button>
            <Button asChild className="flex-1 gap-2 gold-gradient text-primary font-semibold hover:opacity-90">
              <Link to="/">
                <Home className="w-4 h-4" /> Back to Home
              </Link>
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground font-body mt-6 print:hidden">
            Please save your booking reference for future correspondence.
          </p>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default BookingConfirmation;

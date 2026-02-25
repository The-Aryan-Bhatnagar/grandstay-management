import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { supabase } from "@/integrations/supabase/client";
import { BedDouble, Users } from "lucide-react";
import roomStandard from "@/assets/room-standard.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";

const fallbackImages: Record<string, string> = {
  Standard: roomStandard,
  Deluxe: roomDeluxe,
  Suite: roomSuite,
};

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  capacity: number;
  description: string | null;
  image_url: string | null;
  status: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase.from("rooms").select("*").order("price");
      setRooms((data as Room[]) || []);
      setLoading(false);
    };
    fetchRooms();
  }, []);

  const filtered = rooms.filter((r) => {
    if (typeFilter !== "All" && r.type !== typeFilter) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    return true;
  });

  const types = ["All", ...new Set(rooms.map((r) => r.type))];

  return (
    <div className="bg-background min-h-screen">
      <PublicNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Accommodations</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Rooms</h1>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-5 py-2 rounded-full text-sm font-body transition-all ${
                  typeFilter === t
                    ? "gold-gradient text-primary font-medium"
                    : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
                }`}
              >
                {t}
              </button>
            ))}
            <button
              onClick={() => setStatusFilter(statusFilter === "All" ? "Available" : "All")}
              className={`px-5 py-2 rounded-full text-sm font-body transition-all ${
                statusFilter === "Available"
                  ? "gold-gradient text-primary font-medium"
                  : "border border-border text-muted-foreground hover:border-gold hover:text-gold"
              }`}
            >
              Available Only
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-20 font-body">No rooms found. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered.map((room) => (
                <div key={room.id} className="glass-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-500">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={room.image_url || fallbackImages[room.type] || roomStandard}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4 gold-gradient text-primary text-xs font-body font-semibold px-3 py-1 rounded-full">
                      {room.type}
                    </div>
                    <div className={`absolute top-4 left-4 text-xs font-body font-semibold px-3 py-1 rounded-full ${
                      room.status === "Available" ? "bg-green-500/90 text-primary-foreground" : "bg-destructive/90 text-destructive-foreground"
                    }`}>
                      {room.status}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-semibold text-foreground mb-2">{room.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground font-body mb-3">
                      <span className="flex items-center gap-1"><BedDouble size={14} /> {room.type}</span>
                      <span className="flex items-center gap-1"><Users size={14} /> {room.capacity} Guests</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-gold text-2xl font-display font-bold">${room.price}</span>
                      <span className="text-muted-foreground text-sm font-body">/ night</span>
                    </div>
                    <Link
                      to={`/booking?room=${room.id}`}
                      className="block text-center gold-gradient text-primary font-body text-sm py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default Rooms;

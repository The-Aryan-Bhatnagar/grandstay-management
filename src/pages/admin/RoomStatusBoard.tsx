import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Room {
  id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  capacity: number;
}

const statusConfig: Record<string, { color: string; emoji: string; label: string }> = {
  Available: { color: "bg-green-500/20 border-green-500/40 text-green-600", emoji: "🟢", label: "Available" },
  Occupied: { color: "bg-red-500/20 border-red-500/40 text-red-500", emoji: "🔴", label: "Occupied" },
  Cleaning: { color: "bg-yellow-500/20 border-yellow-500/40 text-yellow-600", emoji: "🟡", label: "Cleaning" },
  Maintenance: { color: "bg-gray-500/20 border-gray-500/40 text-gray-500", emoji: "⚫", label: "Maintenance" },
};

const RoomStatusBoard = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("rooms").select("*").order("name");
      setRooms((data as Room[]) || []);
    };
    load();

    // Subscribe to realtime changes
    const channel = supabase
      .channel("room-status")
      .on("postgres_changes", { event: "*", schema: "public", table: "rooms" }, () => load())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = filter === "All" ? rooms : rooms.filter((r) => r.status === filter);
  const counts = {
    All: rooms.length,
    Available: rooms.filter((r) => r.status === "Available").length,
    Occupied: rooms.filter((r) => r.status === "Occupied").length,
    Cleaning: rooms.filter((r) => r.status === "Cleaning").length,
    Maintenance: rooms.filter((r) => r.status === "Maintenance").length,
  };

  // Group by floor
  const floors = filtered.reduce<Record<string, Room[]>>((acc, room) => {
    const floor = room.name.match(/Room (\d)/)?.[1] || "0";
    const floorLabel = `Floor ${floor}`;
    if (!acc[floorLabel]) acc[floorLabel] = [];
    acc[floorLabel].push(room);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Live Room Status</h1>
          <p className="text-sm text-muted-foreground font-body mt-1">Real-time overview of all rooms</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        {(Object.keys(counts) as Array<keyof typeof counts>).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-body font-medium transition-all flex items-center gap-2 ${
              filter === status
                ? "gold-gradient text-primary"
                : "glass-card text-muted-foreground hover:text-foreground"
            }`}
          >
            {status !== "All" && <span>{statusConfig[status]?.emoji}</span>}
            {status}
            <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
              filter === status ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
            }`}>{counts[status]}</span>
          </button>
        ))}
      </div>

      {/* Room Grid by Floor */}
      {Object.entries(floors).sort().map(([floor, floorRooms]) => (
        <div key={floor} className="mb-8">
          <h3 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold text-sm font-bold">
              {floor.replace("Floor ", "")}
            </span>
            {floor}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {floorRooms.map((room) => {
              const cfg = statusConfig[room.status] || statusConfig.Available;
              return (
                <div
                  key={room.id}
                  className={`border rounded-xl p-4 transition-all hover:shadow-md cursor-default ${cfg.color}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-display font-bold">{room.name.replace("Room ", "")}</span>
                    <span className="text-lg">{cfg.emoji}</span>
                  </div>
                  <p className="text-xs font-body font-medium mb-1">{room.type}</p>
                  <p className="text-xs font-body opacity-70">₹{room.price}/night</p>
                  <p className="text-[10px] font-body opacity-60 mt-1">{room.capacity} guests · {cfg.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground font-body">No rooms found</div>
      )}
    </div>
  );
};

export default RoomStatusBoard;

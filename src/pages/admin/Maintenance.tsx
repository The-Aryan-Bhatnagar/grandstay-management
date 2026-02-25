import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, Sparkles } from "lucide-react";

interface Room {
  id: string;
  name: string;
  type: string;
  status: string;
}

const MaintenancePage = () => {
  const [rooms, setRooms] = useState<Room[]>([]);

  const load = async () => {
    const { data } = await supabase.from("rooms").select("id, name, type, status").order("name");
    setRooms((data as Room[]) || []);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("rooms").update({ status }).eq("id", id);
    toast({ title: `Room marked as ${status}` });
    load();
  };

  const maintenanceRooms = rooms.filter((r) => r.status === "Maintenance");
  const cleaningRooms = rooms.filter((r) => r.status === "Cleaning");
  const availableRooms = rooms.filter((r) => r.status === "Available");

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-2">Maintenance & Housekeeping</h1>
      <p className="text-sm text-muted-foreground font-body mb-8">Manage room cleaning and maintenance schedules</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-orange-500">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="text-orange-500" size={20} />
            <span className="font-display font-semibold text-foreground">Under Maintenance</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{maintenanceRooms.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-yellow-500">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-yellow-500" size={20} />
            <span className="font-display font-semibold text-foreground">Cleaning</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{cleaningRooms.length}</p>
        </div>
        <div className="glass-card rounded-xl p-5 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-500 text-lg">✓</span>
            <span className="font-display font-semibold text-foreground">Ready</span>
          </div>
          <p className="text-3xl font-display font-bold text-foreground">{availableRooms.length}</p>
        </div>
      </div>

      {/* Rooms needing attention */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="bg-muted/50 px-4 py-3">
          <h3 className="font-body text-sm font-medium text-muted-foreground">All Rooms — Quick Status Update</h3>
        </div>
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border">
              {["Room", "Type", "Current Status", "Change Status"].map((h) => (
                <th key={h} className="text-left px-4 py-2 text-muted-foreground font-medium text-xs">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-b border-border hover:bg-muted/20 transition-colors">
                <td className="px-4 py-2.5 font-medium text-foreground">{room.name}</td>
                <td className="px-4 py-2.5 text-muted-foreground">{room.type}</td>
                <td className="px-4 py-2.5">
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    room.status === "Available" ? "bg-green-500/10 text-green-500" :
                    room.status === "Occupied" ? "bg-red-500/10 text-red-500" :
                    room.status === "Cleaning" ? "bg-yellow-500/10 text-yellow-600" :
                    "bg-orange-500/10 text-orange-500"
                  }`}>{room.status}</span>
                </td>
                <td className="px-4 py-2.5">
                  <Select value={room.status} onValueChange={(v) => updateStatus(room.id, v)}>
                    <SelectTrigger className="h-7 text-[11px] w-36"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Available", "Occupied", "Cleaning", "Maintenance"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MaintenancePage;

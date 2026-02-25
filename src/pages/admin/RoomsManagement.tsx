import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

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

const defaultRoom = { name: "", type: "Standard", price: 0, capacity: 2, description: "", image_url: "", status: "Available" };

const RoomsManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [form, setForm] = useState(defaultRoom);
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("rooms").select("*").order("name");
    setRooms((data as Room[]) || []);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name) { toast({ title: "Name required", variant: "destructive" }); return; }
    const payload = { ...form, price: Number(form.price), capacity: Number(form.capacity) };

    if (editing) {
      await supabase.from("rooms").update(payload).eq("id", editing);
      toast({ title: "Room updated" });
    } else {
      await supabase.from("rooms").insert(payload);
      toast({ title: "Room added" });
    }
    setOpen(false); setForm(defaultRoom); setEditing(null); load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("rooms").delete().eq("id", id);
    toast({ title: "Room deleted" });
    load();
  };

  const openEdit = (room: Room) => {
    setForm({ name: room.name, type: room.type, price: room.price, capacity: room.capacity, description: room.description || "", image_url: room.image_url || "", status: room.status });
    setEditing(room.id);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Rooms</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(defaultRoom); setEditing(null); } }}>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary font-body"><Plus size={16} className="mr-2" /> Add Room</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Room</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label className="font-body text-sm">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body text-sm">Type</Label>
                  <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Standard","Deluxe","Suite"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label className="font-body text-sm">Status</Label>
                  <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>{["Available","Occupied","Cleaning","Maintenance"].map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="font-body text-sm">Price/Night ($)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} className="mt-1" /></div>
                <div><Label className="font-body text-sm">Capacity</Label><Input type="number" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })} className="mt-1" /></div>
              </div>
              <div><Label className="font-body text-sm">Image URL</Label><Input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="mt-1" /></div>
              <div><Label className="font-body text-sm">Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1" rows={3} /></div>
              <Button onClick={handleSave} className="w-full gold-gradient text-primary font-body font-semibold">{editing ? "Update" : "Add"} Room</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-muted/50">
            <tr>
              {["Name","Type","Price","Capacity","Status","Actions"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{room.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{room.type}</td>
                <td className="px-4 py-3 text-gold font-semibold">${room.price}</td>
                <td className="px-4 py-3 text-muted-foreground">{room.capacity}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    room.status === "Available" ? "bg-green-500/10 text-green-500" :
                    room.status === "Occupied" ? "bg-red-500/10 text-red-500" :
                    room.status === "Cleaning" ? "bg-yellow-500/10 text-yellow-600" :
                    room.status === "Maintenance" ? "bg-orange-500/10 text-orange-500" :
                    "bg-gold/10 text-gold"
                  }`}>{room.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(room)} className="text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(room.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {rooms.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">No rooms yet. Add your first room.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RoomsManagement;

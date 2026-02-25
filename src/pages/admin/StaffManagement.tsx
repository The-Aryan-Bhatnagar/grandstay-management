import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string | null;
  email: string | null;
}

const StaffManagement = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [form, setForm] = useState({ name: "", role: "", phone: "", email: "" });
  const [editing, setEditing] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("staff").select("*").order("created_at", { ascending: false });
    setStaff((data as Staff[]) || []);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.name || !form.role) { toast({ title: "Name and role required", variant: "destructive" }); return; }
    if (editing) {
      await supabase.from("staff").update(form).eq("id", editing);
      toast({ title: "Staff updated" });
    } else {
      await supabase.from("staff").insert(form);
      toast({ title: "Staff added" });
    }
    setOpen(false); setForm({ name: "", role: "", phone: "", email: "" }); setEditing(null); load();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("staff").delete().eq("id", id);
    toast({ title: "Staff removed" });
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Staff</h1>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm({ name: "", role: "", phone: "", email: "" }); setEditing(null); } }}>
          <DialogTrigger asChild>
            <Button className="gold-gradient text-primary font-body"><Plus size={16} className="mr-2" /> Add Staff</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">{editing ? "Edit" : "Add"} Staff</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div><Label className="font-body text-sm">Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1" /></div>
              <div><Label className="font-body text-sm">Role</Label><Input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="mt-1" placeholder="Receptionist, Housekeeping..." /></div>
              <div><Label className="font-body text-sm">Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1" /></div>
              <div><Label className="font-body text-sm">Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1" /></div>
              <Button onClick={handleSave} className="w-full gold-gradient text-primary font-body font-semibold">{editing ? "Update" : "Add"} Staff</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-muted/50">
            <tr>{["Name","Role","Phone","Email","Actions"].map((h) => <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>)}</tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.role}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.phone || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.email || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => { setForm({ name: s.name, role: s.role, phone: s.phone || "", email: s.email || "" }); setEditing(s.id); setOpen(true); }} className="text-muted-foreground hover:text-foreground"><Pencil size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {staff.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">No staff yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement;

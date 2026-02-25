import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

const CustomersManagement = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    supabase.from("customers").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setCustomers((data as Customer[]) || []);
    });
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Customers</h1>
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm font-body">
          <thead className="bg-muted/50">
            <tr>
              {["Name","Email","Phone","Joined"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-muted-foreground font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.phone || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">No customers yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomersManagement;

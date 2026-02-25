import { useAuth } from "@/hooks/useAuth";

const AdminSettings = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Settings</h1>

      <div className="glass-card rounded-xl p-8 max-w-xl">
        <h3 className="font-display text-lg font-semibold text-foreground mb-4">Account</h3>
        <div className="space-y-3 font-body text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground">{user?.email}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Role</span>
            <span className="text-gold font-medium">Admin</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Last Sign In</span>
            <span className="text-foreground">{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

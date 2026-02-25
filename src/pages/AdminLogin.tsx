import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Hotel } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    const { error } = isSignUp ? await signUp(email, password) : await signIn(email, password);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else if (isSignUp) {
      toast({ title: "Account created", description: "Check your email to confirm, then sign in." });
      setIsSignUp(false);
    } else {
      navigate("/admin");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Hotel className="text-gold mx-auto mb-4" size={48} />
          <h1 className="font-display text-3xl font-bold text-primary-foreground">
            <span className="gold-text">GRANDEUR</span>
          </h1>
          <p className="text-primary-foreground/50 font-body text-sm mt-2">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-sidebar-accent/50 backdrop-blur-xl rounded-xl p-8 space-y-5 border border-sidebar-border">
          <div>
            <Label className="font-body text-sm text-primary-foreground/70">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 bg-sidebar-accent border-sidebar-border text-primary-foreground"
              placeholder="admin@grandeurhotel.com"
            />
          </div>
          <div>
            <Label className="font-body text-sm text-primary-foreground/70">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 bg-sidebar-accent border-sidebar-border text-primary-foreground"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-gradient text-primary font-body font-semibold py-3 rounded-lg text-sm tracking-wider uppercase hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
          <p className="text-center text-sm text-primary-foreground/50 font-body">
            {isSignUp ? "Already have an account?" : "Need an account?"}{" "}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-gold hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>

        <a href="/" className="block text-center mt-6 text-primary-foreground/30 text-sm font-body hover:text-gold transition-colors">
          ← Back to website
        </a>
      </div>
    </div>
  );
};

export default AdminLogin;

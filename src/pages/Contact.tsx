import { useState } from "react";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
    setName(""); setEmail(""); setMessage("");
  };

  return (
    <div className="bg-background min-h-screen">
      <PublicNavbar />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Get in Touch</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground">Contact Us</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="space-y-8">
              <div>
                <h3 className="font-display text-2xl font-semibold text-foreground mb-6">Hotel Information</h3>
                <div className="space-y-5">
                  {[
                    { icon: MapPin, label: "Address", value: "123 Luxury Avenue, Manhattan, NY 10001" },
                    { icon: Phone, label: "Phone", value: "+1 (555) 123-4567" },
                    { icon: Mail, label: "Email", value: "info@grandeurhotel.com" },
                    { icon: Clock, label: "Front Desk", value: "24/7" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                        <item.icon className="text-gold" size={18} />
                      </div>
                      <div>
                        <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
                        <p className="font-body text-sm text-muted-foreground">{item.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="glass-card rounded-xl p-8 space-y-5">
              <div>
                <Label className="font-body text-sm">Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="font-body text-sm">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
              </div>
              <div>
                <Label className="font-body text-sm">Message</Label>
                <Textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-1.5" />
              </div>
              <button
                type="submit"
                className="w-full gold-gradient text-primary font-body font-semibold py-3 rounded-lg text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <PublicFooter />
    </div>
  );
};

export default Contact;

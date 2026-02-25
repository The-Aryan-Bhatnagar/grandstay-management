import { Link } from "react-router-dom";
import PublicNavbar from "@/components/PublicNavbar";
import PublicFooter from "@/components/PublicFooter";
import heroImg from "@/assets/hero-hotel.jpg";
import roomDeluxe from "@/assets/room-deluxe.jpg";
import roomSuite from "@/assets/room-suite.jpg";
import roomStandard from "@/assets/room-standard.jpg";
import { Wifi, Waves, UtensilsCrossed, Car, Snowflake, Star, Quote } from "lucide-react";

const featuredRooms = [
  { name: "Standard Room", price: 150, image: roomStandard, type: "Standard" },
  { name: "Deluxe Room", price: 280, image: roomDeluxe, type: "Deluxe" },
  { name: "Presidential Suite", price: 550, image: roomSuite, type: "Suite" },
];

const amenities = [
  { icon: Wifi, label: "Free WiFi", desc: "High-speed internet" },
  { icon: Waves, label: "Swimming Pool", desc: "Infinity rooftop pool" },
  { icon: UtensilsCrossed, label: "Restaurant", desc: "Fine dining cuisine" },
  { icon: Car, label: "Valet Parking", desc: "Complimentary service" },
  { icon: Snowflake, label: "AC Rooms", desc: "Climate controlled" },
  { icon: Star, label: "Concierge", desc: "24/7 personal service" },
];

const testimonials = [
  { name: "Emily R.", text: "An absolutely breathtaking experience. The attention to detail is unmatched.", rating: 5 },
  { name: "James M.", text: "World-class service and stunning rooms. We'll definitely be back.", rating: 5 },
  { name: "Sofia L.", text: "The presidential suite exceeded every expectation. Pure luxury.", rating: 5 },
];

const Index = () => {
  return (
    <div className="bg-background">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroImg} alt="Grandeur Hotel Lobby" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <p className="animate-fade-up text-gold tracking-[0.4em] text-sm font-body mb-6 uppercase">
            Welcome to
          </p>
          <h1 className="animate-fade-up-delay font-display text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            Grandeur <span className="gold-text">Hotel</span>
          </h1>
          <p className="animate-fade-up-delay-2 text-primary-foreground/70 font-body text-lg md:text-xl mb-10 font-light leading-relaxed">
            Where timeless elegance meets modern luxury. Experience the art of hospitality.
          </p>
          <Link
            to="/booking"
            className="animate-fade-up-delay-2 inline-block gold-gradient text-primary font-body font-semibold px-10 py-4 rounded-lg text-sm tracking-wider uppercase hover:opacity-90 transition-opacity"
          >
            Book Your Stay
          </Link>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Accommodations</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Our Finest Rooms</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div key={room.name} className="glass-card rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-500">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 gold-gradient text-primary text-xs font-body font-semibold px-3 py-1 rounded-full">
                    {room.type}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{room.name}</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-gold text-2xl font-display font-bold">${room.price}</span>
                    <span className="text-muted-foreground text-sm font-body">/ night</span>
                  </div>
                  <Link
                    to="/rooms"
                    className="block text-center border border-gold text-gold hover:bg-gold hover:text-primary font-body text-sm py-2.5 rounded-lg transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="py-24 px-4 bg-primary">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Services</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">Hotel Amenities</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {amenities.map((a) => (
              <div key={a.label} className="text-center group">
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-sidebar-accent flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                  <a.icon className="text-gold" size={28} />
                </div>
                <h4 className="font-body text-sm font-medium text-primary-foreground mb-1">{a.label}</h4>
                <p className="text-xs text-primary-foreground/50 font-body">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-sm tracking-[0.3em] uppercase font-body mb-3">Testimonials</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">Guest Experiences</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-xl p-8 relative">
                <Quote className="text-gold/20 absolute top-6 right-6" size={40} />
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="text-gold fill-gold" size={16} />
                  ))}
                </div>
                <p className="font-body text-muted-foreground text-sm leading-relaxed mb-6">"{t.text}"</p>
                <p className="font-display font-semibold text-foreground">{t.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
};

export default Index;

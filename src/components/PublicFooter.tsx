import { MapPin, Phone, Mail } from "lucide-react";

const PublicFooter = () => (
  <footer className="bg-primary text-primary-foreground/70">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h3 className="font-display text-2xl font-bold mb-4">
            <span className="gold-text">GRANDEUR</span>
          </h3>
          <p className="text-sm leading-relaxed">
            Experience unparalleled luxury and world-class hospitality at Grandeur Hotel. Your comfort is our priority.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Contact</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-gold shrink-0" />
              <span>123 Luxury Avenue, Manhattan, NY 10001</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-gold shrink-0" />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gold shrink-0" />
              <span>info@grandeurhotel.com</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-display text-lg font-semibold text-primary-foreground mb-4">Quick Links</h4>
          <div className="space-y-2 text-sm">
            <a href="/rooms" className="block hover:text-gold transition-colors">Our Rooms</a>
            <a href="/booking" className="block hover:text-gold transition-colors">Reservations</a>
            <a href="/contact" className="block hover:text-gold transition-colors">Contact Us</a>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-xs text-primary-foreground/40">
        © 2026 Grandeur Hotel. All rights reserved.
      </div>
    </div>
  </footer>
);

export default PublicFooter;

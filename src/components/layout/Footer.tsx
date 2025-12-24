import { Link } from 'react-router-dom';
import { Milk, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2" title="Go to Home Page">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Milk className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg">KHAIRAWANG</h3>
                <p className="text-xs text-muted-foreground">DAIRY</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground">
              Bringing farm-fresh dairy products to your doorstep since 2019. 
              Quality you can trust, taste you'll love.
            </p>
            <div className="flex items-center gap-4">
              <a href="https://www.facebook.com/kiram.079/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Follow us on Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/kiranolichhetri07/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Follow us on Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://x.com/KiranOli07" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Follow us on X (Twitter)">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'Products', 'About', 'Contact'].map((link) => (
                <li key={link}>
                  <Link
                    to={link === 'Home' ? '/' : `/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Categories</h4>
            <ul className="space-y-2">
              {['Fresh Milk', 'Curd & Yogurt', 'Paneer', 'Butter & Ghee', 'Cheese', 'Sweets'].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat.toLowerCase().replace(' & ', '-').replace(' ', '-')}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">
                  Tejnagar, District Banke,<br />Lumbini - 21900
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <a href="tel:+9779876543210" className="text-sm text-muted-foreground hover:text-primary transition-colors" title="Call Khairawang Dairy">
                  +977 9876543210
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <a href="mailto:info@khairawangdairy.com" className="text-sm text-muted-foreground hover:text-primary transition-colors" title="Email Khairawang Dairy">
                  info@khairawangdairy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-muted-foreground/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Khairawang Dairy. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors" title="Privacy Policy">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors" title="Terms and Conditions">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

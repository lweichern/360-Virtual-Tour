import Link from "next/link";
import { COMPANY, NAV_LINKS } from "@/lib/constants";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold tracking-tight">
              <span className="gradient-text">Immersive</span>
              <span className="text-foreground">Space</span>
            </Link>
            <p className="mt-4 text-foreground-muted text-sm leading-relaxed">
              Professional 360 virtual tour services for property developers and
              real estate agents. We bring your properties to life.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground-muted text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-3 text-foreground-muted text-sm">
              <li>360 Virtual Tours</li>
              <li>360 Photography</li>
              <li>Drone Aerial Shots</li>
              <li>Floor Plan Generation</li>
              <li>Video Walkthroughs</li>
              <li>Virtual Staging</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-foreground-muted text-sm">
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-0.5 shrink-0 text-accent-purple" />
                {COMPANY.email}
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-0.5 shrink-0 text-accent-purple" />
                {COMPANY.phone}
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-accent-purple" />
                {COMPANY.address}
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-foreground-muted text-sm">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights
            reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/faq"
              className="text-foreground-muted text-sm hover:text-white transition-colors"
            >
              FAQ
            </Link>
            <span className="text-foreground-muted text-sm">
              Privacy Policy
            </span>
            <span className="text-foreground-muted text-sm">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

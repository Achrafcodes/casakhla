import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';
import logo from 'figma:asset/7c6c2fad212f774214e6ed970c475f3b61a0dd75.png';

export function Footer() {
  return (
    <footer className="bg-white border-t border-black/10 py-12 sm:py-16">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <img src={logo} alt="CASAKA7LA" className="h-10 sm:h-12 w-auto" />
            <p className="text-gray-600 text-sm leading-relaxed max-w-xs">
              Contemporary fashion for the modern individual. Redefining luxury through
              minimalist design.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 sm:mb-6">Shop</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  New Arrivals
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Collections
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Sale
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Gift Cards
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 sm:mb-6">Company</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  About Us
                </a>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm uppercase tracking-wider mb-4 sm:mb-6">Support</h3>
            <ul className="space-y-2 sm:space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  Size Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-black transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6">
          <div className="text-xs sm:text-sm text-gray-500 text-center md:text-left">
            © 2026 CASAKA7LA. All rights reserved.
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            <a
              href="#"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-gray-600 hover:text-black transition-colors"
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>

          {/* Legal */}
          <div className="flex items-center gap-4 sm:gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-black transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
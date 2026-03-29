import React from 'react'

import { ShoppingCart, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-pink-500">Haatix</span>
            </div>
            <p className="text-slate-400 text-sm">
              Powering Your World with the Best in Electronics.
            </p>
            <div className="text-slate-400 text-sm space-y-1">
              <p>123 Bah, Agra 283104</p>
              <p>Email: ankit2300320@gmail.com</p>
              <p>Phone: +91 8791143749</p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Customer Service</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Order Tracking
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay in the Loop</h3>
            <p className="text-slate-400 text-sm">
              Subscribe to get special offers, free giveaways, and more
            </p>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your email address"
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
              <Button className="bg-pink-500 hover:bg-pink-600 text-white px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 py-4">
        <p className="text-center text-slate-400 text-sm">
          © 2026 <span className="text-pink-500">Haatix</span>. All rights reserved
        </p>
        <div className="text-center text-slate-400 text-sm mt-2">
          <p>Made with ❤️ in India by Ankit Sharma</p>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
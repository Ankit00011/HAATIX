import React from "react";
import { Facebook, Instagram, Send, Store, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="container-page py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950">
                <Store className="h-5 w-5" />
              </span>
              <span className="text-2xl font-black tracking-tight">HAATIX</span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-400">
              Powering your world with curated electronics, secure checkout, and reliable service.
            </p>
            <div className="space-y-1 text-sm text-slate-400">
              <p>123 Bah, Agra 283104</p>
              <p>Email: ankit2300320@gmail.com</p>
              <p>Phone: +91 8791143749</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Customer Service</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              {["Contact Us", "Shipping & Returns", "FAQs", "Order Tracking", "Size Guide"].map((item) => (
                <li key={item}>
                  <a href="#" className="transition-colors hover:text-white">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Follow Us</h3>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-slate-300 transition hover:-translate-y-0.5 hover:bg-white hover:text-slate-950">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Stay in the Loop</h3>
            <p className="text-sm leading-6 text-slate-400">
              Subscribe for special offers, free giveaways, and new arrivals.
            </p>
            <div className="flex gap-2">
              <Input type="email" placeholder="Your email address" className="h-11 rounded-full border-white/10 bg-white/10 text-white placeholder:text-slate-500" />
              <Button className="h-11 rounded-full bg-white px-5 text-slate-950 hover:bg-slate-200">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-sm text-slate-500">
          Copyright 2026 Haatix. All rights reserved. Made in India by Ankit Sharma.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

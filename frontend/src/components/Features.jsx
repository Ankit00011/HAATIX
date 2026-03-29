import React from 'react'
import { Truck, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

const Features = () => {
  return (
    <section className="w-full border-y border-border bg-background py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-4"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full ${feature.bgColor}`}
              >
                <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

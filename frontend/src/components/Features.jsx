import React from 'react'
import { Truck, Shield, Headphones } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over Rs. 299",
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
    <section className="w-full bg-white py-8 dark:bg-background">
      <div className="container-page">
        <div className="grid gap-4 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="soft-panel flex items-center gap-4 p-5 focus-lift"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${feature.bgColor}`}
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

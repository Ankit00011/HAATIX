import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addAddress, deleteAddress, setCart, setSelectedAddress } from "@/redux/productSlice";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api, getAuthConfig } from "@/lib/api";
import OrderSummaryCard from "@/components/OrderSummaryCard";

const AddressForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });
  const { cart, addresses, selectedAddress } = useSelector((store) => store.product);
  const [showForm, setShowForm] = useState(addresses?.length > 0 ? false : true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const loadRazorpayScript = () => {
    if (window.Razorpay) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK."));
      document.body.appendChild(script);
    });
  };

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 50;
  const tax = parseFloat((subtotal * 0.18).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  const handlePayment = async () => {
    try {
      await loadRazorpayScript();
      const { data } = await api.post(
        "/order/create-order",
        {
          products: cart?.items?.map((item) => ({
            productId: item.productId._id,
            quantity: item.quantity,
          })),
          amount: Math.round(total * 100) / 100,
          tax,
          shipping,
          currency: "INR",
        },
        getAuthConfig()
      );

      if (!data.success) return toast.error("Failed to create order. Please try again.");

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: data.order.currency,
        order_id: data.order.id,
        name: "Haatix E-commerce",
        description: "Test Transaction",
        handler: async function (response) {
          try {
            const verifyRes = await api.post("/order/verify-payment", response, getAuthConfig());
            if (verifyRes.data.success) {
              toast.success("Payment successful! Order placed.");
              dispatch(setCart({ items: [], totalPrice: 0 }));
              navigate("/order-success");
            } else {
              toast.error("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error in payment handler:", error);
            toast.error("An error occurred during payment verification. Please contact support.");
          }
        },
        modal: {
          ondismiss: async function () {
            await api.post(
              "/order/verify-payment",
              {
                paymentFailed: true,
                razorpay_order_id: data.order.id,
              },
              getAuthConfig()
            );
            toast.error("Payment cancelled");
          },
        },
        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#F472B6",
        },
      };
      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", async function () {
        try {
          await api.post(
            "/order/verify-payment",
            {
              paymentFailed: true,
              razorpay_order_id: data.order.id,
            },
            getAuthConfig()
          );
          toast.error("Payment failed. Please try again.");
        } catch (error) {
          console.error("Error in payment failed handler:", error);
          toast.error("An error occurred while processing payment failure. Please contact support.");
        }
      });
      rzp.open();
    } catch (error) {
      console.error("Error in handle payment:", error);
      toast.error("An error occurred while processing payment. Please try again.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 dark:bg-background">
      <div className="container-page">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-600">Checkout</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl dark:text-white">Delivery details</h1>
        </div>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_24rem]">
        <div className="premium-card space-y-4 p-5 sm:p-6">
          {showForm ? (
            <>
              <div className="grid gap-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required placeholder="John Doe" value={formData.fullName} onChange={handleChange} className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required placeholder="+91 987654321" value={formData.phone} onChange={handleChange} className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} className="h-11 rounded-xl" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required placeholder="123 Street, Area" value={formData.address} onChange={handleChange} className="h-11 rounded-xl" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required placeholder="Agra" value={formData.city} onChange={handleChange} className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" required placeholder="Uttar Pradesh" value={formData.state} onChange={handleChange} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input id="zip" name="zip" required placeholder="201009" value={formData.zip} onChange={handleChange} className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" required placeholder="India" value={formData.country} onChange={handleChange} className="h-11 rounded-xl" />
                </div>
              </div>
              <Button onClick={handleSave} className="h-11 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">Save & Continue</Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-950 dark:text-white">Saved Addresses</h2>
              {addresses.map((addr, index) => (
                <div
                  onClick={() => dispatch(setSelectedAddress(index))}
                  key={index}
                  className={`relative cursor-pointer rounded-2xl border p-4 transition ${selectedAddress === index ? "border-slate-950 bg-slate-50 shadow-sm dark:border-white dark:bg-muted/40" : "border-border hover:border-slate-300"}`}
                >
                  <p className="font-medium">{addr.fullName}</p>
                  <p>{addr.phone}</p>
                  <p>{addr.email}</p>
                  <p>{addr.address},{addr.city},{addr.state},{addr.zip},{addr.country}</p>
                  <button onClick={() => dispatch(deleteAddress(index))} className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-sm">
                    Delete
                  </button>
                </div>
              ))}

              <Button variant="outline" className="h-11 w-full rounded-full bg-transparent" onClick={() => setShowForm(true)}>+ Add New Address</Button>
              <Button disabled={selectedAddress === null} onClick={handlePayment} className="h-11 w-full rounded-full bg-slate-950 text-white hover:bg-slate-800">Proceed To Checkout</Button>
            </div>
          )}
        </div>

        <OrderSummaryCard itemCount={cart?.items?.length} subtotal={subtotal} shipping={shipping} tax={tax} total={total} />
      </div>
      </div>
    </main>
  );
};

export default AddressForm;

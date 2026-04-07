import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { addAddress, deleteAddress, setCart, setSelectedAddress } from "@/redux/productSlice";
import { Label } from "@radix-ui/react-label";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { api, getAuthConfig } from "@/lib/api";

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

  const handleSave = () => {
    dispatch(addAddress(formData));
    setShowForm(false);
  };

  const subtotal = cart.totalPrice;
  const shipping = subtotal > 299 ? 0 : 50;
  const tax = parseFloat((subtotal * 0.18).toFixed(2));
  const total = parseFloat((subtotal + shipping + tax).toFixed(2));

  const handlePayment = async () => {
    try {
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
    <div className="max-w-7xl mx-auto grid place-items-center p-10">
      <div className="grid grid-cols-2 items-start gap-20 mt-10 max-w-7xl mx-auto">
        <div className="space-y-4 p-6 bg-white">
          {showForm ? (
            <>
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" name="fullName" required placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" required placeholder="+91 987654321" value={formData.phone} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" required placeholder="john@example.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input id="address" name="address" required placeholder="123 Street, Area" value={formData.address} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" name="city" required placeholder="Agra" value={formData.city} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" required placeholder="Uttar Pradesh" value={formData.state} onChange={handleChange} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="zip">Zip Code</Label>
                  <Input id="zip" name="zip" required placeholder="201009" value={formData.zip} onChange={handleChange} />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input id="country" name="country" required placeholder="India" value={formData.country} onChange={handleChange} />
                </div>
              </div>
              <Button onClick={handleSave} className="w-full">Save & Continue</Button>
            </>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Saved Addresses</h2>
              {addresses.map((addr, index) => (
                <div
                  onClick={() => dispatch(setSelectedAddress(index))}
                  key={index}
                  className={`border p-4 rounded-md cursor-pointer relative ${selectedAddress === index ? "border-pink-600 bg-pink-50" : "border-gray-300"}`}
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

              <Button variant="outline" className="w-full" onClick={() => setShowForm(true)}>+ Add New Address</Button>
              <Button disabled={selectedAddress === null} onClick={handlePayment} className="w-full bg-pink-600">Proceed To Checkout</Button>
            </div>
          )}
        </div>

        <div>
          <Card className="w-[400px]">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between ">
                <span>Subtotal ({cart?.items?.length} items)</span>
                <span>Rs. {subtotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between ">
                <span>Shipping</span>
                <span>Rs. {shipping}</span>
              </div>
              <div className="flex justify-between ">
                <span>Tax(18%)</span>
                <span>Rs. {tax}</span>
              </div>
              <Separator />
              <div className="flex justify-between ">
                <span>Total</span>
                <span>Rs. {total}</span>
              </div>
              <div className="text-sm text-muted-foreground pt-4">
                <p>* Free shipping on orders over Rs. 299</p>
                <p>* Returns and exchanges available</p>
                <p>* Secure checkout with multiple payment options</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;

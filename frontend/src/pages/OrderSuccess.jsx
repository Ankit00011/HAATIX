import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.user);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-background">
      <div className="premium-card w-full max-w-md p-8 text-center sm:p-10">
        <div className="flex justify-center">
          <CheckCircle className="h-20 w-20 text-emerald-500" />
        </div>

        <h1 className="mt-6 text-3xl font-black tracking-tight text-slate-950 dark:text-white">Payment Successful</h1>

        <p className="text-gray-600 mt-2">
          Thank you for your purchase! Your order has been placed successfully.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={() => navigate("/products")}
            className="w-full rounded-full bg-slate-950 py-3 text-white transition hover:bg-slate-800"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate(`/profile/${user?._id}?tab=orders`)}
            className="w-full rounded-full border border-slate-300 py-3 text-slate-950 transition hover:bg-slate-100 dark:text-white dark:hover:bg-white/10"
          >
            View My Orders
          </button>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;

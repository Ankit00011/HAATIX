import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice";
import { api } from "@/lib/api";

const Login = () => {
  const [showpassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/user/login", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.data.success) {
        navigate("/");
        dispatch(setUser(res.data.user));
        localStorage.setItem("accessToken", res.data.accessToken);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-background">
      <Card className="premium-card w-full max-w-md overflow-hidden">
        <CardHeader className="space-y-2 p-7">
          <CardTitle className="text-3xl font-black tracking-tight">Welcome back</CardTitle>
          <CardDescription>Sign in to continue shopping with Haatix.</CardDescription>
        </CardHeader>
        <CardContent className="px-7">
          <div className="flex flex-col gap-3">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required value={formData.email} onChange={handleChange} className="h-11 rounded-xl" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  placeholder="Enter a password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showpassword ? "text" : "password"}
                  required
                  className="h-11 rounded-xl pr-12"
                />
                {showpassword ? (
                  <EyeOff onClick={() => setShowPassword(false)} className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" />
                ) : (
                  <Eye onClick={() => setShowPassword(true)} className="w-5 h-5 text-gray-700 absolute right-5 bottom-2" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-3 p-7">
          <Button onClick={submitHandler} type="submit" className="h-11 w-full cursor-pointer rounded-full bg-slate-950 text-white hover:bg-slate-800">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Please wait</> : "Login"}
          </Button>
          <p className="text-gray-700 text-sm">
            {" "}Don&apos;t have an account?{" "}
            <Link to="/signup" className="cursor-pointer font-semibold text-pink-700 hover:underline">Signup</Link>
          </p>
        </CardFooter>
      </Card>
    </main>
  );
};

export default Login;

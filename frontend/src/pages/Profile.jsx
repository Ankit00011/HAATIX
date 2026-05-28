import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.png";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { api, getAuthConfig } from "@/lib/api";
import OrderHistory from "@/components/OrderHistory";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const params = useParams();
  const userId = params.userId;
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const [updateUser, setUpdateUser] = useState({});

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const getFieldValue = (field) => updateUser[field] ?? user?.[field] ?? (field === "role" ? "user" : "");

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstName", getFieldValue("firstName"));
      formData.append("lastName", getFieldValue("lastName"));
      formData.append("email", getFieldValue("email"));
      formData.append("phoneNo", getFieldValue("phoneNo"));
      formData.append("address", getFieldValue("address"));
      formData.append("city", getFieldValue("city"));
      formData.append("zipCode", getFieldValue("zipCode"));
      formData.append("role", getFieldValue("role"));

      if (file) {
        formData.append("file", file);
      }

      const authConfig = getAuthConfig();
      const res = await api.put(`/user/update/${userId}`, formData, {
        ...authConfig,
        headers: {
          ...authConfig.headers,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-14 pt-24 dark:bg-background">
      <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="container-page">
        <TabsList className="mx-auto grid w-full max-w-md grid-cols-2 rounded-full bg-white p-1 shadow-sm dark:bg-card">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="mt-8">
            <h1 className="mb-7 text-center text-3xl font-black tracking-tight text-slate-950 dark:text-white">Update Profile</h1>
            <div className="mx-auto grid w-full max-w-4xl gap-8 lg:grid-cols-[14rem_1fr]">
              <div className="premium-card flex flex-col items-center p-6">
                <img src={getFieldValue("profilePic") || userLogo} alt="" className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-xl" />
                <Label className="mt-4 cursor-pointer rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
                  Change Picture
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </Label>
              </div>
              <form onSubmit={handleSubmit} className="premium-card space-y-4 p-5 sm:p-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="block text-sm font-medium">First Name</Label>
                    <Input type="text" name="firstName" placeholder="John" value={getFieldValue("firstName")} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Last Name</Label>
                    <Input type="text" name="lastName" placeholder="Doe" value={getFieldValue("lastName")} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <Input type="email" name="email" disabled value={getFieldValue("email")} onChange={handleChange} className="mt-1 cursor-not-allowed bg-gray-100" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Phone Number</Label>
                  <Input type="text" name="phoneNo" placeholder="Enter Your Contact No." value={getFieldValue("phoneNo")} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Address</Label>
                  <Input type="text" name="address" placeholder="Enter Your Address" value={getFieldValue("address")} onChange={handleChange} className="mt-1" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <Input type="text" name="city" placeholder="Enter Your City" value={getFieldValue("city")} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Zip Code</Label>
                    <Input type="text" name="zipCode" placeholder="Enter Your ZipCode" value={getFieldValue("zipCode")} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
                <Button type="submit" className="mt-4 h-11 w-full rounded-full bg-slate-950 font-semibold text-white hover:bg-slate-800">
                  Update Profile
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <OrderHistory />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Profile;

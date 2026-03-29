import React, { useEffect, useState } from "react";
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
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
    profilePic: user?.profilePic || "",
    role: user?.role || "user",
  });

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    setUpdateUser({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phoneNo: user?.phoneNo || "",
      address: user?.address || "",
      city: user?.city || "",
      zipCode: user?.zipCode || "",
      profilePic: user?.profilePic || "",
      role: user?.role || "user",
    });
  }, [user]);

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
      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

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
    <div className="min-h-screen bg-gray-100 pt-20">
      <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })} className="mx-auto max-w-7xl items-center">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div className="flex flex-col items-center justify-center bg-gray-100">
            <h1 className="mb-7 text-2xl font-bold text-gray-800">Update Profile</h1>
            <div className="flex w-full max-w-2xl flex-col items-start justify-between gap-10 px-7 lg:flex-row">
              <div className="flex flex-col items-center">
                <img src={updateUser?.profilePic || userLogo} alt="" className="h-32 w-32 rounded-full border-4 border-pink-800 object-cover" />
                <Label className="mt-4 cursor-pointer rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700">
                  Change Picture
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </Label>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-5 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">First Name</Label>
                    <Input type="text" name="firstName" placeholder="John" value={updateUser.firstName} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Last Name</Label>
                    <Input type="text" name="lastName" placeholder="Doe" value={updateUser.lastName} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <Input type="email" name="email" disabled value={updateUser.email} onChange={handleChange} className="mt-1 cursor-not-allowed bg-gray-100" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Phone Number</Label>
                  <Input type="text" name="phoneNo" placeholder="Enter Your Contact No." value={updateUser.phoneNo} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Address</Label>
                  <Input type="text" name="address" placeholder="Enter Your Address" value={updateUser.address} onChange={handleChange} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <Input type="text" name="city" placeholder="Enter Your City" value={updateUser.city} onChange={handleChange} className="mt-1" />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Zip Code</Label>
                    <Input type="text" name="zipCode" placeholder="Enter Your ZipCode" value={updateUser.zipCode} onChange={handleChange} className="mt-1" />
                  </div>
                </div>
                <Button type="submit" className="mt-4 w-full rounded-lg bg-pink-600 py-2 font-semibold text-white hover:bg-pink-700">
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
    </div>
  );
};

export default Profile;

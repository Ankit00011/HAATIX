import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import userLogo from "../../assets/user.png";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { api, getAuthConfig } from "@/lib/api";

const UserInfo = () => {
  const navigate = useNavigate();
  const [updateUser, setUpdateUser] = useState({});
  const [file, setFile] = useState(null);
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();

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
        if (updateUser._id === userId) {
          dispatch(setUser(res.data.user));
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile");
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await api.get(`/user/get-user/${userId}`);
      if (res.data.success) {
        setUpdateUser(res.data.user);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to load user details");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
          <div className="mb-6 flex items-center justify-between gap-10">
            <Button onClick={() => navigate(-1)}><ArrowLeft /></Button>
            <h1 className="text-2xl font-bold text-gray-800">Update Profile</h1>
          </div>
          <div className="flex w-full max-w-2xl flex-col items-start justify-between gap-10 px-2 lg:flex-row">
            <div className="flex flex-col items-center">
              <img src={updateUser?.profilePic || userLogo} alt="" className="h-32 w-32 rounded-full border-4 border-pink-800 object-cover" />
              <Label className="mt-4 cursor-pointer rounded-lg bg-pink-600 px-4 py-2 text-white hover:bg-pink-700">
                Change Picture
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </Label>
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-4 rounded-lg bg-white p-5 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">First Name</Label>
                  <Input type="text" name="firstName" placeholder="John" value={updateUser?.firstName || ""} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Last Name</Label>
                  <Input type="text" name="lastName" placeholder="Doe" value={updateUser?.lastName || ""} onChange={handleChange} className="mt-1" />
                </div>
              </div>
              <div>
                <Label className="block text-sm font-medium">Email</Label>
                <Input type="email" name="email" disabled value={updateUser?.email || ""} onChange={handleChange} className="mt-1 cursor-not-allowed bg-gray-100" />
              </div>
              <div>
                <Label className="block text-sm font-medium">Phone Number</Label>
                <Input type="text" name="phoneNo" placeholder="Enter contact no." value={updateUser?.phoneNo || ""} onChange={handleChange} className="mt-1" />
              </div>
              <div>
                <Label className="block text-sm font-medium">Address</Label>
                <Input type="text" name="address" placeholder="Enter address" value={updateUser?.address || ""} onChange={handleChange} className="mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium">City</Label>
                  <Input type="text" name="city" placeholder="Enter city" value={updateUser?.city || ""} onChange={handleChange} className="mt-1" />
                </div>
                <div>
                  <Label className="block text-sm font-medium">Zip Code</Label>
                  <Input type="text" name="zipCode" placeholder="Enter zip code" value={updateUser?.zipCode || ""} onChange={handleChange} className="mt-1" />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Label className="block text-sm font-medium">Role :</Label>
                <RadioGroup value={updateUser?.role || ""} onValueChange={(value) => setUpdateUser({ ...updateUser, role: value })} className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="user" id="user" />
                    <Label htmlFor="user">User</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Admin</Label>
                  </div>
                </RadioGroup>
              </div>
              <Button type="submit" className="mt-4 w-full rounded-lg bg-pink-600 py-2 font-semibold text-white hover:bg-pink-700">
                Update Profile
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;

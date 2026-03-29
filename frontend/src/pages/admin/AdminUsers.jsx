import { Input } from "@/components/ui/input";
import { Edit, Eye, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserLogo from "../../assets/user.png";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { api, getAuthConfig } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const getAllUsers = async () => {
    try {
      const res = await api.get("/user/all-user", getAuthConfig());
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error fetching users");
    }
  };

  const filteredUsers = users.filter((user) =>
    [user.firstName, user.lastName, user.email].join(" ").toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="min-h-screen px-4 pb-10 pt-24 md:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-950">User Management</h1>
        <p className="mt-2 text-sm text-slate-600">View account details, update user roles, and inspect customer order history.</p>
        <div className="relative mt-6 w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search users..." className="pl-10" />
        </div>
        <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <Card key={user._id} className="overflow-hidden border-white/70 bg-white/95 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
              <CardContent className="p-5">
                <div className="rounded-3xl bg-[linear-gradient(135deg,#fff1f2_0%,#fff7ed_100%)] p-5">
                  <div className="flex items-center gap-3">
                    <img src={user?.profilePic || UserLogo} alt="" className="aspect-square w-16 rounded-full border border-rose-200 object-cover" />
                    <div>
                      <h2 className="font-semibold text-slate-950">{user?.firstName} {user?.lastName}</h2>
                      <p className="text-sm text-slate-600">{user?.email}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-rose-400">{user?.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-2">
                    <p className="text-sm text-slate-600">Phone: {user?.phoneNo || "Not added"}</p>
                    <p className="text-sm text-slate-600">City: {user?.city || "Not added"}</p>
                  </div>
                  <div className="mt-5 flex gap-3">
                    <Button onClick={() => navigate(`/dashboard/users/${user?._id}`)} variant="outline">
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Button>
                    <Button onClick={() => navigate(`/dashboard/users/orders/${user?._id}`)} className="bg-slate-950 text-white hover:bg-slate-800">
                      <Eye />
                      Show Orders
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tw } from "../twind";

export interface User {
  name: string;
  email: string;
  phone: string;
  category: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingEmail, setEditingEmail] = useState<string | null>(null);
  const [editData, setEditData] = useState<User | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      setUsers(res.data.users || []);
      setFilteredUsers(res.data.users || []);
    } catch {
      toast.error("Failed to fetch users", { position: "top-center" });
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEdit = (user: User) => { setEditingEmail(user.email); setEditData({ ...user }); };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editData || !editingEmail) return;
    try {
      const res = await axios.post("/api/users", { action: "update", data: { oldEmail: editingEmail, newData: editData } });
      if (!res.data.success) return toast.error(res.data.message, { position: "top-center" });
      toast.success(res.data.message, { position: "top-center" });
      setEditingEmail(null); setEditData(null); fetchUsers();
    } catch { toast.error("Failed to update user", { position: "top-center" }); }
  };

  const handleDelete = async (email: string) => {
    try {
      const res = await axios.post("/api/users", { action: "delete", data: { email } });
      if (res.data.success) { toast.success(res.data.message, { position: "top-center" }); fetchUsers(); }
      else toast.error(res.data.message, { position: "top-center" });
    } catch { toast.error("Failed to delete user", { position: "top-center" }); }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all users?")) return;
    try {
      const res = await axios.post("/api/users", { action: "deleteAll" });
      if (res.data.success) { toast.success(res.data.message, { position: "top-center" }); fetchUsers(); }
      else toast.error(res.data.message, { position: "top-center" });
    } catch { toast.error("Failed to delete all users", { position: "top-center" }); }
  };

  const handleSearchByName = () => setFilteredUsers(searchName.trim() ? users.filter(u => u.name.toLowerCase().includes(searchName.toLowerCase())) : users);
  const handleSearchByCategory = () => setFilteredUsers(searchCategory ? users.filter(u => u.category.toLowerCase() === searchCategory.toLowerCase()) : users);

  return (
    <div className={tw`max-w-3xl mx-auto mt-10 p-4`}>
      <ToastContainer />
      <h2 className={tw`text-2xl font-bold mb-5 text-center`}>Users List</h2>

      <div className={tw`flex flex-wrap gap-2 mb-6`}>
        <input type="text" placeholder="Search by name" value={searchName} onChange={e => setSearchName(e.target.value)} className={tw`border p-2 rounded flex-grow`} />
        <button onClick={handleSearchByName} className={tw`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors`}>Search Name</button>

        <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)} className={tw`border p-2 rounded`}>
          <option value="">All Categories</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="developer">Developer</option>
        </select>
        <button onClick={handleSearchByCategory} className={tw`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors`}>Search Category</button>

        <button onClick={handleDeleteAll} className={tw`bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors`}>Delete All</button>
      </div>

      <table className={tw`w-full border-collapse border`}>
        <thead>
          <tr className={tw`bg-gray-200`}>
            <th className={tw`border p-2`}>Name</th>
            <th className={tw`border p-2`}>Email</th>
            <th className={tw`border p-2`}>Phone</th>
            <th className={tw`border p-2`}>Category</th>
            <th className={tw`border p-2`}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length > 0 ? filteredUsers.map(user => (
            <tr key={user.email}>
              <td className={tw`border p-2`}>{editingEmail === user.email ? <input name="name" value={editData?.name} onChange={handleChange} className={tw`border p-1 rounded w-full`} /> : user.name}</td>
              <td className={tw`border p-2`}>{editingEmail === user.email ? <input name="email" value={editData?.email} onChange={handleChange} className={tw`border p-1 rounded w-full`} /> : user.email}</td>
              <td className={tw`border p-2`}>{editingEmail === user.email ? <input name="phone" value={editData?.phone} onChange={handleChange} className={tw`border p-1 rounded w-full`} /> : user.phone}</td>
              <td className={tw`border p-2`}>{editingEmail === user.email ? <select name="category" value={editData?.category} onChange={handleChange} className={tw`border p-1 rounded w-full`}><option value="student">Student</option><option value="teacher">Teacher</option><option value="developer">Developer</option></select> : user.category}</td>
              <td className={tw`border p-2 flex gap-2`}>
                {editingEmail === user.email ? <button onClick={handleSave} className={tw`bg-green-500 text-white p-1 rounded hover:bg-green-600 transition-colors`}>Save</button> :
                  <button onClick={() => handleEdit(user)} className={tw`bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600 transition-colors`}>Edit</button>}
                <button onClick={() => handleDelete(user.email)} className={tw`bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors`}>Delete</button>
              </td>
            </tr>
          )) : <tr><td colSpan={5} className={tw`text-center p-4`}>No users found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tw } from "../twind";

export interface User {
  id: number;
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

  const handleEdit = (user: User) => { 
    setEditingEmail(user.email); 
    setEditData({ ...user }); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editData || !editingEmail) return;

    try {
      const res = await axios.patch("/api/updataUsers", editData);

      if (!res.data.success)
        return toast.error(res.data.message, { position: "top-center" });

      toast.success(res.data.message, { position: "top-center" });

      setEditingEmail(null);
      setEditData(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to update user",
        { position: "top-center" }
      );
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const res = await axios.post("/api/users", { action: "delete", data: { email } });
      if (res.data.success) { 
        toast.success(res.data.message, { position: "top-center" }); 
        fetchUsers(); 
      } else toast.error(res.data.message, { position: "top-center" });
    } catch { toast.error("Failed to delete user", { position: "top-center" }); }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Are you sure you want to delete all users?")) return;
    try {
      const res = await axios.post("/api/users", { action: "deleteAll" });
      if (res.data.success) { 
        toast.success(res.data.message, { position: "top-center" }); 
        fetchUsers(); 
      }
      else toast.error(res.data.message, { position: "top-center" });
    } catch { toast.error("Failed to delete all users", { position: "top-center" }); }
  };

  const handleSearchByName = () =>
    setFilteredUsers(searchName.trim()
      ? users.filter(u => u.name.toLowerCase().includes(searchName.toLowerCase()))
      : users
    );

  const handleSearchByCategory = () =>
    setFilteredUsers(searchCategory
      ? users.filter(u => u.category.toLowerCase() === searchCategory.toLowerCase())
      : users
    );

  return (
    <div className={tw`min-h-screen bg-purple-50`}>

      <ToastContainer />
{/* ------------------------------------------------ */}
{/* SIDEBAR */}
{/* ------------------------------------------------ */}
<div className={tw`
  fixed left-0 top-0 w-64 h-full 
  bg-gradient-to-b from-purple-900 to-purple-700 
  text-white shadow-xl flex flex-col
`}>
  
  <div className={tw`py-6 px-6 border-b border-purple-600`}>
    <h1 className={tw`text-2xl font-bold`}>Control Panel</h1>
  </div>

  <nav className={tw`flex-1 px-4 py-6 space-y-3`}>
    
    <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>
      <span>🏠</span><span>Dashboard</span>
    </button>

    <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>
      <span>👥</span><span>Users Management</span>
    </button>

    <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>
      <span>📂</span><span>Categories</span>
    </button>

    <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>
      <span>⚙️</span><span>Settings</span>
    </button>

  </nav>

  <div className={tw`px-4 py-4 border-t border-purple-600`}>
    <button className={tw`flex items-center space-x-3 bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full text-left`}>
      <span>🚪</span><span>Logout</span>
    </button>
  </div>
</div>


      {/* ------------------------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------------------------ */}
      <header className={tw`
        fixed left-64 top-0 right-0 h-16 
        bg-white/90 backdrop-blur shadow 
        flex items-center justify-between px-6
      `}>
        
        <h1 className={tw`text-xl font-semibold text-purple-800`}>
          Users Management Panel
        </h1>

        <div className={tw`flex items-center space-x-6`}>
          <button className={tw`text-purple-800 text-xl relative`}>
            🔔
            <span className={tw`
              absolute -top-1 -right-1 w-3 h-3 
              bg-red-500 rounded-full
            `}></span>
          </button>

          <div className={tw`flex items-center space-x-3`}>
            <span className={tw`text-purple-900 font-semibold`}>Admin</span>
            <img src="https://i.pravatar.cc/35" className={tw`w-10 h-10 rounded-full border`} />
          </div>
        </div>
      </header>


      {/* ------------------------------------------------ */}
      {/* MAIN CONTENT */}
      {/* ------------------------------------------------ */}
      <div className={tw`ml-64 mt-20 p-6`}>

        {/* Control Panel */}
        <div className={tw`bg-white p-5 rounded-xl shadow mb-6`}>
          <h2 className={tw`text-xl font-bold mb-4 text-purple-800`}>Control Panel</h2>

          <div className={tw`flex flex-wrap gap-2`}>
            <input 
              type="text"
              placeholder="Search by name"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className={tw`border p-2 rounded flex-grow`}
            />

            <button 
              onClick={handleSearchByName}
              className={tw`bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition`}
            >
              Search Name
            </button>

            <select 
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className={tw`border p-2 rounded`}
            >
              <option value="">All Categories</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="developer">Developer</option>
            </select>

            <button 
              onClick={handleSearchByCategory}
              className={tw`bg-purple-700 text-white p-2 rounded hover:bg-purple-800 transition`}
            >
              Search Category
            </button>

            <button 
              onClick={handleDeleteAll}
              className={tw`bg-red-600 text-white p-2 rounded hover:bg-red-700 transition`}
            >
              Delete All
            </button>
          </div>
        </div>


        {/* ------------------------------------------------ */}
        {/* USERS TABLE — Modified & Darker */}
        {/* ------------------------------------------------ */}
        <table className={tw`
          w-full border-collapse bg-white 
          text-gray-900 rounded-xl overflow-hidden shadow-lg 
          border border-purple-300
        `}>
          <thead>
            <tr className={tw`bg-purple-200 text-purple-900`}>
              <th className={tw`border border-purple-300 p-3 font-semibold`}>Name</th>
              <th className={tw`border border-purple-300 p-3 font-semibold`}>Email</th>
              <th className={tw`border border-purple-300 p-3 font-semibold`}>Phone</th>
              <th className={tw`border border-purple-300 p-3 font-semibold`}>Category</th>
              <th className={tw`border border-purple-300 p-3 font-semibold`}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
              <tr key={index} className={tw`
                hover:bg-purple-100 transition bg-white
              `}>

                <td className={tw`border border-purple-200 p-2`}>
                  {editingEmail === user.email ? (
                    <input 
                      name="name" 
                      value={editData?.name}
                      onChange={handleChange}
                      className={tw`border p-1 rounded w-full`}
                    />
                  ) : user.name}
                </td>

                <td className={tw`border border-purple-200 p-2`}>
                  {editingEmail === user.email ? (
                    <input 
                      name="email" 
                      value={editData?.email}
                      onChange={handleChange}
                      className={tw`border p-1 rounded w-full`}
                    />
                  ) : user.email}
                </td>

                <td className={tw`border border-purple-200 p-2`}>
                  {editingEmail === user.email ? (
                    <input 
                      name="phone" 
                      value={editData?.phone}
                      onChange={handleChange}
                      className={tw`border p-1 rounded w-full`}
                    />
                  ) : user.phone}
                </td>

                <td className={tw`border border-purple-200 p-2`}>
                  {editingEmail === user.email ? (
                    <select 
                      name="category" 
                      value={editData?.category}
                      onChange={handleChange}
                      className={tw`border p-1 rounded w-full`}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="developer">Developer</option>
                    </select>
                  ) : user.category}
                </td>

                <td className={tw`border border-purple-200 p-2 flex gap-2`}>
                  {editingEmail === user.email ? (
                    <button 
                      onClick={handleSave}
                      className={tw`bg-green-600 text-white p-1 rounded hover:bg-green-700`}
                    >
                      Save
                    </button>
                  ) : (
                    <button 
                      onClick={() => handleEdit(user)}
                      className={tw`bg-yellow-500 text-white p-1 rounded hover:bg-yellow-600`}
                    >
                      Edit
                    </button>
                  )}

                  <button 
                    onClick={() => handleDelete(user.email)}
                    className={tw`bg-red-500 text-white p-1 rounded hover:bg-red-600`}
                  >
                    Delete
                  </button>
                </td>

              </tr>
            )) : (
              <tr>
                <td colSpan={5} className={tw`text-center p-4 text-gray-600`}>
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

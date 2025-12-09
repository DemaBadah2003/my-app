'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tw } from "../twind";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

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
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

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

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleEdit = (user: User) => { 
    setEditingEmail(user.email); 
    setEditData({ ...user }); 
    setActiveMenu(null);
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

  const handleSearch = () => {
    const filtered = users.filter((u) => {
      const matchesName = searchName.trim()
        ? u.name.toLowerCase().includes(searchName.toLowerCase())
        : true;

      const matchesCategory = searchCategory.trim()
        ? u.category.toLowerCase() === searchCategory.toLowerCase()
        : true;

      return matchesName && matchesCategory;
    });

    setFilteredUsers(filtered);
  };

  return (
    <div className={tw`min-h-screen bg-purple-50`}>
      <ToastContainer />

      {/* SIDEBAR */}
      <div className={tw
        `fixed top-0 left-0 h-full bg-gradient-to-b from-purple-900 to-purple-700 
        text-white shadow-xl flex flex-col w-64 
        transform transition-transform duration-300 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className={tw`py-6 px-6 border-b border-purple-600`}>
          <h1 className={tw`text-2xl font-bold`}>Control Panel</h1>
        </div>

        <nav className={tw`flex-1 px-4 py-6 space-y-3`}>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>🏠 Dashboard</button>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>👥 Users Management</button>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>📂 Categories</button>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>⚙️ Settings</button>
        </nav>

        <div className={tw`px-4 py-4 border-t border-purple-600`}>
          <button className={tw`flex items-center space-x-3 bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full text-left`}>🚪 Logout</button>
        </div>
      </div>

      {/* HEADER */}
      <header className={tw`header`}>
        <div className={tw`header-left`}>
          <button onClick={() => setShowSidebar(!showSidebar)}
            className={tw`lg:hidden p-2 bg-purple-700 text-white rounded`}>☰</button>
        </div>

        <h1 className={tw`header-title`}>Users Management Panel</h1>

        <div className={tw`header-right`}>
          <button className={tw`relative text-purple-800 text-xl`}>
            🔔
            <span className={tw`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full`}></span>
          </button>
          <span className={tw`hidden md:inline text-purple-900 font-semibold text-sm md:text-base`}>Admin</span>
          <img src="https://i.pravatar.cc/35" className={tw`w-8 h-8 md:w-10 md:h-10 rounded-full border`} />
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className={tw`ml-0 lg:ml-64 mt-20 p-3 md:p-6`}>

        {/* Control Panel */}
        <div className={tw`bg-white p-4 md:p-5 rounded-xl shadow mb-6 control-panel`}>
          <h2 className={tw`text-lg md:text-xl font-bold mb-3 text-purple-800`}>Control Panel</h2>
          <div className={tw`flex flex-wrap gap-2 sm:flex-row flex-col flex-wrap-on-mobile`}>
            <input 
              type="text"
              placeholder="Search"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className={tw`border p-2 md:p-2 rounded flex-grow text-sm md:text-base`}
            />
            <select 
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className={tw`border p-2 md:p-2 rounded text-sm md:text-base`}
            >
              <option value="">All Categories</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="developer">Developer</option>
            </select>
            <button onClick={handleSearch} className={tw`bg-purple-700 text-white p-2 md:p-2 rounded hover:bg-purple-800 transition text-sm md:text-base`}>
              Search
            </button>
            <button onClick={handleDeleteAll} className={tw`bg-red-600 text-white p-2 md:p-2 rounded hover:bg-red-700 transition text-sm md:text-base`}>
              Delete All
            </button>
          </div>
        </div>

        {/* USERS TABLE */}
        <div className={tw`w-full overflow-x-auto`}>
          <table className={tw`w-full table-auto border-collapse bg-white text-gray-900 rounded-xl shadow-lg border border-purple-300 mobile-table`}>
            <thead className={tw`bg-tableHeader text-purple-900`}>
              <tr>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold`}>Name</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold`}>Email</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold`}>Phone</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold`}>Category</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-center`}>Actions</th>
              </tr>
            </thead>
            <tbody className={tw`text-xs md:text-sm lg:text-base`}>
              {filteredUsers.length > 0 ? filteredUsers.map((user, index) => (
                <tr key={index} className={tw`hover:bg-hoverPurple transition bg-white`}>
                  <td className={tw`border border-purple-200 p-1 md:p-2 truncate`}>
                    {editingEmail === user.email ? (
                      <input name="name" value={editData?.name} onChange={handleChange} className={tw`border p-1 rounded w-full text-xs md:text-sm`} />
                    ) : user.name}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 truncate`}>
                    {editingEmail === user.email ? (
                      <input name="email" value={editData?.email} onChange={handleChange} className={tw`border p-1 rounded w-full text-xs md:text-sm`} />
                    ) : user.email}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 truncate`}>
                    {editingEmail === user.email ? (
                      <input name="phone" value={editData?.phone} onChange={handleChange} className={tw`border p-1 rounded w-full text-xs md:text-sm`} />
                    ) : user.phone}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 truncate`}>
                    {editingEmail === user.email ? (
                      <select name="category" value={editData?.category} onChange={handleChange} className={tw`border p-1 rounded w-full text-xs md:text-sm`}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="developer">Developer</option>
                      </select>
                    ) : user.category}
                  </td>

                  {/* تعديل الأزرار */}
            <td className={tw`border border-purple-200 p-1 md:p-2 flex justify-center items-center relative`}>
  {editingEmail === user.email ? (
    // زر الحفظ عند التحرير
    <button 
      onClick={handleSave} 
      className={tw`bg-green-600 text-white p-1 md:p-2 rounded`} 
      title="Save"
    >
      Save
    </button>
  ) : isMobile ? (
    <div className={tw`relative`}>
      {/* أيقونة النقاط الثلاث */}
      <button 
        onClick={() => setActiveMenu(activeMenu === user.id ? null : user.id)}
        className={tw`mobile-ellipsis-button`}
      >
        <FaEllipsisV />
      </button>

      {/* القائمة المنبثقة تظهر كلا الزرين */}
      {activeMenu === user.id && (
        <div className={tw`mobile-ellipsis-menu`}>
          <button 
            onClick={() => { handleEdit(user); setActiveMenu(null); }}
            className={tw`flex items-center gap-2`}
          >
            <FaEdit /> Edit
          </button>
          <button 
            onClick={() => { handleDelete(user.email); setActiveMenu(null); }}
            className={tw`flex items-center gap-2`}
          >
            <FaTrash /> Delete
          </button>
        </div>
      )}
    </div>
  ) : (
    <>
      {/* أزرار التعديل والحذف على الأجهزة الأكبر */}
      <button 
        onClick={() => handleEdit(user)} 
        className={tw`bg-yellow-500 text-white p-1 md:p-2 rounded hover:bg-yellow-600`} 
        title="Edit"
      >
        <FaEdit />
      </button>
      <button 
        onClick={() => handleDelete(user.email)} 
        className={tw`bg-red-500 text-white p-1 md:p-2 rounded hover:bg-red-600`} 
        title="Delete"
      >
        <FaTrash />
      </button>
    </>
  )}
</td>



                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={tw`text-center p-2 md:p-4 text-gray-600 text-xs md:text-sm`}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

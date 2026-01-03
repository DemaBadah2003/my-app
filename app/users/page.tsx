'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tw } from "../twind";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

export interface User {
  userId: number;
  name: string;
  email: string;
  phone: string;
  category: string;
}

type SidebarTab = "dashboard" | "users" | "categories" | "settings";

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

  const [activeTab, setActiveTab] = useState<SidebarTab>("users");
  
// ✅ لازم تكون موجودة
const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages) return;
  setCurrentPage(page);
};

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  /* ================= FETCH ================= */
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

  /* ================= ACTIONS ================= */
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
    if (!editData) return;
    try {
      const res = await axios.patch("/api/updataUsers", editData);
      if (!res.data.success)
        return toast.error(res.data.message, { position: "top-center" });

      toast.success(res.data.message, { position: "top-center" });
      setEditingEmail(null);
      setEditData(null);
      fetchUsers();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (email: string) => {
    try {
      const res = await axios.post("/api/users", {
        action: "delete",
        data: { email },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteAll = async () => {
    if (!confirm("Delete all users?")) return;
    try {
      const res = await axios.post("/api/users", { action: "deleteAll" });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
      }
    } catch {
      toast.error("Delete all failed");
    }
  };
  {/* Control Panel Header */}
<div className={tw`bg-white rounded-md shadow px-4 py-3 mb-4`}>
  <h2 className={tw`text-purple-700 font-semibold text-base`}> Control Panel</h2></div>


  /* ================= SEARCH ================= */
  const handleSearch = () => {
    const filtered = users.filter(u => {
      const nameMatch = searchName
        ? u.name.toLowerCase().includes(searchName.toLowerCase())
        : true;
      const categoryMatch = searchCategory
        ? u.category === searchCategory
        : true;
      return nameMatch && categoryMatch;
    });
    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  /* ================= PAGINATION ================= */
  const indexOfLast = currentPage * usersPerPage;
  const indexOfFirst = indexOfLast - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  return (
    <div className={tw`min-h-screen bg-purple-50`}>
      <ToastContainer />

      {/* ================= SIDEBAR (مطابق للكود الأول) ================= */}
      <aside
        className={tw`
          fixed top-0 left-0 h-full w-64
          bg-gradient-to-b from-purple-900 to-purple-700
          text-white shadow-xl flex flex-col
          transform transition-transform duration-300
          ${showSidebar ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div className={tw`py-6 px-6 border-b border-purple-600`}>
          <h1 className={tw`text-2xl font-bold`}>Control Panel</h1>
        </div>

        <nav className={tw`flex-1 px-4 py-6 space-y-2`}>
          <button
            onClick={() => setActiveTab("dashboard")}
            className={tw`
              flex items-center gap-3 py-2 px-4 rounded w-full text-left
              ${activeTab === "dashboard" ? "bg-purple-700" : "hover:bg-purple-600"}
            `}
          >
            🏠 Dashboard
          </button>

          <button
            onClick={() => setActiveTab("users")}
            className={tw`
              flex items-center gap-3 py-2 px-4 rounded w-full text-left
              ${activeTab === "users" ? "bg-purple-700" : "hover:bg-purple-600"}
            `}
          >
            👥 Users Management
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={tw`
              flex items-center gap-3 py-2 px-4 rounded w-full text-left
              ${activeTab === "categories" ? "bg-purple-700" : "hover:bg-purple-600"}
            `}
          >
            📂 Categories
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={tw`
              flex items-center gap-3 py-2 px-4 rounded w-full text-left
              ${activeTab === "settings" ? "bg-purple-700" : "hover:bg-purple-600"}
            `}
          >
            ⚙️ Settings
          </button>
        </nav>

        <div className={tw`px-4 py-4 border-t border-purple-600`}>
          <button className={tw`bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full`}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* ================= HEADER ================= */}
      
      {/* HEADER */}
      <header className={tw`flex items-center justify-between fixed top-0 left-0 right-0 bg-purple-50 shadow px-4 py-2 z-10`}>
        <div className={tw`flex items-center`}>
          <button onClick={() => setShowSidebar(!showSidebar)}
            className={tw`lg:hidden p-2 bg-purple-700 text-white rounded`}>☰</button>
        </div>
        <h1 className={tw`text-xl font-semibold text-purple-900`}>Users Management Panel</h1>
        <div className={tw`flex items-center space-x-2`}>
          <button className={tw`relative text-purple-800 text-xl`}>
            🔔
            <span className={tw`absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full`}></span>
          </button>
          <span className={tw`hidden md:inline text-purple-900 font-semibold text-sm md:text-base`}>Admin</span>
          <img src="https://i.pravatar.cc/35" className={tw`w-8 h-8 md:w-10 md:h-10 rounded-full border`} />
        </div>
      </header>


      {/* ================= MAIN ================= */}
      <div className={tw`ml-0 lg:ml-64 mt-20 p-4`}>

        {activeTab === "dashboard" && (
          <div className={tw`bg-white p-6 rounded-xl shadow`}>
            Dashboard content here
          </div>
        )}

        {activeTab === "users" && (
          <>
            {/* Control Panel */}
            <div className={tw`bg-white p-4 md:p-5 rounded-xl shadow mb-6`}>
          <h2 className={tw`text-lg md:text-xl font-bold mb-3 text-purple-800`}>Control Panel</h2>
          <div className={tw`flex flex-wrap gap-2 sm:flex-row flex-col`}>
            <input 
              type="text"
              placeholder="Search"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
              className={tw`border p-2 md:p-2 rounded flex-grow text-[10px] md:text-sm`}
            />
            <select 
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className={tw`border p-2 md:p-2 rounded text-[7px] md:text-sm`}
            >
              <option value="">All Categories</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="developer">Developer</option>
            </select>
            <button onClick={handleSearch} className={tw`bg-purple-700 text-white p-2 md:p-2 rounded hover:bg-purple-800 transition text-[10px] md:text-sm`}>
              Search
            </button>
            <button onClick={handleDeleteAll} className={tw`bg-red-600 text-white p-2 md:p-2 rounded hover:bg-red-700 transition text-[10px] md:text-sm`}>
              Delete All
            </button>
          </div>
        </div>


            {/* USERS TABLE */}
<div className={tw`w-full overflow`}>
  <table
    className={tw`w-full table-auto border-collapse bg-white text-gray-900 rounded-xl shadow-lg border border-purple-300`}
    style={{ tableLayout: "auto", wordBreak: "break-word" }}
  >
    <thead className={tw`bg-purple-200 text-purple-900`}>
      <tr>
        <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-[10px] md:text-sm`}>
          Name
        </th>
        <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-[10px] md:text-sm`}>
          Email
        </th>
        <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-[10px] md:text-sm`}>
          Phone
        </th>
        <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-[10px] md:text-sm`}>
          Category
        </th>
        <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-center text-[10px] md:text-sm`}>
          Actions
        </th>
      </tr>
    </thead>

    <tbody className={tw`text-[10px] md:text-sm lg:text-base`}>
      {currentUsers.length > 0 ? (
        currentUsers.map((user) => (
          <tr key={user.userId} className={tw`hover:bg-purple-100 transition`}>
            <td className={tw`border border-purple-200 p-1 md:p-2`}>
              {editingEmail === user.email ? (
                <input
                  name="name"
                  value={editData?.name}
                  onChange={handleChange}
                  className={tw`border p-1 rounded w-full`}
                />
              ) : (
                user.name
              )}
            </td>

            <td className={tw`border border-purple-200 p-1 md:p-2`}>
              {editingEmail === user.email ? (
                <input
                  name="email"
                  value={editData?.email}
                  onChange={handleChange}
                  className={tw`border p-1 rounded w-full`}
                />
              ) : (
                user.email
              )}
            </td>

            <td className={tw`border border-purple-200 p-1 md:p-2`}>
              {editingEmail === user.email ? (
                <input
                  name="phone"
                  value={editData?.phone}
                  onChange={handleChange}
                  className={tw`border p-1 rounded w-full`}
                />
              ) : (
                user.phone
              )}
            </td>

            <td className={tw`border border-purple-200 p-1 md:p-2`}>
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
              ) : (
                user.category
              )}
            </td>

            <td className={tw`border border-purple-200 p-1 md:p-2 flex justify-center`}>
              {editingEmail === user.email ? (
                <button
                  onClick={handleSave}
                  className={tw`bg-green-600 text-white px-3 py-1 rounded`}
                >
                  Save
                </button>
              ) : isMobile ? (
                <div className={tw`relative`}>
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === user.userId ? null : user.userId)
                    }
                  >
                    <FaEllipsisV />
                  </button>

                  {activeMenu === user.userId && (
                    <div
                      className={tw`absolute right-0 mt-2 bg-white border shadow rounded w-28 z-50`}
                    >
                      <button
                        onClick={() => handleEdit(user)}
                        className={tw`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full`}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.email)}
                        className={tw`flex items-center gap-2 px-3 py-2 hover:bg-gray-100 w-full`}
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className={tw`flex gap-2`}>
                  <button
                    onClick={() => handleEdit(user)}
                    className={tw`bg-yellow-500 text-white p-2 rounded`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.email)}
                    className={tw`bg-red-500 text-white p-2 rounded`}
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={5} className={tw`text-center p-4 text-gray-500`}>
            No users found
          </td>
        </tr>
      )}
    </tbody>
  </table>

  {/* PAGINATION */}
  {totalPages > 1 && (
    <div className={tw`flex justify-center mt-4 gap-2`}>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={tw`px-3 py-1 rounded bg-purple-700 text-white disabled:bg-purple-300`}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={tw`px-3 py-1 rounded ${
            currentPage === page
              ? "bg-purple-900 text-white"
              : "bg-purple-200 text-purple-900"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={tw`px-3 py-1 rounded bg-purple-700 text-white disabled:bg-purple-300`}
      >
        Next
      </button>
    </div>
  )}
</div>

          </>
        )}

        {activeTab === "categories" && (
          <div className={tw`bg-white p-6 rounded-xl shadow`}>
            Categories management here
          </div>
        )}

        {activeTab === "settings" && (
          <div className={tw`bg-white p-6 rounded-xl shadow`}>
            Settings here
          </div>
        )}
      </div>
    </div>
  );
}

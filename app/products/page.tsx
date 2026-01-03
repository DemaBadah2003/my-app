'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { tw } from "../twind";
import { FaEdit, FaTrash, FaEllipsisV } from "react-icons/fa";

export interface Product {
  productid: number; // بدلاً من id
  name: string;
  category: "clothes" | "food" | "health";
  owner: string;
  count: number;
}

export default function ProductsManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Product | null>(null);
  const [searchName, setSearchName] = useState("");
  const [searchCategory, setSearchCategory] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);
  // ===== Create Product =====
const [showCreateModal, setShowCreateModal] = useState(false);

const [newProduct, setNewProduct] = useState({
  name: "",
  owner: "",
  category: "clothes" as "clothes" | "food" | "health",
  count: 0,
});


  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5);

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products || []);
      setFilteredProducts(res.data.products || []);
    } catch {
      toast.error("Failed to fetch products", { position: "top-center" });
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ================= ACTIONS ================= */
  const handleEdit = (product: Product) => {
    setEditingId(product.productid);
    setEditData({ ...product });
    setActiveMenu(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editData) return;
    const value = e.target.name === "count" ? Number(e.target.value) : e.target.value;
    setEditData({ ...editData, [e.target.name]: value });
  };

  const handleSave = async () => {
    if (!editData || editingId === null) return;
    try {
      const res = await axios.patch("/api/updataProducts", {
        productid: editingId, // إرسال المفتاح الصحيح
        name: editData.name,
        owner: editData.owner,
        count: editData.count,
        category: editData.category
      });

      if (!res.data.success)
        return toast.error(res.data.message, { position: "top-center" });

      toast.success(res.data.message, { position: "top-center" });
      setEditingId(null);
      setEditData(null);
      fetchProducts();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update product", { position: "top-center" });
    }
  };

  const handleDelete = async (productid: number) => {
  try {
    const res = await axios.post("/api/products", {
      action: "delete",
      productid,
    });

    if (res.data.success) {
      toast.success(res.data.message, { position: "top-center" });
      fetchProducts();
    }
  } catch (error) {
    console.error("Delete error:", error);
  }
};


 const handleDeleteAll = async () => {
  if (!confirm("Are you sure you want to delete all products?")) return;

  try {
    const res = await axios.post("/api/products", {
      action: "deleteAll",
    });

    if (res.data.success) {
      toast.success(res.data.message, { position: "top-center" });
      fetchProducts();
    }
  } catch (error) {
    console.error("Delete all error:", error);
  }
};
// ===== Create Product handlers =====
const handleNewProductChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => {
  const value =
    e.target.name === "count" ? Number(e.target.value) : e.target.value;

  setNewProduct({ ...newProduct, [e.target.name]: value });
};

const handleCreateProduct = async () => {
  try {
    const res = await axios.post("/api/products", {
      action: "add",
      data: newProduct,
    });

    if (!res.data.success) {
      return toast.error(res.data.message, { position: "top-center" });
    }

    toast.success("Product created successfully", { position: "top-center" });
    setShowCreateModal(false);
    setNewProduct({ name: "", owner: "", category: "clothes", count: 0 });
    fetchProducts();
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || "Failed to create product",
      { position: "top-center" }
    );
  }
};


  /* ================= SEARCH ================= */
  const handleSearch = () => {
    const filtered = products.filter(p => {
      const nameMatch = searchName.trim() ? p.name.toLowerCase().includes(searchName.toLowerCase()) : true;
      const categoryMatch = searchCategory.trim() ? p.category === searchCategory : true;
      return nameMatch && categoryMatch;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  /* ================= PAGINATION ================= */
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className={tw`min-h-screen bg-purple-50`}>
      <ToastContainer />
      {showCreateModal && (
  <div className={tw`fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50`}>
    <div className={tw`bg-white rounded-xl shadow-lg w-full max-w-md p-5`}>
      <h3 className={tw`text-lg font-bold text-purple-800 mb-4`}>
        Create New Product
      </h3>

      <input
        name="name"
        placeholder="Product Name"
        value={newProduct.name}
        onChange={handleNewProductChange}
        className={tw`border p-2 rounded w-full mb-2`}
      />

      <input
        name="owner"
        placeholder="Owner"
        value={newProduct.owner}
        onChange={handleNewProductChange}
        className={tw`border p-2 rounded w-full mb-2`}
      />

      <input
        type="number"
        name="count"
        value={newProduct.count}
        onChange={handleNewProductChange}
        className={tw`border p-2 rounded w-full mb-2`}
      />

      <select
        name="category"
        value={newProduct.category}
        onChange={handleNewProductChange}
        className={tw`border p-2 rounded w-full mb-4`}
      >
        <option value="clothes">Clothes</option>
        <option value="food">Food</option>
        <option value="health">Health</option>
      </select>

      <div className={tw`flex justify-end gap-2`}>
        <button
          onClick={() => setShowCreateModal(false)}
          className={tw`px-4 py-2 bg-gray-300 rounded`}
        >
          Cancel
        </button>
        <button
          onClick={handleCreateProduct}
          className={tw`px-4 py-2 bg-green-600 text-white rounded`}
        >
          Create
        </button>
      </div>
    </div>
  </div>
)}


      {/* SIDEBAR */}
      <aside className={tw`
        fixed top-0 left-0 h-full bg-gradient-to-b from-purple-900 to-purple-700 
        text-white shadow-xl flex flex-col w-64 
        transform transition-transform duration-300 
        ${showSidebar ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
      `}>
        <div className={tw`py-6 px-6 border-b border-purple-600`}>
          <h1 className={tw`text-2xl font-bold`}>Control Panel</h1>
        </div>
        <nav className={tw`flex-1 px-4 py-6 space-y-3`}>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>🏠 Dashboard</button>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left bg-purple-700`}>📦 Products Management</button>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>📂 Categories</button>
          <button className={tw`flex items-center space-x-3 py-2 px-4 rounded hover:bg-purple-600 w-full text-left`}>⚙️ Settings</button>
        </nav>
        <div className={tw`px-4 py-4 border-t border-purple-600`}>
          <button className={tw`flex items-center space-x-3 bg-red-500 hover:bg-red-600 px-4 py-2 rounded w-full text-left`}>🚪 Logout</button>
        </div>
      </aside>

      {/* HEADER */}
      <header className={tw`flex items-center justify-between fixed top-0 left-0 right-0 bg-purple-50 shadow px-4 py-2 z-10`}>
        <div className={tw`flex items-center`}>
          <button onClick={() => setShowSidebar(!showSidebar)} className={tw`lg:hidden p-2 bg-purple-700 text-white rounded`}>☰</button>
        </div>
        <h1 className={tw`text-xl font-semibold text-purple-900`}>Products Management Panel</h1>
        <div className={tw`flex items-center space-x-2`}>
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
              <option value="clothes">Clothes</option>
              <option value="food">Food</option>
              <option value="health">Health</option>
            </select>
            <button onClick={handleSearch} className={tw`bg-purple-700 text-white p-2 md:p-2 rounded hover:bg-purple-800 transition text-[10px] md:text-sm`}>Search</button>
            <button onClick={() => setShowCreateModal(true)} className={tw`bg-green-600 text-white p-2 rounded hover:bg-green-700`}>+ Create Product</button>

            <button onClick={handleDeleteAll} className={tw`bg-red-600 text-white p-2 md:p-2 rounded hover:bg-red-700 transition text-[10px] md:text-sm`}>Delete All</button>
          </div>
        </div>

        {/* Products Table */}
        <div className={tw`w-full overflow`}>
          <table className={tw`w-full table-auto border-collapse bg-white text-gray-900 rounded-xl shadow-lg border border-purple-300`} style={{ tableLayout: "auto", wordBreak: "break-word" }}>
            <thead className={tw`bg-purple-200 text-purple-900`}>
              <tr>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold break-words text-[10px] md:text-sm`}>Name</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold break-words text-[10px] md:text-sm`}>Owner</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold break-words text-[10px] md:text-sm text-center`}>Count</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold break-words text-[10px] md:text-sm`}>Category</th>
                <th className={tw`border border-purple-300 p-2 md:p-3 font-semibold text-center break-words text-[10px] md:text-sm`}>Actions</th>
              </tr>
            </thead>
            <tbody className={tw`text-[10px] md:text-sm lg:text-base`}>
              {currentProducts.length > 0 ? currentProducts.map((product) => (
                <tr key={product.productid} className={tw`hover:bg-purple-100 transition bg-white`}>
                  <td className={tw`border border-purple-200 p-1 md:p-2 break-words text-[10px] md:text-sm`}>
                    {editingId === product.productid ? (
                      <input name="name" value={editData?.name} onChange={handleChange} className={tw`border p-1 rounded w-full text-[10px] md:text-sm`} />
                    ) : product.name}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 break-words text-[10px] md:text-sm`}>
                    {editingId === product.productid ? (
                      <input name="owner" value={editData?.owner} onChange={handleChange} className={tw`border p-1 rounded w-full text-[10px] md:text-sm`} />
                    ) : product.owner}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 break-words text-[10px] md:text-sm text-center`}>
                    {editingId === product.productid ? (
                      <input type="number" name="count" value={editData?.count} onChange={handleChange} className={tw`border p-1 rounded w-20 text-center text-[10px] md:text-sm`} />
                    ) : product.count}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 break-words text-[10px] md:text-sm`}>
                    {editingId === product.productid ? (
                      <select name="category" value={editData?.category} onChange={handleChange} className={tw`border p-1 rounded w-full text-[10px] md:text-sm`}>
                        <option value="clothes">Clothes</option>
                        <option value="food">Food</option>
                        <option value="health">Health</option>
                      </select>
                    ) : product.category}
                  </td>
                  <td className={tw`border border-purple-200 p-1 md:p-2 flex justify-center items-center relative break-words text-[10px] md:text-sm`}>
                    {editingId === product.productid ? (
                      <button onClick={handleSave} className={tw`bg-green-600 text-white p-1 md:p-2 rounded text-[10px] md:text-sm`} title="Save">Save</button>
                    ) : isMobile ? (
                      <div className={tw`relative`}>
                        <button onClick={() => setActiveMenu(activeMenu === product.productid ? null : product.productid)} className={tw`p-1`}><FaEllipsisV /></button>
                        {activeMenu === product.productid && (
                          <div className={tw`absolute right-0 top-full mt-1 bg-white shadow-lg border rounded flex flex-col w-28 z-50`}>
                            <button onClick={() => { handleEdit(product); setActiveMenu(null); }} className={tw`flex items-center gap-2 px-2 py-2 hover:bg-gray-100 w-full`}><FaEdit /> Edit</button>
                            <button onClick={() => { handleDelete(product.productid); setActiveMenu(null); }} className={tw`flex items-center gap-2 px-2 py-2 hover:bg-gray-100 w-full`}><FaTrash /> Delete</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={tw`flex items-center gap-2`}>
                        <button onClick={() => handleEdit(product)} className={tw`bg-yellow-500 text-white p-1 md:p-2 rounded hover:bg-yellow-600`} title="Edit"><FaEdit /></button>
                        <button onClick={() => handleDelete(product.productid)} className={tw`bg-red-500 text-white p-1 md:p-2 rounded hover:bg-red-600`} title="Delete"><FaTrash /></button>
                      </div>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className={tw`text-center p-2 md:p-4 text-gray-600 text-[10px] md:text-sm`}>No products found.</td>
                </tr>
              )}
            </tbody>
          </table>
          

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={tw`flex justify-center mt-4 space-x-2`}>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={tw`px-3 py-1 rounded bg-purple-700 text-white disabled:bg-purple-300`}>Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => handlePageChange(page)} className={tw`px-3 py-1 rounded ${currentPage === page ? 'bg-purple-900 text-white' : 'bg-purple-200 text-purple-900'}`}>{page}</button>
              ))}
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={tw`px-3 py-1 rounded bg-purple-700 text-white disabled:bg-purple-300`}>Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

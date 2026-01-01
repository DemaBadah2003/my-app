'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import { tw } from "../twind";

export interface Product {
  id: number;
  name: string;
  category: string;
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

  /* ================= FETCH ================= */
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      setProducts(res.data.products || []);
      setFilteredProducts(res.data.products || []);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  /* ================= ACTIONS ================= */
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditData({ ...product });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editData) return;
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!editData) return;
    try {
      const res = await axios.patch("/api/products", editData);
      toast.success(res.data.message);
      setEditingId(null);
      setEditData(null);
      fetchProducts();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await axios.post("/api/products", { action: "delete", id });
      toast.success(res.data.message);
      fetchProducts();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteAll = async () => {
    try {
      await axios.post("/api/products", { action: "deleteAll" });
      toast.success("All products deleted");
      fetchProducts();
    } catch {
      toast.error("Delete all failed");
    }
  };

  /* ================= SEARCH ================= */
  const handleSearch = () => {
    const filtered = products.filter(p => {
      const nameMatch = searchName
        ? p.name.toLowerCase().includes(searchName.toLowerCase())
        : true;

      const categoryMatch = searchCategory
        ? p.category === searchCategory
        : true;

      return nameMatch && categoryMatch;
    });

    setFilteredProducts(filtered);
  };

  return (
    <div className={tw`min-h-screen bg-purple-50 flex`}>
      <ToastContainer />

      {/* SIDEBAR */}
      <aside className={tw`w-64 bg-purple-800 text-white flex flex-col`}>
        <div className={tw`p-6 font-bold text-xl border-b border-purple-700`}>
          Control Panel
        </div>

        <nav className={tw`flex-1 p-4 space-y-3`}>
          <button className={tw`flex items-center gap-2 hover:bg-purple-700 p-2 rounded`}>
            🏠 Dashboard
          </button>
          <button className={tw`flex items-center gap-2 bg-purple-700 p-2 rounded`}>
            📦 Products Management
          </button>
          <button className={tw`flex items-center gap-2 hover:bg-purple-700 p-2 rounded`}>
            📂 Categories
          </button>
          <button className={tw`flex items-center gap-2 hover:bg-purple-700 p-2 rounded mt-auto`}>
            ⚙️ Settings
          </button>
        </nav>

        <div className={tw`p-4`}>
          <button className={tw`bg-red-500 w-full py-2 rounded`}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className={tw`flex-1`}>
        {/* HEADER */}
        <header className={tw`h-16 bg-purple-100 flex items-center justify-center shadow relative`}>
          <h1 className={tw`text-xl font-bold text-purple-800`}>
            Products Management Panel
          </h1>
          <div className={tw`absolute right-6 flex items-center gap-3`}>
            🔔
            <span className={tw`font-semibold text-purple-800`}>Admin</span>
            <img src="https://i.pravatar.cc/40" className={tw`rounded-full`} />
          </div>
        </header>

        {/* CONTENT */}
        <div className={tw`p-6`}>
         {/* CONTROL PANEL */}
<div className={tw`bg-white p-5 rounded-xl shadow mb-6`}>
  <h2 className={tw`text-lg font-bold text-purple-700 mb-4`}>
    Control Panel
  </h2>

  <div className={tw`flex gap-3 flex-wrap`}>
    <input
      placeholder="Search"
      value={searchName}
      onChange={e => setSearchName(e.target.value)}
      className={tw`border p-2 rounded flex-1`}
    />

    <select
      value={searchCategory}
      onChange={e => setSearchCategory(e.target.value)}
      className={tw`border p-2 rounded`}
    >
      <option value="">All Categories</option>
      <option value="electronics">Electronics</option>
      <option value="food">Food</option>
      <option value="clothes">Clothes</option>
    </select>

    <button
      onClick={handleSearch}
      className={tw`bg-purple-600 text-white px-4 rounded`}
    >
      Search
    </button>

    <button
      onClick={handleDeleteAll}
      className={tw`bg-red-500 text-white px-4 rounded`}
    >
      Delete All
    </button>
  </div>
</div>


          {/* TABLE */}
          <table className={tw`w-full bg-white rounded-xl shadow border`}>
            <thead className={tw`bg-purple-200 text-purple-900 font-bold`}>
              <tr>
                <th className={tw`p-3 border`}>Name</th>
                <th className={tw`p-3 border`}>Category</th>
                <th className={tw`p-3 border`}>Owner</th>
                <th className={tw`p-3 border text-center`}>Count</th>
                <th className={tw`p-3 border text-center`}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className={tw`hover:bg-purple-50`}>
                  <td className={tw`p-2 border`}>
                    {editingId === product.id
                      ? <input name="name" value={editData?.name} onChange={handleChange} className={tw`border p-1 w-full`} />
                      : product.name}
                  </td>

                  <td className={tw`p-2 border flex items-center justify-between`}>
                    {editingId === product.id
                      ? <input name="category" value={editData?.category} onChange={handleChange} className={tw`border p-1 w-full`} />
                      : product.category}

                    <div className={tw`flex gap-2`}>
                      <button onClick={() => handleEdit(product)} className={tw`bg-yellow-500 p-1 text-white rounded`}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDelete(product.id)} className={tw`bg-red-500 p-1 text-white rounded`}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>

                  <td className={tw`p-2 border`}>
                    {editingId === product.id
                      ? <input name="owner" value={editData?.owner} onChange={handleChange} className={tw`border p-1 w-full`} />
                      : product.owner}
                  </td>

                  <td className={tw`p-2 border text-center`}>
                    {editingId === product.id
                      ? <input type="number" name="count" value={editData?.count} onChange={handleChange} className={tw`border p-1 w-20 text-center`} />
                      : product.count}
                  </td>

                  <td className={tw`p-2 border text-center`}>
                    {editingId === product.id ? (
                      <button onClick={handleSave} className={tw`bg-green-600 text-white px-3 py-1 rounded`}>
                        Save
                      </button>
                    ) : (
                      <div className={tw`flex justify-center gap-2`}>
                        <button onClick={() => handleEdit(product)} className={tw`bg-yellow-500 p-2 text-white rounded`}>
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className={tw`bg-red-500 p-2 text-white rounded`}>
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

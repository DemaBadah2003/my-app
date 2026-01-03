"use client";

import axios from "axios"; // ← هذا هو التصحيح الأساسي



export interface Product {
  name: string;
  owner: string;
  category: "clothes" | "food" | "health";
  count: number;
}

// -------------------- إضافة منتج --------------------
export const addProduct = async (product: Product) => {
  try {
    const res = await axios.post("/api/products", {
      action: "add",
      data: product
    });
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to add product" };
  }
};

// -------------------- حذف منتج --------------------
export const deleteProduct = async (name: string) => {
  try {
    const res = await axios.post("/api/products", {
      action: "delete",
      data: { name }
    });
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to delete product" };
  }
};

// -------------------- حذف جميع المنتجات --------------------
export const deleteAllProducts = async () => {
  try {
    const res = await axios.post("/api/products", { action: "deleteAll" });
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to delete all products" };
  }
};

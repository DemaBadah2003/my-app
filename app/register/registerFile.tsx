"use client";

import axios from "axios";

export interface User {
  name: string;
  email: string;
  phone: string;
  category: string;
}

// -------------------- التحقق من التكرار --------------------
export const isDuplicateUser = async (user: User): Promise<boolean> => {
  try {
    const res = await axios.get("/api/users");
    const users: User[] = res.data.users || [];

    const email = user.email.trim().toLowerCase();
    const phone = user.phone.trim().toLowerCase();

    return users.some(u =>
      u.email.trim().toLowerCase() === email ||
      u.phone.trim().toLowerCase() === phone
    );
  } catch (err) {
    console.error("Failed to check duplicates:", err);
    return false;
  }
};

// -------------------- إضافة مستخدم --------------------
export const addUser = async (user: User) => {
  try {
    const duplicate = await isDuplicateUser(user);
    if (duplicate) return { success: false, message: "User already exists" };

    const res = await axios.post("/api/users", {
      action: "add",
      data: user
    });

    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to add user" };
  }
};

// -------------------- تحديث مستخدم --------------------
export const updateUser = async (originalEmail: string, updatedUser: User) => {
  try {
    const res = await axios.patch("/api/updataUsers", updatedUser); // حسب كودك السابق
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to update user" };
  }
};

// -------------------- حذف مستخدم --------------------
export const deleteUser = async (email: string) => {
  try {
    const res = await axios.post("/api/users", {
      action: "delete",
      data: { email }
    });
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to delete user" };
  }
};

// -------------------- حذف جميع المستخدمين --------------------
export const deleteAllUsers = async () => {
  try {
    const res = await axios.post("/api/users", { action: "deleteAll" });
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || "Failed to delete all users" };
  }
};
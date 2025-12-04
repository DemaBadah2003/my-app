"use client";

export interface User {
  name: string;
  email: string;
  phone: string;
  category: string;
}

const STORAGE_KEY = "users";

// قراءة المستخدمين
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// التحقق من التكرار
export const isDuplicateUser = (user: User): boolean => {
  const users = getUsers();
  return users.some(
    u =>
      u.email.trim().toLowerCase() === user.email.trim().toLowerCase() &&
      u.name.trim().toLowerCase() === user.name.trim().toLowerCase()
  );
};

// إضافة مستخدم
export const addUser = (user: User) => {
  if (isDuplicateUser(user)) {
    return { success: false, message: "User already exists" };
  }

  const old = getUsers();
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...old, user]));

  return { success: true, message: "User added successfully" };
};

// تحديث مستخدم
export const updateUser = (originalEmail: string, updatedUser: User) => {
  const users = getUsers();

  // التحقق من التكرار عند التعديل
  const duplicate = users.some(
    u =>
      u.email !== originalEmail &&
      u.email.trim().toLowerCase() === updatedUser.email.trim().toLowerCase() &&
      u.name.trim().toLowerCase() === updatedUser.name.trim().toLowerCase()
  );

  if (duplicate) {
    return { success: false, message: "User already exists" };
  }

  const index = users.findIndex(u => u.email === originalEmail);
  if (index === -1) return { success: false, message: "User not found" };

  users[index] = updatedUser;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return { success: true, message: "User updated successfully" };
};

// حذف مستخدم
export const deleteUser = (email: string) => {
  const users = getUsers();
  const filtered = users.filter(u => u.email !== email);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return { success: true, message: "User deleted successfully" };
};

// حذف الكل
export const deleteAllUsers = () => {
  localStorage.removeItem(STORAGE_KEY);
  return { success: true, message: "All users deleted successfully" };
};

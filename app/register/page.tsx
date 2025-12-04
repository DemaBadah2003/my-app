'use client';

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import axios from "axios";
import { tw } from "../twind"; // استدعاء Twind

// Zod Schema مع تحقق الإيميل
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z
    .string()
    .refine(
      (val) => val.includes("@") && val.endsWith("@gmail.com"),
      "Email must contain '@' and end with '@gmail.com'"
    ),
  phone: z
    .string()
    .regex(/^(056|059)\d{7}$/, "Phone must start with 056 or 059 and have 10 digits total"),
  category: z.enum(["student", "teacher", "developer"]),
});

type FormData = z.infer<typeof formSchema>;

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    category: "student",
  });

  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [businessError, setBusinessError] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    try {
      formSchema.pick({ [name]: true }).parse({ [name]: value });
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err: any) {
      if (err.issues)
        setFieldErrors((prev) => ({ ...prev, [name]: err.issues[0].message }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessError("");

    try {
      formSchema.parse(formData);

      const res = await axios.post("/api/register", formData);

      toast.success(res.data.message, { position: "top-center" });

      setFormData({ name: "", email: "", phone: "", category: "student" });
      setFieldErrors({});
    } catch (err: any) {
      if (err.response?.status === 409) {
        setBusinessError("Data already exists");
        toast.error("Data already exists", { position: "top-center" });
      } else if (err.response?.data?.error) {
        setBusinessError(err.response.data.error);
        toast.error(err.response.data.error, { position: "top-center" });
      } else if (err instanceof z.ZodError) {
        const newErrors: Partial<Record<keyof FormData, string>> = {};
        err.issues.forEach((issue) => {
          const key = issue.path[0] as keyof FormData;
          newErrors[key] = issue.message;
        });
        setFieldErrors(newErrors);
      } else {
        console.error("Unknown Error:", err);
        toast.error(err.message || "Unexpected error occurred", { position: "top-center" });
      }
    }
  };

  return (
    <div className={tw`max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl`}>
      <ToastContainer />

      <h2 className={tw`text-2xl font-bold mb-3 text-center`}>Register User</h2>

      {businessError && (
        <div className={tw`bg-red-100 text-red-700 p-2 rounded mb-4 text-center font-medium`}>
          {businessError}
        </div>
      )}

      <form className={tw`flex flex-col gap-4`} onSubmit={handleSubmit}>
        <div>
          <label className={tw`block mb-1 font-medium`}>Name</label>
          <input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={tw`border p-2 rounded w-full ${fieldErrors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {fieldErrors.name && (
            <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label className={tw`block mb-1 font-medium`}>Email</label>
          <input
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={tw`border p-2 rounded w-full ${fieldErrors.email ? "border-red-500" : "border-gray-300"}`}
          />
          {fieldErrors.email && (
            <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className={tw`block mb-1 font-medium`}>Phone</label>
          <input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={tw`border p-2 rounded w-full ${fieldErrors.phone ? "border-red-500" : "border-gray-300"}`}
          />
          {fieldErrors.phone && (
            <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.phone}</p>
          )}
        </div>

        <div>
          <label className={tw`block mb-1 font-medium`}>Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={tw`border p-2 rounded w-full`}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="developer">Developer</option>
          </select>
          {fieldErrors.category && (
            <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.category}</p>
          )}
        </div>

        <button
          type="submit"
          className={tw`bg-primary text-white p-2 rounded mt-3 hover:bg-blue-700 transition-colors`}
        >
          Register
        </button>
      </form>
    </div>
  );
}

'use client';

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import axios from "axios";
import { tw } from "../twind";

// --------------------
// Zod Schema
// --------------------
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .refine((name) => {
      // يمنع المسافة في البداية أو النهاية
      if (name !== name.trim()) return false;

      // يمنع أن يكون كله مسافات
      if (name.trim().length === 0) return false;

      return true; // باقي الأشياء مسموحة
    }, {
      message: "Name must not start or end with spaces",
    }),

  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .regex(/^(056|059)\d{7}$/, "Phone must start with 056 or 059 and have 10 digits"),

  category: z.enum(["student", "teacher", "developer"]),
});

// --------------------
// Type inference
// --------------------
type FormData = z.infer<typeof formSchema>;

// --------------------
// Validate all fields (onSubmit)
// --------------------
const validateForm = (data: FormData) => {
  const parsed = formSchema.safeParse(data);

  if (parsed.success) {
    return { success: true as const, data: parsed.data };
  }

  const errors: Partial<Record<keyof FormData, string>> = {};

  parsed.error.issues.forEach((issue: z.ZodIssue) => {
    const key = issue.path[0] as keyof FormData;
    errors[key] = issue.message;
  });

  return { success: false as const, errors };
};

// --------------------
// Validate one field (onBlur)
// --------------------
const validateField = (name: keyof FormData, value: string) => {
  const parsed = formSchema
    .pick({ [name]: true })
    .safeParse({ [name]: value });

  return parsed.success ? "" : parsed.error.issues[0]?.message ?? "";
};

// --------------------
// React Component
// --------------------
export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    category: "student",
  });

  const [fieldErrors, setFieldErrors] =
    useState<Partial<Record<keyof FormData, string>>>({});

  const [businessError, setBusinessError] = useState("");

  // --------------------
  // Change handler
  // --------------------
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // --------------------
  // Blur handler
  // --------------------
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const error = validateField(name as keyof FormData, value);

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  // --------------------
  // Submit handler
  // --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusinessError("");

    const result = validateForm(formData);

    if (!result.success) {
      setFieldErrors(result.errors);
      return;
    }

    try {
      const res = await axios.post("/api/register", result.data);
      toast.success(res.data.message, { position: "top-center" });

      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "student",
      });
      setFieldErrors({});
    } catch (err: any) {
  if (err.response) {
    // السيرفر رد مع كود خطأ
    toast.error(err.response.data.message || `Server error ${err.response.status}`, { position: "top-center" });
  } else if (err.request) {
    // لم يصل الرد من السيرفر
    toast.error("Network error: Server did not respond", { position: "top-center" });
  } else {
    // خطأ داخلي في Axios
    toast.error(`Request error: ${err.message}`, { position: "top-center" });
  }
}

  };

  // --------------------
  // JSX
  // --------------------
  return (
    <div className={tw`max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl`}>
      <ToastContainer />

      <h2 className={tw`text-2xl font-bold mb-3 text-center`}>
        Register User
      </h2>

      {businessError && (
        <div className={tw`bg-red-100 text-red-700 p-2 rounded mb-4 text-center`}>
          {businessError}
        </div>
      )}

      <form className={tw`flex flex-col gap-4`} onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full ${
              fieldErrors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.name && (
            <p className={tw`text-red-500 text-sm mt-1`}>
              {fieldErrors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full ${
              fieldErrors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p className={tw`text-red-500 text-sm mt-1`}>
              {fieldErrors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full ${
              fieldErrors.phone ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.phone && (
            <p className={tw`text-red-500 text-sm mt-1`}>
              {fieldErrors.phone}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full`}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="developer">Developer</option>
          </select>
          {fieldErrors.category && (
            <p className={tw`text-red-500 text-sm mt-1`}>
              {fieldErrors.category}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={tw`bg-primary text-white p-2 rounded mt-3`}
        >
          Register
        </button>
      </form>
    </div>
  );
}
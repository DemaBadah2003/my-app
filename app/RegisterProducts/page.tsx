'use client';

import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";
import { tw } from "../twind";
import { addProduct } from "./registerProductsFile"; // ← دالة الإضافة

// --------------------
// Zod Schema
// --------------------
const formSchema = z.object({
  name: z
    .string()
    .min(1, "Product name is required")
    .refine((name) => name === name.trim() && name.trim().length > 0, {
      message: "Product name must not start or end with spaces",
    }),
  owner: z
    .string()
    .min(1, "Owner is required")
    .refine((owner) => owner === owner.trim() && owner.trim().length > 0, {
      message: "Owner name must not start or end with spaces",
    }),
  count: z
    .string()
    .min(1, "Count is required")
    .refine((count) => count === count.trim() && count.trim().length > 0, {
      message: "Count must not start or end with spaces",
    }),
  category: z.enum(["clothes", "food", "health"]),
});

// --------------------
// Type inference
// --------------------
type FormData = z.infer<typeof formSchema>;

// --------------------
// Validate all fields
// --------------------
const validateForm = (data: FormData) => {
  const parsed = formSchema.safeParse(data);
  if (parsed.success) return { success: true as const, data: parsed.data };

  const errors: Partial<Record<keyof FormData, string>> = {};
  parsed.error.issues.forEach((issue) => {
    const key = issue.path[0] as keyof FormData;
    errors[key] = issue.message;
  });
  return { success: false as const, errors };
};

// --------------------
// Validate single field
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
export default function ProductRegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    owner: "",
    category: "clothes",
    count: "",
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
    setFormData((prev) => ({ ...prev, [name]: value }));
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
  // Submit handler (تم التعديل لاستخدام addProduct)
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
      const res = await addProduct({
        name: formData.name,
        owner: formData.owner,
        category: formData.category,
        count: Number(formData.count), // تحويل إلى رقم
      });

      if (res.success) {
        toast.success(res.message, { position: "top-center" });

        setFormData({
          name: "",
          owner: "",
          category: "clothes",
          count: "",
        });
        setFieldErrors({});
      } else {
        toast.error(res.message || "Failed to add product", { position: "top-center" });
      }
    } catch (err: any) {
      toast.error(`Unexpected error: ${err.message}`, { position: "top-center" });
    }
  };

  // --------------------
  // JSX
  // --------------------
  return (
    <div className={tw`max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-xl`}>
      <ToastContainer />

      <h2 className={tw`text-2xl font-bold mb-3 text-center`}>
        Register Product
      </h2>

      {businessError && (
        <div className={tw`bg-red-100 text-red-700 p-2 rounded mb-4 text-center`}>
          {businessError}
        </div>
      )}

      <form className={tw`flex flex-col gap-4`} onSubmit={handleSubmit}>
        {/* Name */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Product Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full ${fieldErrors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {fieldErrors.name && <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.name}</p>}
        </div>

        {/* Owner */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Owner</label>
          <input
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full ${fieldErrors.owner ? "border-red-500" : "border-gray-300"}`}
          />
          {fieldErrors.owner && <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.owner}</p>}
        </div>

        {/* Count */}
        <div>
          <label className={tw`block mb-1 font-medium`}>Count</label>
          <input
            name="count"
            value={formData.count}
            onChange={handleChange}
            onBlur={handleBlur}
            className={tw`border p-2 rounded w-full ${fieldErrors.count ? "border-red-500" : "border-gray-300"}`}
          />
          {fieldErrors.count && <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.count}</p>}
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
            <option value="clothes">Clothes</option>
            <option value="food">Food</option>
            <option value="health">Health</option>
          </select>
          {fieldErrors.category && <p className={tw`text-red-500 text-sm mt-1`}>{fieldErrors.category}</p>}
        </div>

        <button type="submit" className={tw`bg-primary text-white p-2 rounded mt-3`}>
          Register Product
        </button>
      </form>
    </div>
  );
}

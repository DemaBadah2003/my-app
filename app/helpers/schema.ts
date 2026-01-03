// api/helpers/schema.ts
import * as yup from "yup";

export const fullRegisterSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  category: yup.string().required("Category is required"),
});

export type FullRegister = yup.InferType<typeof fullRegisterSchema>;

// =====================================================
// Products Register Schema
// =====================================================
export const fullRegisterProductsSchema = yup.object({
  name: yup.string().required("Product name is required"),
  owner: yup.string().required("Owner is required"),
  category: yup.string().required("Category is required"),
  count: yup
    .number()
    .required("Count is required")
    .min(1, "Count must be at least 1"), // 👈 مهم
});


export type FullRegisterProducts =
  yup.InferType<typeof fullRegisterProductsSchema>;

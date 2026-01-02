// api/helpers/schema.ts
import * as yup from "yup";

export const fullRegisterSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  category: yup.string().required("Category is required"),
});

export type FullRegister = yup.InferType<typeof fullRegisterSchema>;

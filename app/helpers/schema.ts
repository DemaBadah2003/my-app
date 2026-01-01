// api/helpers/schema.ts
import * as yup from "yup";

export const registerSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().optional(),
  category: yup.string().optional(), // افتراضي "Student"
});

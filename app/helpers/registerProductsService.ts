import prisma from "@/src/lib/prisma";
import { fullRegisterProductsSchema } from "@/app/helpers/schema";

export async function registerProducts(data: any) {
  const validated = await fullRegisterProductsSchema.validate(data, {
    abortEarly: false,
  });

  try {
    const products = await prisma.products.create({
      data: {
        name: validated.name,
        owner: validated.owner,
        category: validated.category,
        count: validated.count,
      },
    });

    return {
      message: "Product registered successfully",
      data: products,
    };
  } catch (err: any) {
    if (err.code === "P2002") {
      return { error: "Duplicate product" };
    }
    return { error: "Server error" };
  }
}

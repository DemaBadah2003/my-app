import prisma from "@/src/lib/prisma";

// قراءة المنتجات
export async function readProducts() {
  return prisma.products.findMany();
}

// إنشاء منتج
export async function createProduct(
  name: string,
  owner: string,
  category: "clothes" | "food" | "health",
  count: number
) {
  return prisma.products.create({
    data: { name, owner, category, count },
  });
}

// ✅ حذف منتج بالـ productid (الحل الصحيح)
export async function deleteProduct(productid: number) {
  try {
    await prisma.products.delete({
      where: { productid },
    });

    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    return { success: false, message: "Product not found" };
  }
}

// حذف جميع المنتجات
export async function deleteAllProducts() {
  await prisma.products.deleteMany({});
  return { success: true, message: "All products deleted successfully" };
}

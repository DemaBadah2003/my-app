import prisma from "@/src/lib/prisma";

// ==============================
// قراءة جميع المنتجات
// ==============================
export async function readProducts() {
  return prisma.products.findMany();
}

// ==============================
// إنشاء منتج جديد
// ==============================
export async function createProducts(
  name: string,
  category: string,
  owner: string,
  count: number
) {
  return prisma.products.create({
    data: {
      name,
      category,
      owner,
      count,
    },
  });
}

// ==============================
// حذف منتج حسب ID
// ==============================
export async function deleteProducts(id: number) {
  try {
    await prisma.products.delete({
      where: { id },
    });

    return {
      success: true,
      message: "Products deleted successfully",
    };
  } catch {
    return {
      success: false,
      message: "No products found with this ID",
    };
  }
}

// ==============================
// حذف جميع المنتجات
// ==============================
export async function deleteAllProducts() {
  await prisma.products.deleteMany({});
  return {
    success: true,
    message: "All products deleted successfully",
  };
}

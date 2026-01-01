import prisma from "./prisma";
console.log("🔥 TEST FILE RUNNING");

async function main() {
  // إنشاء مؤلف جديد
  const author = await prisma.authors.create({
    data: {
      name: "J.K. Rowling",
      country: "UK",
    },
  });
  console.log("Author Created:", author);

  // إنشاء كتاب مرتبط بالمؤلف
  const book = await prisma.books.create({
    data: {
      title: "Harry Potter and the Philosopher's Stone",
      authorid: author.authorid,
      publishedyear: 1997,
      genre: "Fantasy",
    },
  });
  console.log("Book Created:", book);

  // إنشاء عضو جديد
  const member = await prisma.members.create({
    data: {
      fullname: "John Doe",
      email: "john@example.com",
    },
  });
  console.log("Member Created:", member);

  // إنشاء عملية استعارة
  const borrow = await prisma.borrowings.create({
    data: {
      bookid: book.bookid,
      memberid: member.memberid,
      borrowdate: new Date(),
    },
  });
  console.log("Borrowing Created:", borrow);

  // إنشاء مستخدم جديد في جدول User
  const user = await prisma.user.create({
    data: {
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "1234567890",     // يمكن إضافة رقم هاتف
      category: "Student",     // أو أي تصنيف تريده
      // joinDate سيتم توليده تلقائيًا بواسطة قاعدة البيانات
    },
  });
  console.log("User Created:", user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });

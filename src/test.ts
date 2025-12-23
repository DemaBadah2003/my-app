import prisma from "./lib/prisma";

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
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
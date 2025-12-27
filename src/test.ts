import prisma from "./lib/prisma";
console.log("🔥 TEST FILE RUNNING");

async function main() {
  // إنشاء مؤلف جديد
  const author = await prisma.author.create({
    data: {
      Name: "J.K. Rowling",
      Country: "UK",
    },
  });
  console.log("Author Created:", author);

  // إنشاء كتاب مرتبط بالمؤلف
  const book = await prisma.book.create({
    data: {
      Title: "Harry Potter and the Philosopher's Stone",
     AuthorID: author.AuthorID,
    PublishedYear: 1997,
      Genre: "Fantasy",
    },
  });
  console.log("Book Created:", book);

  // إنشاء عضو جديد
  const member = await prisma.member.create({
    data: {
      FullName: "John Doe",
      Email: "john@example.com",
    },
  });
  console.log("Member Created:", member);

  // إنشاء عملية استعارة
  const borrow = await prisma.borrowing.create({
    data: {
      BookID: book.BookID,
     MemberID: member.MemberID,
      BorrowDate: new Date(),
    },
  });
  console.log("Borrowing Created:", borrow);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
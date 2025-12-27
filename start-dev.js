const { spawn } = require("child_process");

// تشغيل Next.js
const next = spawn("npx", ["next", "dev"], { stdio: "inherit", shell: true });

// تشغيل Prisma Studio بعد ثانيتين (تجنب التعارض)
setTimeout(() => {
  const prisma = spawn("npx", ["prisma", "studio", "--url", "postgresql://demoapp:123@localhost:5432/demoapp"], { stdio: "inherit", shell: true });
}, 2000);

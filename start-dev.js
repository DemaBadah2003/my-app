const { spawn } = require("child_process");

// شغّل Next.js فقط
spawn("npx", ["next", "dev"], { stdio: "inherit", shell: true });

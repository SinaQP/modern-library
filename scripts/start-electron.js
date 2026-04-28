const { spawn } = require("child_process");
const electronPath = require("electron");

const electronEnv = {
  ...process.env,
  ELECTRON_RUN_AS_NODE: undefined
};

delete electronEnv.ELECTRON_RUN_AS_NODE;

const child = spawn(electronPath, ["."], {
  env: electronEnv,
  stdio: "inherit"
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on("error", (error) => {
  console.error("[electron:launch]", error);
  process.exit(1);
});

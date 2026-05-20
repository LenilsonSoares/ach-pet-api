import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const cypressBin = process.platform === "win32"
  ? path.join(rootDir, "node_modules", ".bin", "cypress.cmd")
  : path.join(rootDir, "node_modules", ".bin", "cypress");
const command = process.platform === "win32" ? process.env.ComSpec || "cmd.exe" : cypressBin;
const args = process.platform === "win32"
  ? ["/d", "/s", "/c", "call", cypressBin, ...process.argv.slice(2)]
  : process.argv.slice(2);

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const child = spawn(command, args, {
  cwd: rootDir,
  env,
  stdio: "inherit",
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 1);
});

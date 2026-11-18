import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const publicWorker = join(projectRoot, "public", "sw.js");
const distRoot = join(projectRoot, "dist");
const base = "/React/task5/";

async function listFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await listFiles(path));
    else files.push(path);
  }
  return files;
}

const distFiles = (await listFiles(distRoot))
  .filter((path) => !["sw.js", "404.html"].includes(path.slice(distRoot.length + 1)));
const files = distFiles
  .map((path) => `/${base.replace(/^\//, "")}${relative(distRoot, path).split(sep).join("/")}`);
const hash = createHash("sha256");
let worker = await readFile(publicWorker, "utf8");
hash.update(worker);
for (const path of distFiles) {
  hash.update(relative(distRoot, path));
  hash.update(await readFile(path));
}
const signature = hash.digest("hex").slice(0, 12);
worker = worker
  .replace('"__CACHE_VERSION__"', JSON.stringify(signature))
  .replace("__PRECACHE_URLS__", JSON.stringify(files));

const target = join(distRoot, "sw.js");
await writeFile(target, worker);
const { size } = await stat(target);
console.log(`Generated service worker ${signature} (${files.length} precache files, ${size} bytes).`);

import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const PUBLIC = resolve(ROOT, "public");
const APP = resolve(ROOT, "app");
const SRC = resolve(PUBLIC, "logo-app-icon-1024.png");

const PNG_TARGETS = [
  ["favicon-16x16.png", 16],
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["android-chrome-192x192.png", 192],
  ["android-chrome-512x512.png", 512],
];

const ICO_SIZES = [16, 32, 48];

async function pngBuffer(size) {
  return sharp(SRC).resize(size, size, { fit: "cover" }).png().toBuffer();
}

function buildIco(pngs) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = Buffer.alloc(16 * count);
  let offset = 6 + 16 * count;
  const bodies = [];
  pngs.forEach(({ size, buf }, i) => {
    const e = entries.subarray(i * 16, i * 16 + 16);
    e.writeUInt8(size === 256 ? 0 : size, 0);
    e.writeUInt8(size === 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buf.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buf.length;
    bodies.push(buf);
  });

  return Buffer.concat([header, entries, ...bodies]);
}

async function main() {
  await mkdir(PUBLIC, { recursive: true });
  await mkdir(APP, { recursive: true });

  for (const [name, size] of PNG_TARGETS) {
    const buf = await pngBuffer(size);
    await writeFile(resolve(PUBLIC, name), buf);
    console.log(`wrote public/${name} (${size}x${size})`);
  }

  const icoPngs = await Promise.all(
    ICO_SIZES.map(async (size) => ({ size, buf: await pngBuffer(size) }))
  );
  const ico = buildIco(icoPngs);
  await writeFile(resolve(APP, "favicon.ico"), ico);
  console.log(`wrote app/favicon.ico (${ICO_SIZES.join(",")})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

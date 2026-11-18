import { mkdir, writeFile } from "node:fs/promises";
import { deflateSync } from "node:zlib";

const output = new URL("../public/icons/", import.meta.url);
await mkdir(output, { recursive: true });

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuffer = Buffer.from(type);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])));
  return Buffer.concat([length, typeBuffer, data, checksum]);
}

function makeIcon(size) {
  const rows = [];
  const green = [72, 102, 75, 255];
  const cream = [248, 248, 244, 255];
  for (let y = 0; y < size; y += 1) {
    const row = Buffer.alloc(1 + size * 4);
    for (let x = 0; x < size; x += 1) {
      const offset = 1 + x * 4;
      const isStem = x >= size * 0.43 && x <= size * 0.57 && y >= size * 0.23 && y <= size * 0.77;
      const isTop = x >= size * 0.30 && x <= size * 0.70 && y >= size * 0.23 && y <= size * 0.34;
      const isBottom = x >= size * 0.30 && x <= size * 0.70 && y >= size * 0.66 && y <= size * 0.77;
      const color = isStem || isTop || isBottom ? cream : green;
      row.set(color, offset);
    }
    rows.push(row);
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(rows))),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

for (const size of [192, 512]) {
  await writeFile(new URL(`icon-${size}.png`, output), makeIcon(size));
}

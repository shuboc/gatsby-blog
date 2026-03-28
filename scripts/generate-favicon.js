#!/usr/bin/env node
'use strict';

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const svgPath = path.join(root, 'static', 'favicon.svg');
const icoPath = path.join(root, 'static', 'favicon.ico');

async function main() {
  const svgBuffer = fs.readFileSync(svgPath);

  const [png16, png32] = await Promise.all([
    sharp(svgBuffer).resize(16, 16).png().toBuffer(),
    sharp(svgBuffer).resize(32, 32).png().toBuffer(),
  ]);

  fs.writeFileSync(icoPath, packIco([png16, png32]));
  console.log('Written: static/favicon.ico (16×16 + 32×32)');
}

function packIco(pngs) {
  const count = pngs.length;
  const headerSize = 6;
  const entrySize = 16;
  const dataStart = headerSize + entrySize * count;

  // ICONDIR header
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = ICO
  header.writeUInt16LE(count, 4);

  // ICONDIRENTRY per image
  let offset = dataStart;
  const entries = pngs.map(buf => {
    // PNG IHDR: signature (8) + chunk length (4) + "IHDR" (4) + width (4) + height (4)
    const w = buf.readUInt32BE(16);
    const h = buf.readUInt32BE(20);
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(w >= 256 ? 0 : w, 0);  // width  (0 = 256)
    entry.writeUInt8(h >= 256 ? 0 : h, 1);  // height (0 = 256)
    entry.writeUInt8(0, 2);                  // color count (0 = no palette)
    entry.writeUInt8(0, 3);                  // reserved
    entry.writeUInt16LE(1, 4);               // color planes
    entry.writeUInt16LE(32, 6);              // bits per pixel
    entry.writeUInt32LE(buf.length, 8);      // size of image data
    entry.writeUInt32LE(offset, 12);         // image offset
    offset += buf.length;
    return entry;
  });

  return Buffer.concat([header, ...entries, ...pngs]);
}

main().catch(err => { console.error(err); process.exit(1); });

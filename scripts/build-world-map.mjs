// Offline conversion of Natural Earth's public-domain 110m land shapefile.
// node scripts/build-world-map.mjs path/to/ne_110m_land.shp
// No geographic data or conversion library is fetched by the presentation.
import { readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { projectMapPoint } from "../js/map-projection.js";

if (!process.argv[2]) throw new Error("Provide the Natural Earth 110m land .shp file");
const bytes = readFileSync(process.argv[2]);
if (bytes.readInt32BE(0) !== 9994 || bytes.readInt32LE(32) !== 5) throw new Error("Expected a polygon shapefile");
const paths = [];
let vertices = 0;
for (let offset = 100; offset < bytes.length;) {
  const size = bytes.readInt32BE(offset + 4) * 2;
  const record = offset + 8;
  const type = bytes.readInt32LE(record);
  if (type !== 0 && type !== 5) throw new Error(`Unsupported shape ${type}`);
  if (type === 5) {
    const parts = bytes.readInt32LE(record + 36);
    const count = bytes.readInt32LE(record + 40);
    const points = record + 44 + parts * 4;
    for (let part = 0; part < parts; part++) {
      const start = bytes.readInt32LE(record + 44 + part * 4);
      const end = part + 1 < parts ? bytes.readInt32LE(record + 48 + part * 4) : count;
      const coordinates = [];
      for (let i = start; i < end; i++) {
        const lon = bytes.readDoubleLE(points + i * 16);
        const lat = bytes.readDoubleLE(points + i * 16 + 8);
        coordinates.push(projectMapPoint(lon, lat).map(n => +n.toFixed(1)).join(","));
        vertices++;
      }
      paths.push(`M${coordinates.join("L")}Z`);
    }
  }
  offset += 8 + size;
}
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 440"><title>Continentes e islas — Natural Earth 110m</title><desc>Dominio público. Proyección equirectangular; contornos originales redondeados a 0,1 unidades SVG.</desc><path fill="#b9c5c3" fill-opacity=".14" stroke="#b9c5c3" stroke-opacity=".32" stroke-width=".65" stroke-linejoin="round" fill-rule="evenodd" d="${paths.join("")}"/></svg>\n`;
writeFileSync(new URL("../assets/images/world-natural-earth-110m.svg", import.meta.url), svg);
console.log(JSON.stringify({rings:paths.length,vertices,svgBytes:Buffer.byteLength(svg),sourceSHA256:createHash("sha256").update(bytes).digest("hex")}));

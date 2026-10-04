import fs from "fs";
const s = fs.readFileSync("lib/products.js", "utf8");
const rings = (s.match(/category: "rings"/g) || []).length;
const wears = fs.readdirSync("public/rings/catalog").filter((f) => f.startsWith("wear-")).length;
const catalog = fs.readdirSync("public/rings/catalog").filter((f) => f.endsWith(".jpg")).length;
console.log({ ringsInProducts: rings, wearImages: wears, catalogJpgs: catalog });

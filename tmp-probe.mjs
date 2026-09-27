import { compile } from "@tailwindcss/node";
import fs from "node:fs";

const input = fs.readFileSync("global.css", "utf8");
const { build } = await compile(input, { base: process.cwd() });

const out = build([{ theme: "probe", content: "@tailwind utilities;\n<section class=\"py-24\"></section>" }]);
fs.writeFileSync("tmp-tailwind-probe.css", out);
console.log("probe written");

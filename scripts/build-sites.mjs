import { cpSync, mkdirSync, rmSync } from "node:fs";
import { build } from "esbuild";
rmSync("dist", {recursive:true,force:true});
mkdirSync("dist/server",{recursive:true});
cpSync("out","dist/client",{recursive:true});
mkdirSync("dist/.openai",{recursive:true});
cpSync(".openai/hosting.json","dist/.openai/hosting.json");
await build({entryPoints:["worker/index.ts"],outfile:"dist/server/index.js",bundle:true,format:"esm",platform:"browser",target:"es2022",minify:true});

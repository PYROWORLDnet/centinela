/** Re-descarga los CSV públicos de la DGCP (datos.gob.do). */
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import path from "node:path";

const DIR = new URL("../../data/", import.meta.url);
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";

const FILES = [
  {
    dest: "adjudicaciones-dgcp.csv",
    url: "https://datos.gob.do/dataset/adjudicaciones-secp/resource/81336588-dd41-4253-9e64-d5f431e11129/download/adjudicaciones.csv",
  },
  {
    dest: "procesos-dgcp.csv",
    url: "https://datos.gob.do/dataset/datos-procesos-publicados/resource/bff62d43-1415-49da-8cf1-0509e6db1abd/download/procesos.csv",
  },
  {
    dest: "inhabilitados-dgcp.csv",
    url: "https://datos.gob.do/dataset/proveedores-del-estado-inhabilitados/resource/ae079cd9-d480-4863-bf06-72ec2ae7a0d6/download/inhabilitados.csv",
  },
  {
    dest: "mipymes-dgcp.csv",
    url: "https://datos.gob.do/dataset/procesos-dirigos-a-mipymes/resource/ae65215e-de37-4380-b068-f83f99857488/download/mipymes.csv",
  },
  {
    dest: "nomina-dgcp.csv",
    url: "https://datos.gob.do/dataset/nomina-empleados-dgcp/resource/fe3bbc15-0478-4df1-9f2f-4ac91696952c/download/nomina.csv",
  },
];

async function download(file) {
  const dest = path.join(DIR.pathname, file.dest);
  const res = await fetch(file.url, { headers: { "User-Agent": UA, Referer: "https://datos.gob.do/" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${file.dest}: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  console.log("ok", file.dest);
}

await mkdir(DIR, { recursive: true });
for (const file of FILES) await download(file);

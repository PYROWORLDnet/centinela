/** Baja préstamos: Banco Mundial, BID y Crédito Público RD. */
import { writeFile, mkdir } from "node:fs/promises";

const DIR = new URL("../../data/", import.meta.url);
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Centinela/1.0";

async function get(url) {
  const res = await fetch(url, { headers: { "User-Agent": UA, Referer: "https://datos.gob.do/" }, redirect: "follow" });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res;
}

async function downloadWorldBank() {
  const url =
    "https://search.worldbank.org/api/v2/projects?format=json&fl=id,project_name,project_abstract,status,boardapprovaldate,closingdate,totalamt,lendprojectcost,borrower,impagency,url,countryshortname,countrycode,lendinginstr&countrycode=DO&rows=500";
  const data = await (await get(url)).json();
  const projects = Object.values(data.projects || {});
  await writeFile(new URL("prestamos-bm.json", DIR), JSON.stringify(projects, null, 2));
  console.log("banco mundial", projects.length);
}

async function downloadIdb() {
  const res = await get("https://data.iadb.org/files/download/fc342d1e-fdc9-4590-8d47-c4499a89d381");
  const text = await res.text();
  await writeFile(new URL("prestamos-bid.csv", DIR), text);
  console.log("bid bytes", text.length);
}

function decode(html) {
  return html
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function scrapeCreditoPublico() {
  const rows = [];
  for (const fuente of ["EXTERNA", "INTERNA"]) {
    let page = 1;
    let totalPages = 1;
    while (page <= totalPages) {
      const url = `https://www.creditopublico.gob.do/servicios/financiamientos?SelectedFuenteDeuda=${fuente}&page=${page}&pageSize=200`;
      const html = await (await get(url)).text();
      const pages = html.match(/Total de p[aá]ginas <strong>(\d+)<\/strong>/i);
      if (pages) totalPages = Number(pages[1]);
      const trs = [...html.matchAll(/<tr>\s*<th scope="row"[^>]*>([\s\S]*?)<\/th>([\s\S]*?)<\/tr>/g)];
      for (const tr of trs) {
        const cells = [...tr[2].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map((m) => decode(m[1].replace(/<[^>]+>/g, "")));
        if (cells.length < 6) continue;
        rows.push({
          numero: decode(tr[1]),
          paisAcreedor: cells[0],
          acreedor: cells[1],
          moneda: cells[2],
          montoOriginal: cells[3],
          ejecutor: cells[4],
          gaceta: cells[5],
          saldoUsd: cells[6] || null,
          fuente,
        });
      }
      page += 1;
    }
  }
  const unique = [...new Map(rows.map((r) => [r.numero + r.acreedor, r])).values()];
  await writeFile(new URL("prestamos-creditopublico.json", DIR), JSON.stringify(unique, null, 2));
  console.log("credito publico", unique.length);
}

await mkdir(DIR, { recursive: true });
await downloadWorldBank();
await downloadIdb();
await scrapeCreditoPublico();

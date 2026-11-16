import { useMemo, useState } from "react";
import { Header, Titulo, Barra, COLORES } from "../components/ui.jsx";
import { pesos, pct } from "../lib/formato.js";
import { calcularISR, itbisIncluido, umbralISR } from "../lib/calculo.js";

const KEY = "centinela.tuParte";
const leer = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
};

function Monto({ label, valor, onChange, nota }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        inputMode="numeric"
        value={valor ? `RD$ ${Number(valor).toLocaleString("es-DO")}` : ""}
        placeholder="RD$ 0"
        onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
      />
      {nota && <p>{nota}</p>}
    </label>
  );
}

function imagenHistoria({ total, reparto, periodo }) {
  const c = document.createElement("canvas");
  c.width = 1080;
  c.height = 1920;
  const g = c.getContext("2d");
  g.fillStyle = "#10221b";
  g.fillRect(0, 0, 1080, 1920);
  g.fillStyle = "#0f7a55";
  g.beginPath();
  g.arc(980, 120, 300, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "#fff";
  g.font = "800 56px Inter, sans-serif";
  g.fillText("Centinela", 90, 170);
  g.fillStyle = "#a9c4b9";
  g.font = "600 44px Inter, sans-serif";
  g.fillText("Este mes le di al Estado cerca de", 90, 400);
  g.fillStyle = "#fff";
  g.font = "800 150px Inter, sans-serif";
  g.fillText(pesos(total), 90, 560);
  g.fillStyle = "#a9c4b9";
  g.font = "600 40px Inter, sans-serif";
  g.fillText("Y así se repartió:", 90, 700);
  const max = Math.max(...reparto.map((r) => r.monto));
  reparto.slice(0, 8).forEach((r, i) => {
    const y = 790 + i * 118;
    g.fillStyle = "#fff";
    g.font = "700 40px Inter, sans-serif";
    g.fillText(r.nombre, 90, y);
    g.textAlign = "right";
    g.fillText(pesos(r.monto), 990, y);
    g.textAlign = "left";
    g.fillStyle = "rgba(255,255,255,.12)";
    g.fillRect(90, y + 22, 900, 22);
    g.fillStyle = r.id === "deuda" ? "#ff8a7a" : "#8fe0bd";
    g.fillRect(90, y + 22, (900 * r.monto) / max, 22);
  });
  g.fillStyle = "#a9c4b9";
  g.font = "600 34px Inter, sans-serif";
  g.fillText(`Según el gasto oficial ${periodo}.`, 90, 1770);
  g.fillText("Calcula el tuyo en centinela.do", 90, 1830);
  return c;
}

export default function TuParte({ datos }) {
  const reglas = datos.fuentes.reglas;
  const guardado = leer();
  const [modo, setModo] = useState(guardado.modo || "empleado");
  const [sueldo, setSueldo] = useState(guardado.sueldo ?? 35000);
  const [compras, setCompras] = useState(guardado.compras ?? 15000);
  const guardar = (o) => localStorage.setItem(KEY, JSON.stringify({ modo, sueldo, compras, ...o }));

  const r = useMemo(() => {
    const { isr, afp, sfs } = modo === "empleado" ? calcularISR(sueldo, reglas) : { isr: 0, afp: 0, sfs: 0 };
    const itbis = itbisIncluido(compras, reglas.itbis.tasa);
    const total = isr + itbis;
    const totalGasto = datos.gastos.total;
    const reparto = datos.gastos.categorias.map((c) => ({ id: c.id, nombre: c.nombre, monto: (total * c.devengado) / totalGasto }));
    return { isr, afp, sfs, itbis, total, reparto };
  }, [modo, sueldo, compras, reglas, datos]);

  const umbral = umbralISR(reglas);
  const maxR = Math.max(...r.reparto.map((x) => x.monto), 1);
  const texto = `Este mes le di al Estado cerca de ${pesos(r.total)} en impuestos. ${pesos(r.reparto.find((x) => x.id === "deuda")?.monto || 0)} se fueron a pagar deuda. Calcula el tuyo en Centinela:`;
  const url = typeof window !== "undefined" ? `${window.location.origin}/tu-parte` : "";

  const compartirImagen = async () => {
    const canvas = imagenHistoria({ total: r.total, reparto: r.reparto, periodo: datos.periodo.etiqueta });
    const blob = await new Promise((ok) => canvas.toBlob(ok, "image/png"));
    const file = new File([blob], "mi-parte-centinela.png", { type: "image/png" });
    if (navigator.canShare?.({ files: [file] })) {
      await navigator.share({ files: [file], text: texto, url }).catch(() => {});
    } else {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = file.name;
      a.click();
    }
  };

  return (
    <div className="wrap">
      <Header chip={`Reglas ISR ${reglas.anio}`} />
      <Titulo pre="Calculadora">¿Cuánto pusiste tú?</Titulo>

      <div className="panel">
        <div className="seg" style={{ marginTop: 2 }}>
          {[
            ["empleado", "Tengo sueldo"],
            ["sinSueldo", "No tengo sueldo fijo"],
          ].map(([k, l]) => (
            <button
              key={k}
              className={modo === k ? "on" : ""}
              style={{ background: modo === k ? undefined : "var(--bg)" }}
              onClick={() => {
                setModo(k);
                guardar({ modo: k });
              }}
            >
              {l}
            </button>
          ))}
        </div>
        {modo === "empleado" && (
          <Monto
            label="Tu sueldo bruto al mes (antes de descuentos)"
            valor={sueldo}
            onChange={(v) => {
              setSueldo(v);
              guardar({ sueldo: v });
            }}
          />
        )}
        <Monto
          label="Lo que gastas al mes en compras (súper, colmado, tiendas, gasolina, servicios)"
          valor={compras}
          onChange={(v) => {
            setCompras(v);
            guardar({ compras: v });
          }}
          nota="Ahí va escondido el ITBIS que pagas, aunque no lo veas."
        />
      </div>

      <div className="res">
        <small>Este mes le diste al Estado cerca de</small>
        <div className="n">{pesos(r.total)}</div>
        {modo === "empleado" && (
          <div className="ln">
            <span>ISR descontado de tu sueldo</span>
            <b>{pesos(r.isr)}</b>
          </div>
        )}
        <div className="ln">
          <span>
            ITBIS en tus compras<em>ESTIMADO</em>
          </span>
          <b>{pesos(r.itbis)}</b>
        </div>
        <div className="note">
          {modo === "empleado" && (
            <>
              Además te descuentan {pesos(r.afp + r.sfs)} de TSS. Eso no es impuesto: va a tu pensión (AFP) y a tu seguro
              de salud (SFS).
              <br />
              <br />
            </>
          )}
          Si ganas menos de ~{pesos(Math.ceil(umbral / 100) * 100)} al mes no pagas ISR, pero el ITBIS lo pagas igual en
          cada compra.
        </div>
      </div>

      <div className="panel">
        <h2>Así se repartió tu dinero</h2>
        <div className="sub">
          Tus {pesos(r.total)} según cómo gastó el Gobierno en {datos.periodo.etiqueta}
        </div>
        {r.reparto.map((x) => (
          <Barra
            key={x.id}
            label={
              <>
                <i style={{ display: "inline-block", width: 9, height: 9, borderRadius: 3, background: COLORES[x.id], marginRight: 6 }} />
                {x.nombre}
              </>
            }
            valor={pesos(x.monto)}
            fraccion={x.monto / maxR}
            rojo={x.id === "deuda"}
          />
        ))}
      </div>

      <div className="share">
        <a href={`https://wa.me/?text=${encodeURIComponent(`${texto} ${url}`)}`} target="_blank" rel="noreferrer">
          Compartir en WhatsApp
        </a>
        <button className="ig" onClick={compartirImagen}>
          Imagen para Stories
        </button>
      </div>

      <p className="src">
        ISR: {reglas.isr.fuente} (exento hasta {pesos(reglas.isr.tramos[1][0])} al año).
        <br />
        TSS: {reglas.tss.fuente}.
        <br />
        ITBIS: {pct(reglas.itbis.tasa)} ya incluido en el precio. Es un estimado: algunos productos de la canasta básica,
        medicinas y servicios no pagan ITBIS, así que lo real puede ser menor.
        <br />
        Nada de lo que escribes sale de tu teléfono.
      </p>
    </div>
  );
}

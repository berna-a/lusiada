import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const output = path.join(root, "public/eventos-marvila");

const CORES = {
  azul: "#073c78",
  creme: "#f7edd6",
  escuro: "#081f42",
  vermelho: "#c73216",
};

const eventos = {
  xadrez: {
    arte: path.join(here, "xadrez-revisao.png"),
    cartaz: path.join(here, "xadrez-inscricao-revisao.png"),
    data: "24 OUTUBRO 2026",
    hora: "10H–15H30",
    local: "BIBLIOTECA DE MARVILA · CAFETARIA",
    modalidade: "XADREZ",
    preco: "3 € · INGRESSO",
    programa: "CONVÍVIO 10H–14H · TORNEIO SUÍÇO 14H–15H30 · MEDALHAS 15H30",
    titulo: "TORNEIO ABERTO DE XADREZ",
    url: "alusiada.pt/xadrez",
    qr: path.join(here, "xadrez-qr.png"),
  },
  go: {
    arte: path.join(here, "go-revisao-v3.png"),
    cartaz: path.join(here, "go-revisao-v3.png"),
    data: "24 OUTUBRO 2026",
    hora: "15H30–20H",
    local: "BIBLIOTECA DE MARVILA · CAFETARIA",
    modalidade: "GO / IGO / BADUK",
    preco: "ENTRADA LIVRE",
    programa:
      "CONVÍVIO + ENSINO 15H30–18H30 · TORNEIO SUÍÇO 18H30–20H · MEDALHAS 20H",
    titulo: "EVENTO DE GO",
    url: "alusiada.pt/go",
    qr: path.join(here, "go-qr.png"),
  },
};

const logo = path.join(output, "apoio-cml-blx-preto.png");

function svg(width, height, body) {
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="${CORES.creme}"/>
      ${body}
    </svg>
  `);
}

function imagemEmCaixa(file, width, height, options = {}) {
  return sharp(file)
    .resize(width, height, {
      background: options.background ?? CORES.creme,
      fit: options.fit ?? "cover",
      position: options.position ?? "centre",
    })
    .png()
    .toBuffer();
}

function recorteArte(evento, width, height, uso = "site") {
  const isGo = evento === eventos.go;
  const source = isGo
    ? sharp(evento.arte).extract({
        left: 0,
        top: uso === "qtrack" ? 620 : 500,
        width: 1024,
        height: uso === "qtrack" ? 810 : 930,
      })
    : sharp(evento.arte).extract({
        left: 0,
        top: 0,
        width: 1054,
        height: 1000,
      });

  return source
    .resize(width, height, { fit: "cover", position: "centre" })
    .png()
    .toBuffer();
}

function apoio(width) {
  return sharp(logo)
    .resize({ width, withoutEnlargement: true })
    .png()
    .toBuffer();
}

function qr(file, size) {
  return sharp(file).resize(size, size, { kernel: "nearest" }).png().toBuffer();
}

async function gerarSite(nome, evento) {
  const art = await recorteArte(evento, 768, 418);
  const apoioLogo = await apoio(180);
  const apoioMeta = await sharp(apoioLogo).metadata();
  const apoioTop =
    418 + Math.max(0, Math.round((100 - (apoioMeta.height ?? 76)) / 2));
  const footer = svg(
    768,
    100,
    `<text x="36" y="43" fill="${CORES.escuro}" font-family="Arial, sans-serif" font-size="17" font-weight="700" letter-spacing="2">APOIO</text>`
  );

  await sharp({
    create: { width: 768, height: 518, channels: 3, background: CORES.creme },
  })
    .composite([
      { input: art, left: 0, top: 0 },
      { input: footer, left: 0, top: 418 },
      { input: apoioLogo, left: 150, top: apoioTop },
    ])
    .jpeg({ quality: 94, chromaSubsampling: "4:4:4" })
    .withMetadata({ density: 72 })
    .toFile(path.join(output, `${nome}-site.jpg`));
}

async function gerarQtrack(nome, evento) {
  const art = await recorteArte(evento, 310, 518, "qtrack");
  const apoioLogo = await apoio(150);
  const qrCode = await qr(evento.qr, 92);
  const tituloSize = nome === "xadrez" ? 21 : 24;
  const modalidadeSize = nome === "xadrez" ? 48 : 36;
  const programaLinhas =
    nome === "xadrez"
      ? ["CONVÍVIO · 10H–14H", "TORNEIO SUÍÇO · 14H–15H30", "MEDALHAS · 15H30"]
      : [
          "CONVÍVIO + ENSINO · 15H30–18H30",
          "TORNEIO SUÍÇO · 18H30–20H",
          "MEDALHAS · 20H",
        ];
  const panel = svg(
    458,
    518,
    `<rect width="14" height="518" fill="${CORES.vermelho}"/>
     <text x="40" y="48" fill="${CORES.vermelho}" font-family="Arial, sans-serif" font-size="${tituloSize}" font-weight="700" letter-spacing="1.5">${evento.titulo}</text>
     <text x="40" y="105" fill="${CORES.azul}" font-family="Arial, sans-serif" font-size="${modalidadeSize}" font-weight="800" letter-spacing="2">${evento.modalidade}</text>
     <text x="40" y="144" fill="${CORES.escuro}" font-family="Arial, sans-serif" font-size="17" font-weight="700">${evento.local}</text>
     <text x="40" y="172" fill="${CORES.escuro}" font-family="Arial, sans-serif" font-size="18" font-weight="700">${evento.data} · ${evento.hora}</text>
     <text x="40" y="220" fill="${CORES.vermelho}" font-family="Arial, sans-serif" font-size="23" font-weight="800" letter-spacing="1">${evento.preco}</text>
     <line x1="40" x2="418" y1="246" y2="246" stroke="${CORES.azul}" stroke-width="2"/>
     <text x="40" y="277" fill="${CORES.azul}" font-family="Arial, sans-serif" font-size="14" font-weight="700" letter-spacing="2">PROGRAMA</text>
     ${programaLinhas.map((linha, index) => `<text x="40" y="${311 + index * 27}" fill="${CORES.escuro}" font-family="Arial, sans-serif" font-size="15" font-weight="700">${linha}</text>`).join("")}
     <text x="40" y="426" fill="${CORES.escuro}" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">APOIO</text>
     <text x="338" y="490" fill="${CORES.azul}" font-family="Arial, sans-serif" font-size="11" font-weight="700" text-anchor="middle">${evento.url}</text>`
  );

  await sharp({
    create: { width: 768, height: 518, channels: 3, background: CORES.creme },
  })
    .composite([
      { input: art, left: 0, top: 0 },
      { input: panel, left: 310, top: 0 },
      { input: apoioLogo, left: 350, top: 438 },
      { input: qrCode, left: 648, top: 384 },
    ])
    .jpeg({ quality: 95, chromaSubsampling: "4:4:4" })
    .withMetadata({ density: 72 })
    .toFile(path.join(output, `${nome}-qtrack.jpg`));
}

async function gerarVertical(nome, evento, formato) {
  const isA3 = formato === "a3";
  const width = isA3 ? 2480 : 1080;
  const height = isA3 ? 3508 : 1920;
  const footerHeight = isA3 ? 390 : 330;
  const posterHeight = height - footerHeight;
  const cartaz = await imagemEmCaixa(evento.cartaz, width, posterHeight, {
    background: CORES.azul,
    fit: "contain",
  });
  const apoioWidth = isA3 ? 620 : 370;
  const apoioLogo = await apoio(apoioWidth);
  const qrSize = isA3 ? 270 : 220;
  const qrCode = await qr(evento.qr, qrSize);
  const pad = isA3 ? 130 : 54;
  const apoioY = posterHeight + (isA3 ? 104 : 100);
  const apoioLogoY = apoioY + 35;
  const qrX = width - pad - qrSize;
  const qrY = posterHeight + Math.round((footerHeight - qrSize) / 2) - 5;
  const metaBody = `<rect width="${width}" height="${footerHeight}" fill="${CORES.creme}"/>
    <text x="${pad}" y="${isA3 ? 86 : 72}" fill="${CORES.escuro}" font-family="Arial, sans-serif" font-size="${isA3 ? 38 : 22}" font-weight="700" letter-spacing="3">APOIO</text>
    <text x="${qrX + qrSize / 2}" y="${footerHeight - 28}" fill="${CORES.azul}" font-family="Arial, sans-serif" font-size="${isA3 ? 26 : 16}" font-weight="700" text-anchor="middle">${evento.url}</text>`;
  const footer = svg(width, footerHeight, metaBody);

  await sharp({
    create: { width, height, channels: 3, background: CORES.azul },
  })
    .composite([
      { input: cartaz, left: 0, top: 0 },
      { input: footer, left: 0, top: posterHeight },
      { input: apoioLogo, left: pad, top: apoioLogoY },
      { input: qrCode, left: qrX, top: qrY },
    ])
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4" })
    .withMetadata({ density: isA3 ? 300 : 72 })
    .toFile(path.join(output, `${nome}-${formato}.jpg`));
}

for (const [nome, evento] of Object.entries(eventos)) {
  await gerarSite(nome, evento);
  await gerarQtrack(nome, evento);
  await gerarVertical(nome, evento, "story");
  await gerarVertical(nome, evento, "a3");
}

console.log("Gerados 8 JPG finais em public/eventos-marvila/.");

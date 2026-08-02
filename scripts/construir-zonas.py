#!/usr/bin/env python3
"""Constrói o ficheiro das três zonas de Portugal para o mapa.

Junta, num só GeoJSON pequeno, o território português inteiro repartido por
três zonas — Continente, Açores e Madeira — cada uma com o seu mar e a sua
terra, mais a plataforma continental estendida.

Fontes (oficiais, acesso público, sem chave):
  · DGRM / PSOEM — polígonos da ZEE por sub-região e da plataforma continental
    para além das 200 milhas (fonte EMEPC, a proposta entregue às Nações
    Unidas em 2009 e emendada em 2017). É esta a que o mapa desenha, não a
    ZEE das 200 milhas.
  · Natural Earth 10m — a terra. Serve só de área sensível ao rato: o desenho
    da costa que se vê é o dos tiles, muito mais fino. Por isso pode ser
    grosseira; o que não pode é faltar-lhe uma ilha.

Correr à mão quando as fontes mudarem (raro):
    python3 scripts/construir-zonas.py
"""

import json
import math
import urllib.request

DGRM = (
    "https://webgis.dgrm.mm.gov.pt/arcgis/rest/services/PSOEM/"
    "AguasMarinhas_PT/MapServer/{}/query"
    "?where=1%3D1&outFields=*&outSR=4326&f=geojson"
)
NATURAL_EARTH = (
    "https://raw.githubusercontent.com/martynafford/natural-earth-geojson/"
    "master/10m/cultural/ne_10m_admin_0_countries.json"
)

# Camadas do serviço da DGRM.
CAMADA_ZEE = {"continente": 12, "acores": 13, "madeira": 14}
CAMADA_EXTENSAO = 15

# ~250 m. O mapa nunca desenha estas formas de perto — ao aproximar, as zonas
# desaparecem e ficam os tiles. Mas o limite da ZEE segue a linha de costa, e
# com folga a mais o mar transbordava para dentro da terra.
TOLERANCIA = 0.0025

DESTINO = "public/geo/zonas-portugal.json"


def buscar(url: str) -> dict:
    print(f"  ← {url[:78]}…")
    with urllib.request.urlopen(url, timeout=120) as r:
        return json.load(r)


def distancia_da_recta(p, a, b) -> float:
    """Distância perpendicular de `p` ao segmento `a`–`b`, em graus."""
    dx, dy = b[0] - a[0], b[1] - a[1]
    if dx == 0 and dy == 0:
        return math.hypot(p[0] - a[0], p[1] - a[1])
    return abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / math.hypot(dx, dy)


def simplificar(pontos: list, tol: float) -> list:
    """Douglas–Peucker. Iterativo: as costas têm milhares de vértices e a
    versão recursiva estoira a pilha em algumas delas."""
    if len(pontos) < 3:
        return pontos
    manter = [False] * len(pontos)
    manter[0] = manter[-1] = True
    pilha = [(0, len(pontos) - 1)]
    while pilha:
        inicio, fim = pilha.pop()
        pior, indice = 0.0, -1
        for i in range(inicio + 1, fim):
            d = distancia_da_recta(pontos[i], pontos[inicio], pontos[fim])
            if d > pior:
                pior, indice = d, i
        if indice != -1 and pior > tol:
            manter[indice] = True
            pilha.append((inicio, indice))
            pilha.append((indice, fim))
    return [p for p, k in zip(pontos, manter) if k]


def simplificar_anel(anel: list, tol: float) -> list | None:
    """Um anel tem de fechar e tem de continuar a ser um polígono. Se a
    simplificação o reduz a menos de quatro pontos, deita-se fora — é uma
    ilhota que a esta escala não se vê."""
    simples = simplificar(anel, tol)
    if simples[0] != simples[-1]:
        simples.append(simples[0])
    if len(simples) < 4:
        return None
    return [[round(x, 5), round(y, 5)] for x, y in simples]


def simplificar_geometria(g: dict, tol: float) -> dict:
    poligonos = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
    saida = []
    for poligono in poligonos:
        aneis = [a for a in (simplificar_anel(r, tol) for r in poligono) if a]
        if aneis:
            saida.append(aneis)
    return {"type": "MultiPolygon", "coordinates": saida}


def zona_da_parte(anel: list) -> str:
    """A que zona pertence esta ilha (ou o continente). As três estão
    suficientemente afastadas para a longitude decidir sozinha."""
    lon = sum(p[0] for p in anel) / len(anel)
    if lon < -20:
        return "acores"
    if lon < -12:
        return "madeira"
    return "continente"


def main() -> None:
    print("Mar — DGRM/EMEPC")
    features = []

    for zona, camada in CAMADA_ZEE.items():
        dados = buscar(DGRM.format(camada))
        for f in dados["features"]:
            features.append(
                {
                    "type": "Feature",
                    "properties": {"zona": zona, "tipo": "mar"},
                    "geometry": simplificar_geometria(f["geometry"], TOLERANCIA),
                }
            )

    dados = buscar(DGRM.format(CAMADA_EXTENSAO))
    for f in dados["features"]:
        features.append(
            {
                "type": "Feature",
                "properties": {"zona": None, "tipo": "extensao"},
                "geometry": simplificar_geometria(f["geometry"], TOLERANCIA),
            }
        )

    print("Terra — Natural Earth 10m")
    mundo = buscar(NATURAL_EARTH)
    portugal = next(
        f for f in mundo["features"] if f["properties"].get("NAME") == "Portugal"
    )
    partes: dict[str, list] = {"continente": [], "acores": [], "madeira": []}
    for poligono in portugal["geometry"]["coordinates"]:
        aneis = [a for a in (simplificar_anel(r, TOLERANCIA) for r in poligono) if a]
        if aneis:
            partes[zona_da_parte(aneis[0])].append(aneis)
    for zona, poligonos in partes.items():
        features.append(
            {
                "type": "Feature",
                "properties": {"zona": zona, "tipo": "terra"},
                "geometry": {"type": "MultiPolygon", "coordinates": poligonos},
            }
        )

    coleccao = {"type": "FeatureCollection", "features": features}
    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(coleccao, f, separators=(",", ":"), ensure_ascii=False)

    pontos = sum(
        len(anel)
        for feature in features
        for poligono in feature["geometry"]["coordinates"]
        for anel in poligono
    )
    tamanho = len(json.dumps(coleccao, separators=(",", ":")))
    print(f"\n{DESTINO}: {len(features)} formas, {pontos} pontos, {tamanho // 1024} KB")


if __name__ == "__main__":
    main()

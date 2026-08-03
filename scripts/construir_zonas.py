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
    python3 scripts/construir_zonas.py
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

# ~5 km². Abaixo disto não é território, é lasca de fronteira mal casada.
AREA_MINIMA = 0.0005

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


def centro(aneis: list) -> tuple:
    """Centro do maior anel — serve de âncora da zona no reparte do mar."""
    maior = max(aneis, key=len)
    return (
        sum(p[0] for p in maior) / len(maior),
        sum(p[1] for p in maior) / len(maior),
    )


def do_lado_de(ponto, aqui, outro) -> bool:
    """O ponto está mais perto de `aqui` do que de `outro`?"""
    return (ponto[0] - aqui[0]) ** 2 + (ponto[1] - aqui[1]) ** 2 <= (
        ponto[0] - outro[0]
    ) ** 2 + (ponto[1] - outro[1]) ** 2


def cortar(anel: list, aqui, outro) -> list:
    """Corta um anel pela mediatriz entre duas zonas (Sutherland–Hodgman).

    Fica só a parte do anel que está do lado de `aqui`. A mediatriz é uma
    recta, por isso o corte é simples e o resultado continua a ser um anel.
    """
    saida = []
    for i in range(len(anel) - 1):
        a, b = anel[i], anel[i + 1]
        a_dentro, b_dentro = do_lado_de(a, aqui, outro), do_lado_de(b, aqui, outro)
        if a_dentro:
            saida.append(a)
        if a_dentro != b_dentro:
            # Onde o segmento atravessa a mediatriz. `t` sai da equação das
            # distâncias iguais, que em coordenadas é linear.
            da = (a[0] - aqui[0]) ** 2 + (a[1] - aqui[1]) ** 2 - (
                (a[0] - outro[0]) ** 2 + (a[1] - outro[1]) ** 2
            )
            db = (b[0] - aqui[0]) ** 2 + (b[1] - aqui[1]) ** 2 - (
                (b[0] - outro[0]) ** 2 + (b[1] - outro[1]) ** 2
            )
            t = da / (da - db)
            saida.append([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t])
    if len(saida) < 3:
        return []
    saida.append(saida[0])
    return saida


def repartir(poligono: list, aqui, outros: list) -> list:
    """A parte de um polígono que pertence a uma zona: o que sobra depois de
    cortado pelas mediatrizes que a separam das outras duas."""
    aneis = []
    for anel in poligono:
        corte = anel
        for outro in outros:
            corte = cortar(corte, aqui, outro)
            if not corte:
                break
        if corte:
            aneis.append(corte)
    return aneis


def dissolver(poligonos: list) -> list:
    """Junta polígonos vizinhos apagando as fronteiras que partilham.

    Duas áreas encostadas descrevem a fronteira comum com os mesmos vértices,
    uma num sentido e a outra no sentido contrário. Cancelando os pares
    opostos sobram só as arestas do contorno exterior, que depois se encadeiam
    em anéis. Tem de correr ANTES de simplificar — depois de simplificar, cada
    lado da fronteira já não tem os mesmos pontos e nada cancela.
    """
    arestas: dict[tuple, int] = {}
    for anel in poligonos:
        for i in range(len(anel) - 1):
            a, b = tuple(anel[i]), tuple(anel[i + 1])
            if a == b:
                continue
            if arestas.get((b, a)):
                arestas[(b, a)] -= 1
                if arestas[(b, a)] == 0:
                    del arestas[(b, a)]
            else:
                arestas[(a, b)] = arestas.get((a, b), 0) + 1

    seguintes: dict[tuple, list] = {}
    for a, b in arestas:
        seguintes.setdefault(a, []).append(b)

    aneis = []
    while seguintes:
        inicio = next(iter(seguintes))
        anel = [inicio]
        actual = inicio
        while True:
            saidas = seguintes.get(actual)
            if not saidas:
                break
            proximo = saidas.pop()
            if not saidas:
                del seguintes[actual]
            anel.append(proximo)
            actual = proximo
            if actual == inicio:
                break
        if len(anel) > 3 and anel[0] == anel[-1]:
            aneis.append([list(p) for p in anel])
    return aneis


def dentro(ponto, anel) -> bool:
    """Lançamento de raio: conta as travessias da fronteira à direita."""
    x, y = ponto
    passou = False
    for i in range(len(anel) - 1):
        x1, y1 = anel[i]
        x2, y2 = anel[i + 1]
        if (y1 > y) != (y2 > y) and x < x1 + (y - y1) * (x2 - x1) / (y2 - y1):
            passou = not passou
    return passou


def ancora(anel: list) -> list:
    """Onde pousar o nome da província.

    O centro geométrico de uma forma recortada cai muitas vezes fora dela —
    a Estremadura tem o seu no meio do Tejo. Por isso varre-se uma grelha e
    escolhe-se o ponto de dentro que fica mais longe da fronteira: é o sítio
    onde há mais espaço livre para escrever.
    """
    xs = [c[0] for c in anel]
    ys = [c[1] for c in anel]
    melhor, folga_maxima = None, -1.0
    passos = 28
    for i in range(1, passos):
        x = min(xs) + (max(xs) - min(xs)) * i / passos
        for j in range(1, passos):
            y = min(ys) + (max(ys) - min(ys)) * j / passos
            if not dentro((x, y), anel):
                continue
            folga = min((x - a) ** 2 + (y - b) ** 2 for a, b in anel)
            if folga > folga_maxima:
                melhor, folga_maxima = [round(x, 4), round(y, 4)], folga
    return melhor or [sum(xs) / len(xs), sum(ys) / len(ys)]


def area(anel: list) -> float:
    s = 0.0
    for i in range(len(anel) - 1):
        s += anel[i][0] * anel[i + 1][1] - anel[i + 1][0] * anel[i][1]
    return abs(s) / 2


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

    mares: dict[str, list] = {}
    for zona, camada in CAMADA_ZEE.items():
        dados = buscar(DGRM.format(camada))
        mares[zona] = [
            p
            for f in dados["features"]
            for p in (
                [f["geometry"]["coordinates"]]
                if f["geometry"]["type"] == "Polygon"
                else f["geometry"]["coordinates"]
            )
        ]

    for zona, poligonos in mares.items():
        features.append(
            {
                "type": "Feature",
                "properties": {"zona": zona, "tipo": "mar"},
                "geometry": simplificar_geometria(
                    {"type": "MultiPolygon", "coordinates": poligonos}, TOLERANCIA
                ),
            }
        )

    # A plataforma estendida chega numa mancha só. Reparte-se pelas três zonas
    # pela mediatriz entre elas — cada pedaço fica com a zona de que está mais
    # perto. Fica em separado da ZEE de propósito: no mapa serve para o rato
    # saber a que zona pertence aquele pedaço de Atlântico, mas nunca se
    # desenha nem se acende.
    centros = {z: centro([a for poly in p for a in poly]) for z, p in mares.items()}
    dados = buscar(DGRM.format(CAMADA_EXTENSAO))
    for f in dados["features"]:
        g = f["geometry"]
        partes = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for zona, aqui in centros.items():
            outros = [c for z, c in centros.items() if z != zona]
            pedacos = [p for parte in partes if (p := repartir(parte, aqui, outros))]
            if pedacos:
                features.append(
                    {
                        "type": "Feature",
                        "properties": {"zona": zona, "tipo": "extensao"},
                        "geometry": simplificar_geometria(
                            {"type": "MultiPolygon", "coordinates": pedacos},
                            TOLERANCIA,
                        ),
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

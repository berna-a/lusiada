#!/usr/bin/env python3
"""Constrói as províncias históricas de Portugal continental para o mapa.

As províncias da divisão de 1936 — Minho, Beira Alta, Ribatejo, Alentejo… —
não são divisão administrativa e não existem em nenhuma carta oficial. Mas
são a divisão que as pessoas ainda usam quando falam de onde são, e é essa
que interessa a um mapa de património.

Cada província é um conjunto de concelhos. O que este ficheiro faz é juntar
os polígonos dos concelhos de cada província num só, apagando as fronteiras
interiores, e simplificar o resultado.

Fonte da geometria: CAOP (Carta Administrativa Oficial de Portugal), pelo
repositório nmota/caop_GeoJSON. A composição de cada província vem da
Wikipédia em português, artigo a artigo.

Correr à mão quando a fonte mudar (raro):
    python3 scripts/construir-provincias.py
"""

import json
import unicodedata
import urllib.request

from construir_zonas import area, dissolver, simplificar_anel

CONCELHOS = (
    "https://raw.githubusercontent.com/nmota/caop_GeoJSON/master/"
    "Portugal_Municipalities.geojson"
)

DESTINO = "public/geo/provincias-portugal.json"

# ~250 m, o mesmo critério das zonas: estas formas nunca se vêem de perto.
TOLERANCIA = 0.0025

# ~5 km². Abaixo disto não é território, é lasca de fronteira mal casada.
AREA_MINIMA = 0.0005

# A divisão de 1936, concelho a concelho. Os quatro concelhos criados depois
# (Amadora, Odivelas, Trofa, Vizela) vão para a província do concelho de onde
# se separaram.
# As sete províncias tradicionais. A divisão do Renascimento tinha seis —
# Entre-Douro-e-Minho, Trás-os-Montes, Beira, Estremadura, Entre-Tejo-e-Odiana
# (o Alentejo) e o Reino do Algarve. O Ribatejo é o sétimo, destacado da
# Estremadura em 1832.
#
# Cada uma é a soma de províncias de 1936, que é a divisão de que há listas de
# concelhos fiáveis. As fronteiras não mudaram: só se apagam as de dentro.
AGRUPAMENTO = {
    "Minho": "Minho",
    "Douro Litoral": "Minho",
    "Trás-os-Montes e Alto Douro": "Trás-os-Montes",
    "Beira Alta": "Beira",
    "Beira Litoral": "Beira",
    "Beira Baixa": "Beira",
    "Estremadura": "Estremadura",
    "Ribatejo": "Ribatejo",
    "Alto Alentejo": "Alentejo",
    "Baixo Alentejo": "Alentejo",
    "Algarve": "Algarve",
}

# A divisão de 1936, concelho a concelho, separados por `;`. Os quatro
# concelhos criados depois (Amadora, Odivelas, Trofa, Vizela) vão para a
# província do concelho de onde se separaram.
PROVINCIAS: dict[str, str] = {
    "Minho": """
        Amares; Barcelos; Braga; Cabeceiras de Basto; Celorico de Basto;
        Esposende; Fafe; Guimarães; Póvoa de Lanhoso; Terras de Bouro;
        Vieira do Minho; Vila Nova de Famalicão; Vila Verde; Vizela;
        Arcos de Valdevez; Caminha; Melgaço; Monção; Paredes de Coura;
        Ponte da Barca; Ponte de Lima; Valença; Viana do Castelo;
        Vila Nova de Cerveira""",
    "Douro Litoral": """
        Amarante; Baião; Felgueiras; Gondomar; Lousada; Maia;
        Marco de Canaveses; Matosinhos; Paços de Ferreira; Paredes;
        Penafiel; Porto; Póvoa de Varzim; Santo Tirso; Trofa; Valongo;
        Vila do Conde; Vila Nova de Gaia; Arouca; Espinho;
        Santa Maria da Feira; Castelo de Paiva; Cinfães; Resende""",
    "Trás-os-Montes e Alto Douro": """
        Alfândega da Fé; Bragança; Carrazeda de Ansiães;
        Freixo de Espada à Cinta; Macedo de Cavaleiros; Miranda do Douro;
        Mirandela; Mogadouro; Torre de Moncorvo; Vila Flor; Vimioso;
        Vinhais; Alijó; Boticas; Chaves; Mesão Frio; Mondim de Basto;
        Montalegre; Murça; Peso da Régua; Ribeira de Pena; Sabrosa;
        Santa Marta de Penaguião; Valpaços; Vila Pouca de Aguiar;
        Vila Real; Armamar; Lamego; São João da Pesqueira; Tabuaço;
        Vila Nova de Foz Côa""",
    "Beira Alta": """
        Aguiar da Beira; Almeida; Celorico da Beira;
        Figueira de Castelo Rodrigo; Fornos de Algodres; Gouveia; Guarda;
        Manteigas; Mêda; Pinhel; Sabugal; Seia; Trancoso; Carregal do Sal;
        Castro Daire; Mangualde; Moimenta da Beira; Mortágua; Nelas;
        Oliveira de Frades; Penalva do Castelo; Penedono; Santa Comba Dão;
        São Pedro do Sul; Sátão; Sernancelhe; Tarouca; Tondela;
        Vila Nova de Paiva; Viseu; Vouzela; Oliveira do Hospital; Tábua""",
    "Beira Litoral": """
        Águeda; Albergaria-a-Velha; Anadia; Aveiro; Estarreja; Ílhavo;
        Mealhada; Murtosa; Oliveira de Azeméis; Oliveira do Bairro; Ovar;
        São João da Madeira; Sever do Vouga; Vagos; Vale de Cambra;
        Arganil; Cantanhede; Coimbra; Condeixa-a-Nova; Figueira da Foz;
        Góis; Lousã; Mira; Miranda do Corvo; Montemor-o-Velho; Penacova;
        Penela; Soure; Vila Nova de Poiares; Alvaiázere; Ansião; Batalha;
        Castanheira de Pera; Figueiró dos Vinhos; Leiria; Pedrógão Grande;
        Pombal; Ourém""",
    "Beira Baixa": """
        Belmonte; Castelo Branco; Covilhã; Fundão; Idanha-a-Nova; Oleiros;
        Penamacor; Proença-a-Nova; Sertã; Vila de Rei; Vila Velha de Ródão;
        Pampilhosa da Serra; Mação""",
    "Ribatejo": """
        Abrantes; Alcanena; Almeirim; Alpiarça; Benavente; Cartaxo;
        Chamusca; Constância; Coruche; Entroncamento; Ferreira do Zêzere;
        Golegã; Rio Maior; Salvaterra de Magos; Santarém; Sardoal; Tomar;
        Torres Novas; Vila Nova da Barquinha; Azambuja;
        Vila Franca de Xira; Ponte de Sor""",
    "Estremadura": """
        Alcobaça; Bombarral; Caldas da Rainha; Marinha Grande; Nazaré;
        Óbidos; Peniche; Porto de Mós; Alenquer; Arruda dos Vinhos;
        Cadaval; Cascais; Lisboa; Loures; Lourinhã; Mafra; Oeiras; Sintra;
        Sobral de Monte Agraço; Torres Vedras; Amadora; Odivelas;
        Alcochete; Almada; Barreiro; Moita; Montijo; Palmela; Seixal;
        Sesimbra; Setúbal""",
    "Alto Alentejo": """
        Alandroal; Arraiolos; Borba; Estremoz; Évora; Montemor-o-Novo;
        Mora; Mourão; Portel; Redondo; Reguengos de Monsaraz;
        Vendas Novas; Viana do Alentejo; Vila Viçosa; Alter do Chão;
        Arronches; Avis; Campo Maior; Castelo de Vide; Crato; Elvas;
        Fronteira; Gavião; Marvão; Monforte; Nisa; Portalegre; Sousel""",
    "Baixo Alentejo": """
        Aljustrel; Almodôvar; Alvito; Barrancos; Beja; Castro Verde; Cuba;
        Ferreira do Alentejo; Mértola; Moura; Odemira; Ourique; Serpa;
        Vidigueira; Alcácer do Sal; Grândola; Santiago do Cacém; Sines""",
    "Algarve": """
        Albufeira; Alcoutim; Aljezur; Castro Marim; Faro; Lagoa; Lagos;
        Loulé; Monchique; Olhão; Portimão; São Brás de Alportel; Silves;
        Tavira; Vila do Bispo; Vila Real de Santo António""",
}


def chave(nome: str) -> str:
    """Nome comparável: sem acentos, sem maiúsculas, sem espaço a mais."""
    sem_acento = "".join(
        c
        for c in unicodedata.normalize("NFD", nome)
        if unicodedata.category(c) != "Mn"
    )
    return " ".join(sem_acento.lower().split())


def lista_de(bloco: str) -> list[str]:
    """Os nomes vêm separados por `;`, com as quebras de linha e a indentação
    do bloco de texto pelo meio."""
    return [" ".join(n.split()) for n in bloco.split(";") if n.strip()]


def main() -> None:
    print(f"  ← {CONCELHOS[:78]}…")
    with urllib.request.urlopen(CONCELHOS, timeout=180) as r:
        dados = json.load(r)

    de_concelho = {}
    for provincia, bloco in PROVINCIAS.items():
        for nome in lista_de(bloco):
            de_concelho[chave(nome)] = AGRUPAMENTO[provincia]
    provincias = list(dict.fromkeys(AGRUPAMENTO.values()))
    print(f"{len(provincias)} províncias, {len(de_concelho)} concelhos na tabela")

    por_provincia: dict[str, list] = {p: [] for p in provincias}
    sem_provincia = []
    for f in dados["features"]:
        p = f["properties"]
        if p.get("NUTI_DSG") != "CONTINENTE":
            continue
        nome = p.get("Concelho") or ""
        provincia = de_concelho.get(chave(nome))
        if not provincia:
            sem_provincia.append(nome)
            continue
        g = f["geometry"]
        partes = [g["coordinates"]] if g["type"] == "Polygon" else g["coordinates"]
        for parte in partes:
            por_provincia[provincia].extend(parte)

    if sem_provincia:
        print(f"\n⚠️  {len(sem_provincia)} concelhos sem província: {sem_provincia}")

    features = []
    for provincia, aneis in por_provincia.items():
        if not aneis:
            print(f"⚠️  {provincia} ficou vazia")
            continue
        # Os concelhos da CAOP não partilham vértices exactamente iguais ao
        # longo das fronteiras comuns, por isso o cancelamento deixa lascas
        # microscópicas entre eles. São ruído: ficam só os contornos com área
        # a sério — o corpo da província e as parcelas separadas por água.
        contornos = [a for a in dissolver(aneis) if area(a) > AREA_MINIMA]
        if len(contornos) > 12:
            print(f"⚠️  {provincia}: {len(contornos)} contornos — topologia suspeita")
        contornos.sort(key=area, reverse=True)
        poligonos = []
        for anel in contornos:
            simples = simplificar_anel(anel, TOLERANCIA)
            if simples:
                poligonos.append([simples])
        xs = [c[0] for poly in poligonos for r in poly for c in r]
        ys = [c[1] for poly in poligonos for r in poly for c in r]
        # O nome vai numa forma à parte. Numa província de duas parcelas — a
        # Estremadura, cortada pelo Tejo — o MapLibre escrevia-o duas vezes,
        # uma em cada uma.
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "tipo": "nome",
                    "provincia": chave(provincia).replace(" ", "-"),
                    "nome": provincia,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": ancora(poligonos[0][0]),
                },
            }
        )
        features.append(
            {
                "type": "Feature",
                "properties": {
                    "tipo": "area",
                    "provincia": chave(provincia).replace(" ", "-"),
                    "nome": provincia,
                    # Texto e não lista: as propriedades chegam ao MapLibre
                    # achatadas, e uma lista aninhada volta de lá como algo
                    # que já não se consegue ler.
                    "limites": ",".join(
                        str(round(v, 4))
                        for v in (min(xs), min(ys), max(xs), max(ys))
                    ),
                },
                "geometry": {"type": "MultiPolygon", "coordinates": poligonos},
            }
        )
        print(f"  {provincia}: {len(poligonos)} formas")

    coleccao = {"type": "FeatureCollection", "features": features}
    with open(DESTINO, "w", encoding="utf-8") as f:
        json.dump(coleccao, f, separators=(",", ":"), ensure_ascii=False)
    tamanho = len(json.dumps(coleccao, separators=(",", ":")))
    print(f"\n{DESTINO}: {len(features) // 2} províncias, {tamanho // 1024} KB")


if __name__ == "__main__":
    main()

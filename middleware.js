// Edge Middleware: corre ANTES do filesystem, por isso é o único sítio onde
// podemos prerenderizar a raiz "/" do domínio dedicado oslusiadas.pt (onde o
// index.html estático seria servido directamente, ignorando os rewrites).
// Para oslusiadas.pt/ entrega o HTML prerenderizado (og:image próprio); para a
// alusiada.pt e tudo o resto, segue o caminho normal.

export const config = { matcher: "/" };

export default function middleware(request) {
  const host = request.headers.get("host") || "";
  if (!/(^|\.)oslusiadas\.pt$/i.test(host)) {
    return; // alusiada.pt e outros — comportamento normal (homepage)
  }
  const url = new URL(request.url);
  url.pathname = "/api/os-lusiadas";
  url.searchParams.set("c", "1");
  url.searchParams.set("home", "1");
  return fetch(url, { headers: request.headers });
}

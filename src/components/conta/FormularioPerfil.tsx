import { useMutation, useQuery } from "convex/react";
import { Check, ImagePlus, Loader2, X } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";

const MAX_BIO = 400;

type Valores = {
  handle: string;
  nomePublico: string;
  bio: string;
  concelho: string;
  avatarUrl: string | null;
  capaUrl: string | null;
  perfilPrivado: boolean;
};

type Props = {
  inicial: Valores;
  /** Nas boas-vindas o texto do botão e o tom são outros. */
  modo: "boas-vindas" | "editar";
  onGuardado: (handle: string) => void;
};

async function enviarAvatar(
  gerarUrl: () => Promise<string>,
  ficheiro: File
): Promise<Id<"_storage">> {
  const url = await gerarUrl();
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": ficheiro.type },
    body: ficheiro,
  });
  if (!res.ok) {
    throw new Error("Falha no envio da imagem.");
  }
  const { storageId } = await res.json();
  return storageId;
}

/** Um só formulário para as boas-vindas e para a edição — são os mesmos campos. */
export function FormularioPerfil({ inicial, modo, onGuardado }: Props) {
  const guardar = useMutation(api.perfis.guardar);
  const gerarUrl = useMutation(api.perfis.generateUploadUrl);

  const [handle, setHandle] = useState(inicial.handle);
  const [nome, setNome] = useState(inicial.nomePublico);
  const [bio, setBio] = useState(inicial.bio);
  const [concelho, setConcelho] = useState(inicial.concelho);
  const [privado, setPrivado] = useState(inicial.perfilPrivado);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [preVisual, setPreVisual] = useState<string | null>(inicial.avatarUrl);
  const [removerAvatar, setRemoverAvatar] = useState(false);
  const [capa, setCapa] = useState<File | null>(null);
  const [preCapa, setPreCapa] = useState<string | null>(inicial.capaUrl);
  const [removerCapa, setRemoverCapa] = useState(false);
  const [aGuardar, setAGuardar] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  // Verificação do nome de utilizador enquanto se escreve, com folga para
  // não disparar a cada tecla.
  const [handleDebounced, setHandleDebounced] = useState(handle);
  useEffect(() => {
    const t = setTimeout(() => setHandleDebounced(handle), 400);
    return () => clearTimeout(t);
  }, [handle]);
  const disponibilidade = useQuery(
    api.perfis.handleLivre,
    handleDebounced.length >= 3 ? { handle: handleDebounced } : "skip"
  );

  useEffect(
    () => () => {
      if (preVisual?.startsWith("blob:")) {
        URL.revokeObjectURL(preVisual);
      }
    },
    [preVisual]
  );

  const escolherCapa = (f: File | null) => {
    if (preCapa?.startsWith("blob:")) {
      URL.revokeObjectURL(preCapa);
    }
    setCapa(f);
    setPreCapa(f ? URL.createObjectURL(f) : null);
    setRemoverCapa(!f);
  };

  const escolherAvatar = (f: File | null) => {
    if (preVisual?.startsWith("blob:")) {
      URL.revokeObjectURL(preVisual);
    }
    setAvatar(f);
    setPreVisual(f ? URL.createObjectURL(f) : null);
    setRemoverAvatar(!f);
  };

  const submeter = async (e: FormEvent) => {
    e.preventDefault();
    setErro(null);
    if (disponibilidade && !disponibilidade.livre) {
      setErro(
        disponibilidade.motivo === "ocupado"
          ? "Esse nome de utilizador já está a ser usado."
          : "Esse nome de utilizador não serve. Use letras minúsculas, números e travessões."
      );
      return;
    }
    setAGuardar(true);
    try {
      const avatarId = avatar
        ? await enviarAvatar(gerarUrl, avatar)
        : undefined;
      const capaId = capa ? await enviarAvatar(gerarUrl, capa) : undefined;
      const r = await guardar({
        handle,
        nomePublico: nome,
        bio: bio.trim() || undefined,
        concelho: concelho.trim() || undefined,
        avatarId,
        removerAvatar: removerAvatar && !avatar ? true : undefined,
        capaId,
        removerCapa: removerCapa && !capa ? true : undefined,
        perfilPrivado: privado,
      });
      onGuardado(r.handle);
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Não foi possível guardar.");
    } finally {
      setAGuardar(false);
    }
  };

  const campo =
    "mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-3 font-body text-[16px] text-foreground outline-none transition-colors focus:border-accent";
  const rotulo =
    "font-body text-[11px] text-muted-foreground uppercase tracking-[0.16em]";

  return (
    <form onSubmit={submeter}>
      {/* Capa — a faixa larga no topo do perfil. */}
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="relative h-28 bg-secondary sm:h-36">
          {preCapa && (
            <img
              alt="A sua capa"
              className="h-full w-full object-cover"
              src={preCapa}
            />
          )}
          <label className="absolute right-3 bottom-3 cursor-pointer rounded-full bg-black/50 px-3.5 py-1.5 font-body text-[12px] text-white backdrop-blur-md">
            <input
              accept="image/*"
              className="hidden"
              onChange={(e) => escolherCapa(e.target.files?.[0] ?? null)}
              type="file"
            />
            {preCapa ? "Trocar capa" : "Escolher capa"}
          </label>
          {preCapa && (
            <button
              className="absolute top-3 right-3 grid h-7 w-7 place-items-center rounded-full bg-black/50 text-white"
              onClick={() => escolherCapa(null)}
              type="button"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Retrato */}
      <div className="mt-5" />
      <div className="flex items-center gap-4">
        <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-secondary">
          {preVisual ? (
            <img
              alt="O seu retrato"
              className="h-full w-full object-cover"
              src={preVisual}
            />
          ) : (
            <ImagePlus
              className="h-6 w-6 text-muted-foreground"
              strokeWidth={1.5}
            />
          )}
        </span>
        <div>
          <label className="inline-flex cursor-pointer items-center rounded-full border border-border px-4 py-2 font-body text-[13px] text-foreground transition-colors hover:border-accent/50">
            <input
              accept="image/*"
              className="hidden"
              onChange={(e) => escolherAvatar(e.target.files?.[0] ?? null)}
              type="file"
            />
            {preVisual ? "Trocar retrato" : "Escolher retrato"}
          </label>
          {preVisual && (
            <button
              className="ml-2 inline-flex items-center gap-1 font-body text-[13px] text-muted-foreground hover:text-foreground"
              onClick={() => escolherAvatar(null)}
              type="button"
            >
              <X size={14} /> remover
            </button>
          )}
        </div>
      </div>

      <label className="mt-6 block">
        <span className={rotulo}>Nome a mostrar</span>
        <input
          className={campo}
          maxLength={80}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Como quer ser tratado"
          type="text"
          value={nome}
        />
      </label>

      <label className="mt-4 block">
        <span className={rotulo}>O seu endereço</span>
        <div className="relative">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 font-body text-[16px] text-muted-foreground">
            alusiada.pt/
          </span>
          <input
            autoCapitalize="none"
            autoCorrect="off"
            className={`${campo} pr-10 pl-[7.6rem]`}
            maxLength={24}
            onChange={(e) => setHandle(e.target.value.toLowerCase())}
            placeholder="o-seu-nome"
            type="text"
            value={handle}
          />
          {handleDebounced.length >= 3 && disponibilidade && (
            <span className="absolute top-1/2 right-3 -translate-y-1/2">
              {disponibilidade.livre ? (
                <Check className="h-4 w-4 text-accent" strokeWidth={2.5} />
              ) : (
                <X className="h-4 w-4 text-destructive" strokeWidth={2.5} />
              )}
            </span>
          )}
        </div>
        <span className="mt-1.5 block font-body text-[12px] text-muted-foreground">
          {disponibilidade && !disponibilidade.livre
            ? disponibilidade.motivo === "ocupado"
              ? "Já está a ser usado."
              : "Só letras minúsculas, números e travessões."
            : "É o endereço público do seu perfil."}
        </span>
      </label>

      <label className="mt-4 block">
        <span className={rotulo}>Concelho (opcional)</span>
        <input
          className={campo}
          maxLength={80}
          onChange={(e) => setConcelho(e.target.value)}
          placeholder="Onde vive"
          type="text"
          value={concelho}
        />
      </label>

      <label className="mt-4 block">
        <span className={rotulo}>Uma linha sobre si (opcional)</span>
        <textarea
          className={`${campo} min-h-[90px] resize-y`}
          maxLength={MAX_BIO}
          onChange={(e) => setBio(e.target.value)}
          placeholder="O que o traz à Lusíada"
          value={bio}
        />
        <span className="mt-1 block text-right font-body text-[12px] text-muted-foreground">
          {bio.length}/{MAX_BIO}
        </span>
      </label>

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          checked={privado}
          className="mt-1 h-4 w-4 accent-[hsl(var(--accent))]"
          onChange={(e) => setPrivado(e.target.checked)}
          type="checkbox"
        />
        <span className="font-body text-[14px] text-foreground/80 leading-relaxed">
          Manter o perfil privado.
          <span className="block text-[13px] text-muted-foreground">
            Os seus contributos continuam no mapa; só a página de perfil deixa
            de estar visível.
          </span>
        </span>
      </label>

      {erro && (
        <p className="mt-5 font-body text-[14px] text-destructive leading-relaxed">
          {erro}
        </p>
      )}

      <button
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 font-body text-[15px] text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        disabled={aGuardar}
        type="submit"
      >
        {aGuardar && <Loader2 className="h-4 w-4 animate-spin" />}
        {modo === "boas-vindas" ? "Concluir" : "Guardar alterações"}
      </button>
    </form>
  );
}

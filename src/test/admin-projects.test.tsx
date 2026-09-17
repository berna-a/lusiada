import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { readDemoState, resetDemoState } from "@/lib/projects";
import AdminProjectosPage from "@/pages/admin/AdminProjectosPage";

vi.mock("convex/react", () => ({
  useMutation: () => vi.fn(),
  useQuery: () => undefined,
}));

describe("project administration demonstration", () => {
  beforeEach(() => {
    const values = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        clear: () => values.clear(),
        getItem: (key: string) => values.get(key) ?? null,
        removeItem: (key: string) => values.delete(key),
        setItem: (key: string, value: string) => values.set(key, value),
      },
    });
    resetDemoState();
  });

  it("keeps Novo blank and creates a second published project", async () => {
    render(
      <MemoryRouter>
        <AdminProjectosPage demoMode />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Novo" }));
    const slug = screen.getByLabelText("Endereço (slug)");
    expect(slug).toHaveValue("");

    fireEvent.change(slug, { target: { value: "projecto-novo" } });
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Projecto novo" },
    });
    fireEvent.change(screen.getByLabelText("Resumo"), {
      target: { value: "Resumo do segundo projecto demonstrativo." },
    });
    fireEvent.click(screen.getByLabelText("Publicado"));
    fireEvent.click(screen.getAllByRole("button", { name: "História" })[0]);
    expect(screen.getByRole("heading", { name: "História" })).toBeVisible();
    fireEvent.change(screen.getByLabelText("História"), {
      target: {
        value:
          "Descrição completa do segundo projecto criado no ambiente de teste.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: "Guardar projecto" }));

    await waitFor(() =>
      expect(
        readDemoState().projects.some(
          (project) => project.slug === "projecto-novo" && project.isPublished
        )
      ).toBe(true)
    );
    fireEvent.click(screen.getAllByRole("button", { name: "Essencial" })[0]);
    expect(screen.getByLabelText("Endereço (slug)")).toHaveValue(
      "projecto-novo"
    );
  });

  it("previews an unsaved draft and preserves values between sections", async () => {
    render(
      <MemoryRouter>
        <AdminProjectosPage demoMode />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Novo" }));
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Campanha ainda em rascunho" },
    });
    fireEvent.change(screen.getByLabelText("Resumo"), {
      target: { value: "Resumo que ainda não foi guardado." },
    });
    fireEvent.click(screen.getAllByRole("button", { name: "História" })[0]);
    fireEvent.change(screen.getByLabelText("História"), {
      target: { value: "História actual do formulário." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Preview" }));

    const preview = screen.getByRole("dialog", {
      name: "Pré-visualização local",
    });
    expect(preview).toHaveTextContent("Campanha ainda em rascunho");
    expect(preview).toHaveTextContent("História actual do formulário.");
    expect(readDemoState().projects).toHaveLength(6);

    fireEvent.keyDown(document, { key: "Escape" });
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", {
          name: "Pré-visualização local",
        })
      ).not.toBeInTheDocument()
    );
    expect(screen.getByRole("button", { name: "Preview" })).toHaveFocus();
    fireEvent.click(screen.getAllByRole("button", { name: "Essencial" })[0]);
    expect(screen.getByLabelText("Título")).toHaveValue(
      "Campanha ainda em rascunho"
    );
  });

  it("does not discard unsaved changes when the user chooses to stay", () => {
    const confirm = vi.spyOn(window, "confirm").mockReturnValue(false);
    render(
      <MemoryRouter>
        <AdminProjectosPage demoMode />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Novo" }));
    fireEvent.change(screen.getByLabelText("Título"), {
      target: { value: "Não perder este título" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: /Todas as campanhas Lista/ })
    );
    expect(confirm).toHaveBeenCalledOnce();
    expect(screen.getByLabelText("Título")).toHaveValue(
      "Não perder este título"
    );
    confirm.mockRestore();
  });
});

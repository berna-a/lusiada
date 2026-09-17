import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { PIONEER_PROJECT } from "@/lib/projects";
import ProjectosPage from "@/pages/ProjectosPage";

vi.mock("@/hooks/use-projects", () => ({
  usePublishedProjects: () => ({
    isDemo: false,
    projects: [
      PIONEER_PROJECT,
      {
        ...PIONEER_PROJECT,
        slug: "arquivo-concluido",
        title: "Arquivo concluído",
        summary: "Um projecto concluído usado para testar filtros.",
        status: "completed",
      },
    ],
  }),
}));

describe("projects catalog", () => {
  it("filters by status and searches project titles", () => {
    render(
      <MemoryRouter>
        <ProjectosPage />
      </MemoryRouter>
    );
    const catalog = screen.getByRole("region", {
      name: "Páginas de projectos",
    });
    expect(within(catalog).getByText("Clube de Jogos da Mente")).toBeVisible();
    expect(within(catalog).getByText("Arquivo concluído")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Concluídos/ }));
    expect(
      within(catalog).queryByText("Clube de Jogos da Mente")
    ).not.toBeInTheDocument();
    expect(within(catalog).getByText("Arquivo concluído")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: /Todos/ }));
    fireEvent.change(
      screen.getByRole("searchbox", { name: "Pesquisar projectos" }),
      { target: { value: "mente" } }
    );
    expect(within(catalog).getByText("Clube de Jogos da Mente")).toBeVisible();
    expect(
      within(catalog).queryByText("Arquivo concluído")
    ).not.toBeInTheDocument();
  });
});

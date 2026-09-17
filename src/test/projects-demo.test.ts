import { beforeEach, describe, expect, it } from "vitest";
import {
  confirmDemoContribution,
  demoPublicProjects,
  PIONEER_PROJECT,
  readDemoState,
  resetDemoState,
  revokeDemoContribution,
  saveDemoProject,
} from "@/lib/projects";

describe("local project demonstration", () => {
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

  it("persists a created project and feeds the public catalog", () => {
    saveDemoProject({
      ...PIONEER_PROJECT,
      slug: "projecto-de-teste",
      title: "Projecto de teste",
      isPublished: true,
    });
    expect(
      readDemoState().projects.some((p) => p.slug === "projecto-de-teste")
    ).toBe(true);
    expect(
      demoPublicProjects().some((p) => p.slug === "projecto-de-teste")
    ).toBe(true);
  });

  it("persists edits between reads and hides unpublished projects", () => {
    saveDemoProject(
      { ...PIONEER_PROJECT, title: "Título editado", isPublished: false },
      PIONEER_PROJECT.slug
    );
    expect(
      readDemoState().projects.find(
        (project) => project.slug === PIONEER_PROJECT.slug
      )?.title
    ).toBe("Título editado");
    expect(
      demoPublicProjects().some(
        (project) => project.slug === PIONEER_PROJECT.slug
      )
    ).toBe(false);
  });

  it("keeps confirmed receipts attached when an editor changes the slug", () => {
    confirmDemoContribution({
      projectSlug: PIONEER_PROJECT.slug,
      amountCents: 1500,
      provider: "Conciliação manual",
      reference: "mudanca-slug",
    });
    saveDemoProject(
      { ...PIONEER_PROJECT, slug: "novo-endereco" },
      PIONEER_PROJECT.slug
    );
    const renamed = demoPublicProjects().find(
      (project) => project.slug === "novo-endereco"
    );
    expect(renamed?.slug).toBe("novo-endereco");
    expect(renamed?.confirmedCents).toBe(1500);
  });

  it("keeps intentions outside totals and makes receipt references idempotent", () => {
    const first = confirmDemoContribution({
      projectSlug: PIONEER_PROJECT.slug,
      amountCents: 2500,
      provider: "Conciliação manual",
      reference: "teste-1",
    });
    const second = confirmDemoContribution({
      projectSlug: PIONEER_PROJECT.slug,
      amountCents: 2500,
      provider: "Conciliação manual",
      reference: "teste-1",
    });
    expect(second.id).toBe(first.id);
    expect(
      demoPublicProjects().find(
        (project) => project.slug === PIONEER_PROJECT.slug
      )?.confirmedCents
    ).toBe(2500);
    revokeDemoContribution(first.id);
    expect(
      demoPublicProjects().find(
        (project) => project.slug === PIONEER_PROJECT.slug
      )?.confirmedCents
    ).toBe(0);
    expect(() =>
      confirmDemoContribution({
        projectSlug: PIONEER_PROJECT.slug,
        amountCents: 2500,
        provider: "Conciliação manual",
        reference: "teste-1",
      })
    ).toThrow("recebimento revogado");
  });

  it("rejects a reused reference with different financial data", () => {
    confirmDemoContribution({
      projectSlug: PIONEER_PROJECT.slug,
      amountCents: 2500,
      provider: "Conciliação manual",
      reference: "conflito-1",
    });
    expect(() =>
      confirmDemoContribution({
        projectSlug: PIONEER_PROJECT.slug,
        amountCents: 2600,
        provider: "Conciliação manual",
        reference: "conflito-1",
      })
    ).toThrow("outro valor ou origem");
  });
});

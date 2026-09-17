import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";
import { api } from "../../convex/_generated/api";
import schema from "../../convex/schema";

const modules = import.meta.glob("../../convex/**/*.ts");
const project = {
  slug: "projecto-publico",
  title: "Projecto público",
  eyebrow: null,
  summary: "Um resumo suficientemente completo.",
  description: "Uma descrição longa e verificável para este projecto.",
  cover_image_url: null,
  status: "funding" as const,
  goal_cents: 10_000,
  currency: "EUR" as const,
  budget_note: "Orçamento conhecido.",
  material_needs: ["Material"],
  technical_needs: ["Técnica"],
  volunteer_needs: ["Tempo"],
  updates: [],
  is_published: true,
  updated_at: 1,
};

describe("project handlers", () => {
  it("rejects support for a nonexistent project", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.projects.expressSupport, {
        projectSlug: "nao-existe",
        name: "Pessoa",
        email: "pessoa@example.org",
        supportType: "volunteer",
        message: "Quero ajudar neste projecto.",
      })
    ).rejects.toThrow("Projecto indisponível");
  });

  it("returns an explicit public DTO without editorial or private fields", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("funded_projects", project);
    });
    const value = await t.query(api.projects.bySlug, { slug: project.slug });
    expect(value?.title).toBe(project.title);
    expect(value).not.toHaveProperty("_id");
    expect(value).not.toHaveProperty("is_published");
    expect(value).not.toHaveProperty("updated_at");
  });

  it("deduplicates repeated support within the abuse window", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("funded_projects", project);
    });
    const args = {
      projectSlug: project.slug,
      name: "Pessoa",
      email: "PESSOA@example.org",
      supportType: "material" as const,
      message: "Tenho material que pode ser útil.",
    };
    await t.mutation(api.projects.expressSupport, args);
    await expect(t.mutation(api.projects.expressSupport, args)).rejects.toThrow(
      "intenção recente"
    );
  });

  it("rejects new support after a project is completed", async () => {
    const t = convexTest(schema, modules);
    await t.run(async (ctx) => {
      await ctx.db.insert("funded_projects", {
        ...project,
        slug: "concluido",
        status: "completed",
      });
    });
    await expect(
      t.mutation(api.projects.expressSupport, {
        projectSlug: "concluido",
        name: "Pessoa",
        email: "pessoa@example.org",
        supportType: "volunteer",
        message: "Queria ajudar este projecto.",
      })
    ).rejects.toThrow("Projecto indisponível");
  });

  it("protects admin writes from anonymous callers", async () => {
    const t = convexTest(schema, modules);
    await expect(
      t.mutation(api.projects.adminSave, {
        slug: "novo",
        title: "Novo projecto",
        summary: "Resumo suficientemente longo.",
        description: "Descrição suficientemente longa para validação.",
        goalCents: 1000,
        status: "preparing",
        materialNeeds: [],
        technicalNeeds: [],
        volunteerNeeds: [],
        updates: [],
        isPublished: false,
      })
    ).rejects.toThrow("Não autorizado");
  });
});

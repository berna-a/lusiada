import { describe, expect, it } from "vitest";
import {
  CAMPAIGN_PORTFOLIO,
  PORTFOLIO_CATEGORIES,
  PORTFOLIO_IDEA_COUNT,
  PORTFOLIO_PROJECTS,
} from "@/lib/project-portfolio";
import { REVIEW_PROJECT_SLUGS } from "@/lib/projects";

describe("LUSIADA project portfolio", () => {
  it("groups all 80 source ideas exactly once", () => {
    const ids = PORTFOLIO_PROJECTS.flatMap((project) =>
      project.ideas.map((idea) => idea.id)
    );
    expect(PORTFOLIO_IDEA_COUNT).toBe(80);
    expect(new Set(ids).size).toBe(80);
    expect(ids).toHaveLength(80);
  });

  it("organises projects into the seven editorial categories", () => {
    expect(PORTFOLIO_CATEGORIES).toHaveLength(7);
    expect(PORTFOLIO_PROJECTS).toHaveLength(28);
    expect(
      PORTFOLIO_CATEGORIES.every((category) => category.projects.length > 0)
    ).toBe(true);
  });

  it("links every review page to its portfolio project", () => {
    expect(REVIEW_PROJECT_SLUGS).toHaveLength(6);
    expect(
      REVIEW_PROJECT_SLUGS.every((slug) => CAMPAIGN_PORTFOLIO.has(slug))
    ).toBe(true);
  });
});

import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { demoPublicProjects, type PublicProject } from "@/lib/projects";
import { api } from "../../convex/_generated/api";

function useDemoProjects() {
  const [projects, setProjects] = useState<PublicProject[]>(() =>
    demoPublicProjects()
  );
  useEffect(() => {
    const update = () => setProjects(demoPublicProjects());
    window.addEventListener("storage", update);
    window.addEventListener("lusiada-projects-demo", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("lusiada-projects-demo", update);
    };
  }, []);
  return projects;
}

export function usePublishedProjects() {
  const remote = useQuery(
    api.projects.listPublished,
    import.meta.env.DEV ? "skip" : {}
  );
  const demo = useDemoProjects();
  return {
    projects: import.meta.env.DEV
      ? demo
      : (remote as PublicProject[] | undefined),
    isDemo: import.meta.env.DEV,
  };
}

export function usePublishedProject(slug: string | undefined) {
  const remote = useQuery(
    api.projects.bySlug,
    !import.meta.env.DEV && slug ? { slug } : "skip"
  );
  const demo = useDemoProjects();
  return {
    project: import.meta.env.DEV
      ? (demo.find((p) => p.slug === slug) ?? null)
      : (remote as PublicProject | null | undefined),
    isDemo: import.meta.env.DEV,
  };
}

import { describe, expect, it } from "vitest";
import { templateKeys } from "@/shared/lib/template";
import { projects } from "./data";

describe("project live stats wiring", () => {
    const live = projects.filter((p) => p.liveStats);

    it("has cards with live stats to check", () => {
        expect(live.length).toBeGreaterThan(0);
    });

    it.each(live.map((p) => [p.title, p] as const))("%s: every live label has a KPI tile", (_title, project) => {
        const kpiLabels = new Set(project.kpis.map((k) => k.label));
        for (const label of Object.values(project.liveStats!.mapping)) {
            expect(kpiLabels).toContain(label);
        }
    });

    it.each(projects.map((p) => [p.title, p] as const))("%s: every description placeholder is a live label", (_title, project) => {
        const labels = new Set(Object.values(project.liveStats?.mapping ?? {}));
        for (const key of templateKeys(project.description)) {
            expect(labels).toContain(key);
        }
    });
});

import { describe, expect, it } from "vitest";
import { euros, parseEuroInput } from "@/lib/projects";

describe("project support amounts", () => {
  it("converts euro input to integer cents", () => {
    expect(parseEuroInput("25")).toBe(2500);
    expect(parseEuroInput("12,34")).toBe(1234);
    expect(parseEuroInput("1.005")).toBe(100);
  });

  it("keeps empty amounts optional and rejects unsafe values", () => {
    expect(parseEuroInput(" ")).toBeUndefined();
    expect(parseEuroInput("0")).toBeNull();
    expect(parseEuroInput("not money")).toBeNull();
  });

  it("formats the approved goal without false precision", () => {
    expect(euros(34_500)).toMatch(/345/);
  });
});

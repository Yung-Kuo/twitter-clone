import { describe, expect, it } from "vitest";
import { errMsg } from "~/utils/errMsg";

describe("errMsg", () => {
  it("reads Error.message", () => {
    expect(errMsg(new Error("boom"))).toBe("boom");
  });

  it("reads PostgREST-style objects", () => {
    expect(errMsg({ message: "row not found" })).toBe("row not found");
    expect(errMsg({ details: "detail text" })).toBe("detail text");
  });

  it("stringifies unknown values", () => {
    expect(errMsg(42)).toBe("42");
  });
});

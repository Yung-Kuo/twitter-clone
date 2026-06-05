import { describe, expect, it } from "vitest";
import { isAbsoluteAvatarUrl } from "~/queries/api/avatars";

describe("isAbsoluteAvatarUrl", () => {
  it("detects http(s) avatar URLs", () => {
    expect(isAbsoluteAvatarUrl("https://lh3.googleusercontent.com/a/abc")).toBe(
      true,
    );
    expect(isAbsoluteAvatarUrl("http://example.com/x.png")).toBe(true);
  });

  it("rejects Supabase storage paths", () => {
    expect(isAbsoluteAvatarUrl("0.29073229476260254.jpeg")).toBe(false);
    expect(isAbsoluteAvatarUrl("")).toBe(false);
  });
});

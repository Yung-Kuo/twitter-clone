import { describe, expect, it } from "vitest";
import { fetchProfileOnce } from "~/queries/api/profiles";

describe("fetchProfileOnce", () => {
  it("dedupes parallel calls for the same uid", async () => {
    let calls = 0;
    const client = {
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => {
              calls += 1;
              await new Promise((r) => setTimeout(r, 10));
              return { data: { id: "u1", username: "a" }, error: null };
            },
          }),
        }),
      }),
    };

    const [a, b] = await Promise.all([
      fetchProfileOnce(client as never, "u1"),
      fetchProfileOnce(client as never, "u1"),
    ]);

    expect(calls).toBe(1);
    expect(a?.id).toBe("u1");
    expect(b?.id).toBe("u1");
  });
});

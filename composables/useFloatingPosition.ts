import { computePosition, flip, offset, shift } from "@floating-ui/vue";

type Placement = "top" | "bottom" | "left" | "right";

export async function positionFloatingElement(
  reference: HTMLElement,
  floating: HTMLElement,
  placement: Placement = "bottom",
  offsetPx = 8,
) {
  const { x, y } = await computePosition(reference, floating, {
    placement,
    middleware: [offset(offsetPx), flip(), shift({ padding: 8 })],
  });
  return { left: `${x}px`, top: `${y}px` };
}

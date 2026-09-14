import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement these, but Radix UI's Select uses them for pointer
// interactions. Without these no-op polyfills, opening a Select in a jsdom test throws.
if (typeof window !== "undefined") {
  Element.prototype.hasPointerCapture ??= () => false;
  Element.prototype.setPointerCapture ??= () => {};
  Element.prototype.releasePointerCapture ??= () => {};
  Element.prototype.scrollIntoView ??= () => {};
}

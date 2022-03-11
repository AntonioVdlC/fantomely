import { describe, it, expect } from "vitest";
import isUUID from "./is-uuid";

describe("utils/is-uuid", () => {
  describe("isUUID", () => {
    it("is a function", () => {
      expect(typeof isUUID).toBe("function");
    });

    it("returns true if the argument is a UUID v4", () => {
      expect(isUUID("1bb49151-e286-4c6b-88bb-396fd77a1391")).toBe(true);
    });

    it("returns false if the argument is a UUID v4", () => {
      expect(isUUID("some-random-string")).toBe(false);
    });
  });
});

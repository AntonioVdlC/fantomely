import { describe, it, expect } from "vitest";
import { isValidEmail, isValidURL } from "./is-valid";

describe("utils/is-valid", () => {
  describe("isValidEmail", () => {
    it("is a function", () => {
      expect(typeof isValidEmail).toBe("function");
    });

    it("returns true if passed a valid email", () => {
      expect(isValidEmail("some@email.com")).toBe(true);
    });

    it("returns false if passed a valid email", () => {
      expect(isValidEmail("some-random-string")).toBe(false);
    });
  });

  describe("isValidURL", () => {
    it("is a function", () => {
      expect(typeof isValidURL).toBe("function");
    });

    it("returns true if passed a valid email", () => {
      expect(isValidURL("https://fantomely.com")).toBe(true);
    });

    it("returns false if passed a valid email", () => {
      expect(isValidURL("some-random-string")).toBe(false);
    });
  });
});

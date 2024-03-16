import { describe, it, expect } from "vitest";
import { isValidEmail } from "../../src";

describe("isValidEmail(maybeEmail, opts = {})", () => {
	it("should return true for XYZ", () => {
		expect(isValidEmail("aze.rty@outlook.fr")).toBeTruthy();
	});
});

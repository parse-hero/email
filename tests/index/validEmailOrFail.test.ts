import { describe, it, expect } from "vitest";
import { validEmailOrFail } from "../../src";

describe("validEmailOrFail(maybeEmail, opts = {})", () => {
	it("should not throw on valid emails", () => {
		expect(() => validEmailOrFail("aze.rty@outlook.fr")).not.toThrow();
	});
});

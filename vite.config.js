import { defineConfig } from "vite";
import path from "path";

/**
 * Create an absolute URL to the given URI inside the current directory
 * @param {string} [uri = ""] - The URI to the desired file
 * @returns {string}
 */
const here = (uri = "") => path.resolve(__dirname, uri);

export default defineConfig({
	build: {
		lib: {
			entry: here("src/index.ts"),
			name: "parseHeroEmail",
			formats: ["es", "umd"],
			fileName: (format, entryName) => {
				if (format === "es") {
					return "index.esm.js";
				}

				if (format === "cjs") {
					return "index.cjs.js";
				}

				return "index.js";
			},
		},
		emptyOutDir: true,
		outDir: "dist",
	},
})

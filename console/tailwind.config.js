import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter var", ...defaultTheme.fontFamily.sans]
			},
			colors: {
				// Colors for background in all situations
				"background-primary": "#141420",
				"background-secondary": "#161622",
				"background-tertiary": "#1B1B27",
				"background-accent": "#272A3A",
				"background-success": "#00C48C",
				"background-error": "#ef434b",
				"background-warning": "#FFC82C",
				"background-info": "#272A3A",

				// Colors for text elements
				"body-base": "#C5C8D8",
				"body-secondary": "#C5C8D8",
				"body-subdued": "#616A7B",
				"body-accent": "#F2F2F8",
				"body-info": "#FAFAFF",
				"body-error": "#DB1A5B",
				"body-warning": "#F58801",
				"body-success": "#00C48C",

				// Colors for borders
				"stroke-base": "#272A3A",
				"stroke-accent": "#383C4E",
				"stroke-info": "#016AD4",
				"stroke-error": "#DB1A5B",
				"stroke-warning": "#F58801",
				"stroke-success": "#00C48C",

				// Colors for buttons
				"button-bg-primary": "#016AD4",
				"button-bg-secondary": "#2C3442",
				"button-bg-disabled": "#454C59",
				"button-bg-accent": "#ef434b",
				"button-bg-destructive": "#DB1A5B",
				"button-bg-success": "#00C48C",

				// Colors for button-icon
				"button-icon-primary": "#FFFFFF",
				"button-icon-secondary": "#D2D2D2",
				"button-icon-disabled": "#858585",
				"button-icon-accent": "#FFFFFF",
				"button-icon-destructive": "#FFFFFF",
				"button-icon-success": "#FFFFFF",

				// Colors for button-label
				"button-label-primary": "#FAFAFF",
				"button-label-secondary": "#FAFAFF",
				"button-label-disabled": "#FAFAFF",
				"button-label-accent": "#FFFFFF",
				"button-label-destructive": "#FFFFFF",
				"button-label-success": "#FFFFFF"
			}
		}
	},
	plugins: []
};
